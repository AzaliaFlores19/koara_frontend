"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Search, Plus, ChevronDown, CheckCircle } from "lucide-react";
import DashboardLayout from "@/components/layout/layout";
import ProductCard, { type Product } from "@/components/inventory/ProductCard";
import Pagination from "@/components/inventory/Pagination";
import {
  ManageCategoriesModal,
  CategoryFormModal,
  ConfirmDeleteModal,
} from "@/components/inventory/CategoryModals";
import {
  ProductModal,
  type ProductFormData,
} from "@/components/inventory/ProductModal";
import { ConfirmModal } from "@/components/ConfirmModal";
import { productsApi } from "@/services/products.service";
import { categoriesApi, type Category } from "@/services/categories.service";
import { useCart } from "@/lib/cart-context";
import { isAdmin } from "@/lib/api/auth.api";

const EMPTY_FORM: ProductFormData = {
  name: "",
  code: "",
  description: "",
  price: "",
  stock: "",
  minStock: "",
  category: "",
  image: "",
};

const PRODUCTS_PER_PAGE = 12;

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [apiCategories, setApiCategories] = useState<Category[]>([]);

  const [showManageCategories, setShowManageCategories] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<string | null>(null);

  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [formData, setFormData] = useState<ProductFormData>(EMPTY_FORM);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [confirmData, setConfirmData] = useState<{
    message: string;
    onConfirm: () => void;
  } | null>(null);

  const [addingToCartId, setAddingToCartId] = useState<string | null>(null);
  const { addItem: addItemToCart } = useCart();

  // Solo los administradores pueden crear o editar productos.
  const [canManageProducts, setCanManageProducts] = useState(false);
  useEffect(() => {
    setCanManageProducts(isAdmin());
  }, []);

  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);

  const fetchCategories = useCallback(async () => {
    try {
      const cats = await categoriesApi.getAll();
      setApiCategories(cats);
    } catch {
      // silent fail — dropdown stays empty
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const catId = activeCategory
        ? apiCategories.find((c) => c.name === activeCategory)?.id
        : undefined;
      const result = await productsApi.getAll(
        currentPage,
        PRODUCTS_PER_PAGE,
        search || undefined,
        catId,
      );
      setProducts(result.data);
      setTotalProducts(result.total);
    } catch {
      showToast("Error loading products.");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, search, activeCategory, apiCategories]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleCategoryFilter = (cat: string) => {
    setActiveCategory((prev) => (prev === cat ? null : cat));
    setCurrentPage(1);
  };

  const handleAddCategory = async (name: string) => {
    try {
      await categoriesApi.create(name);
      await fetchCategories();
      setShowAddCategory(false);
      setShowManageCategories(true);
      showToast("Categoría agregada exitosamente.");
    } catch {
      showToast("Error al agregar la categoría.");
    }
  };

  const handleEditCategory = async (newName: string) => {
    if (!editingCategory) return;
    const cat = apiCategories.find((c) => c.name === editingCategory);
    if (!cat) return;
    try {
      await categoriesApi.update(cat.id, newName);
      await fetchCategories();
      if (activeCategory === editingCategory) setActiveCategory(newName);
      setEditingCategory(null);
      setShowManageCategories(true);
      showToast("Categoría actualizada exitosamente.");
    } catch {
      showToast("Error al actualizar la categoría.");
    }
  };

  const handleDeleteCategory = async () => {
    if (!deletingCategory) return;
    const cat = apiCategories.find((c) => c.name === deletingCategory);
    if (!cat) return;
    try {
      await categoriesApi.deactivate(cat.id);
      await fetchCategories();
      if (activeCategory === deletingCategory) setActiveCategory(null);
      setDeletingCategory(null);
      setShowManageCategories(true);
      showToast("Categoría eliminada exitosamente.");
    } catch {
      showToast("Error al eliminar la categoría.");
    }
  };

  const handleOpenAddModal = () => {
    setModalMode("add");
    setFormData(EMPTY_FORM);
    setSelectedId(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setModalMode("edit");
    setFormData({
      name: product.name,
      code: product.code,
      description: product.description,
      price: product.price.toString(),
      stock: product.stock.toString(),
      minStock: product.minStock?.toString() ?? "",
      category: product.category,
      image: product.image ?? "",
    });
    setSelectedId(product.id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData(EMPTY_FORM);
    setSelectedId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const categoryId = apiCategories.find(
        (c) => c.name === formData.category,
      )?.id;
      if (!categoryId) {
        showToast("Selecciona una categoría válida.");
        setIsSubmitting(false);
        return;
      }

      const dto = {
        name: formData.name,
        code_bar: formData.code,
        description: formData.description || undefined,
        category_id: categoryId,
        stock: parseInt(formData.stock),
        min_stock: formData.minStock ? parseInt(formData.minStock) : undefined,
        price: parseFloat(formData.price),
        image: formData.image || undefined,
      };

      if (modalMode === "add") {
        await productsApi.create(dto);
        showToast("Producto agregado exitosamente.");
      } else if (selectedId) {
        await productsApi.update(selectedId, dto);
        showToast("Producto editado exitosamente.");
      }

      handleCloseModal();
      await fetchProducts();
    } catch {
      showToast("Error al guardar el producto.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (product: Product) => {
    setConfirmData({
      message: `¿Estás seguro de que deseas eliminar "${product.name}"? Esta acción no se puede deshacer.`,
      onConfirm: async () => {
        try {
          await productsApi.deactivate(product.id);
          setConfirmData(null);
          showToast("Producto eliminado exitosamente.");
          await fetchProducts();
        } catch {
          showToast("Error al eliminar el producto.");
          setConfirmData(null);
        }
      },
    });
  };

  const handleAddToCart = async (product: Product) => {
    setAddingToCartId(product.id);
    try {
      await addItemToCart(product.id, 1);
      showToast(`"${product.name}" agregado al carrito.`);
    } catch (err: any) {
      showToast(
        err?.response?.data?.message ?? "No se pudo agregar al carrito.",
      );
    } finally {
      setAddingToCartId(null);
    }
  };

  const categoryNames = apiCategories.map((c) => c.name);

  return (
    <DashboardLayout>
      <div className="min-h-screen w-full">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Lista de Productos</h1>
            <div className="flex items-center gap-2">
              {canManageProducts && (
                <button
                  onClick={handleOpenAddModal}
                  className="flex items-center gap-1.5 px-4 py-2 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors"
                >
                  <Plus size={15} />
                  Agregar Producto
                </button>
              )}
              {canManageProducts && (
                <button
                  onClick={() => setShowManageCategories(true)}
                  className="px-4 py-2 bg-white text-black text-sm font-medium rounded-full border border-black hover:bg-gray-50 transition-colors"
                >
                  Gestionar Categorías
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Buscar producto"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white rounded-full text-sm border border-black focus:outline-none focus:ring-2 focus:ring-koara-primary placeholder:text-gray-400"
              />
            </div>

            <div className="relative flex-shrink-0" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((o) => !o)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white text-black text-sm font-medium rounded-full border border-black/20 hover:bg-gray-100 transition-colors whitespace-nowrap"
              >
                {activeCategory ?? "Categoría"}
                <ChevronDown
                  size={14}
                  className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-lg border border-black/5 py-1 z-20">
                  <button
                    onClick={() => {
                      setActiveCategory(null);
                      setCurrentPage(1);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                      activeCategory === null
                        ? "font-semibold bg-koara-primary/30"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    Todas
                  </button>
                  {categoryNames.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        handleCategoryFilter(cat);
                        setDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                        activeCategory === cat
                          ? "font-semibold bg-koara-primary/30"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {isLoading ? (
            <p className="text-center text-gray-400 py-16">
              Cargando productos...
            </p>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={handleOpenEditModal}
                  onDelete={handleDelete}
                  onAddToCart={handleAddToCart}
                  isAddingToCart={addingToCartId === product.id}
                  canEdit={canManageProducts}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-16">
              No se encontraron productos.
            </p>
          )}

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>

      {showManageCategories && (
        <ManageCategoriesModal
          categories={categoryNames}
          onClose={() => setShowManageCategories(false)}
          onAdd={() => {
            setShowManageCategories(false);
            setShowAddCategory(true);
          }}
          onEdit={(cat) => {
            setShowManageCategories(false);
            setEditingCategory(cat);
          }}
          onDelete={(cat) => {
            setShowManageCategories(false);
            setDeletingCategory(cat);
          }}
        />
      )}

      {showAddCategory && (
        <CategoryFormModal
          mode="add"
          onClose={() => {
            setShowAddCategory(false);
            setShowManageCategories(true);
          }}
          onConfirm={handleAddCategory}
        />
      )}

      {editingCategory && (
        <CategoryFormModal
          mode="edit"
          initialValue={editingCategory}
          onClose={() => {
            setEditingCategory(null);
            setShowManageCategories(true);
          }}
          onConfirm={handleEditCategory}
        />
      )}

      {deletingCategory && (
        <ConfirmDeleteModal
          onClose={() => {
            setDeletingCategory(null);
            setShowManageCategories(true);
          }}
          onConfirm={handleDeleteCategory}
        />
      )}

      <ProductModal
        isOpen={isModalOpen}
        mode={modalMode}
        formData={formData}
        categories={categoryNames}
        setFormData={setFormData}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />

      <ConfirmModal
        isOpen={!!confirmData}
        message={confirmData?.message ?? ""}
        onConfirm={() => confirmData?.onConfirm()}
        onCancel={() => setConfirmData(null)}
      />

      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[70] flex items-center gap-3 bg-green-600 text-white rounded-2xl px-7 py-4 shadow-xl text-base font-medium">
          <CheckCircle size={22} className="text-white shrink-0" />
          {toast}
        </div>
      )}
    </DashboardLayout>
  );
}
