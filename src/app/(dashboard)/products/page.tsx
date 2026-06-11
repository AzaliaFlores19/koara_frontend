"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Search, Plus, ChevronDown } from "lucide-react";
import DashboardLayout from "@/components/layout/layout";
import ProductCard, { type Product } from "@/components/inventory/ProductCard";
import Pagination from "@/components/inventory/Pagination";
import {
  ManageCategoriesModal,
  CategoryFormModal,
  ConfirmDeleteModal,
} from "@/components/inventory/CategoryModals";

const CARD_COLORS = ["#F5EDE8", "#F9D5E0", "#E8E8EC", "#EDF5EE"];

const MOCK_PRODUCTS: Product[] = [
  { id: "1",  name: "Clean Mist",     code: "CM001", description: "Bruma suave para refrescar la piel.",      stock: 8,  price: 19.00, category: "Mist",     imageColor: CARD_COLORS[0] },
  { id: "2",  name: "Serum Balance",  code: "SB001", description: "Suero facial de absorción rápida.",        stock: 12, price: 28.00, category: "Serum",    imageColor: CARD_COLORS[1] },
  { id: "3",  name: "Velvet Cream",   code: "VC001", description: "Crema nutritiva premium.",                 stock: 2,  price: 35.00, category: "Cream",    imageColor: CARD_COLORS[2] },
  { id: "4",  name: "Pure Cleanser",  code: "PC001", description: "Limpieza suave y ligera.",                 stock: 7,  price: 18.00, category: "Cleanser", imageColor: CARD_COLORS[3] },
  { id: "5",  name: "Glow Serum",     code: "GS001", description: "Ilumina y unifica el tono de la piel.",   stock: 5,  price: 32.00, category: "Serum",    imageColor: CARD_COLORS[1] },
  { id: "6",  name: "Hydra Cream",    code: "HC001", description: "Hidratación profunda durante 24 horas.",  stock: 9,  price: 25.00, category: "Cream",    imageColor: CARD_COLORS[2] },
  { id: "7",  name: "Fresh Toner",    code: "FT001", description: "Equilibra el pH de la piel.",             stock: 15, price: 22.00, category: "Toner",    imageColor: CARD_COLORS[0] },
  { id: "8",  name: "Repair Oil",     code: "RO001", description: "Aceite reparador de uso facial.",         stock: 3,  price: 42.00, category: "Oil",      imageColor: CARD_COLORS[1] },
  { id: "9",  name: "Eye Cream",      code: "EC001", description: "Reduce ojeras y líneas finas.",           stock: 6,  price: 38.00, category: "Cream",    imageColor: CARD_COLORS[2] },
  { id: "10", name: "Sun Shield",     code: "SS001", description: "Protector solar SPF 50+.",                stock: 20, price: 29.00, category: "SPF",      imageColor: CARD_COLORS[0] },
  { id: "11", name: "Pore Serum",     code: "PS001", description: "Minimiza poros visibles al instante.",    stock: 4,  price: 31.00, category: "Serum",    imageColor: CARD_COLORS[1] },
  { id: "12", name: "Calm Mist",      code: "CM002", description: "Calma y refresca pieles sensibles.",      stock: 11, price: 20.00, category: "Mist",     imageColor: CARD_COLORS[3] },
];

const PRODUCTS_PER_PAGE = 8;

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Category management state
  const [categories, setCategories] = useState<string[]>(() =>
    Array.from(new Set(MOCK_PRODUCTS.map((p) => p.category))).sort()
  );
  const [showManageCategories, setShowManageCategories] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<string | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = useMemo(() => {
    return MOCK_PRODUCTS.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !activeCategory || p.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  const totalPages = Math.ceil(filtered.length / PRODUCTS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleCategoryFilter = (cat: string) => {
    setActiveCategory((prev) => (prev === cat ? null : cat));
    setCurrentPage(1);
  };

  const handleAddCategory = (name: string) => {
    if (!categories.includes(name)) {
      setCategories((prev) => [...prev, name].sort());
    }
    setShowAddCategory(false);
    setShowManageCategories(true);
  };

  const handleEditCategory = (newName: string) => {
    if (!editingCategory) return;
    setCategories((prev) =>
      prev.map((c) => (c === editingCategory ? newName : c)).sort()
    );
    if (activeCategory === editingCategory) setActiveCategory(newName);
    setEditingCategory(null);
    setShowManageCategories(true);
  };

  const handleDeleteCategory = () => {
    if (!deletingCategory) return;
    setCategories((prev) => prev.filter((c) => c !== deletingCategory));
    if (activeCategory === deletingCategory) setActiveCategory(null);
    setDeletingCategory(null);
    setShowManageCategories(true);
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen w-full">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 flex flex-col gap-6">

          {/* Page header */}
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Product List</h1>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-4 py-2 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors">
                <Plus size={15} />
                Add Product
              </button>
              <button
                onClick={() => setShowManageCategories(true)}
                className="px-4 py-2 bg-white text-black text-sm font-medium rounded-full border border-black hover:bg-gray-50 transition-colors"
              >
                Manage Category
              </button>
            </div>
          </div>

          {/* Search + Category dropdown */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search Product"
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
                {activeCategory ?? "Category"}
                <ChevronDown size={14} className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-lg border border-black/5 py-1 z-20">
                  <button
                    onClick={() => { setActiveCategory(null); setCurrentPage(1); setDropdownOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                      activeCategory === null ? "font-semibold bg-koara-primary/30" : "hover:bg-gray-50"
                    }`}
                  >
                    All
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => { handleCategoryFilter(cat); setDropdownOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                        activeCategory === cat ? "font-semibold bg-koara-primary/30" : "hover:bg-gray-50"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product grid */}
          {paginated.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {paginated.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={() => {}}
                  onDelete={() => {}}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-16">No products found.</p>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}

        </div>
      </div>

      {/* Manage Categories modal */}
      {showManageCategories && (
        <ManageCategoriesModal
          categories={categories}
          onClose={() => setShowManageCategories(false)}
          onAdd={() => { setShowManageCategories(false); setShowAddCategory(true); }}
          onEdit={(cat) => { setShowManageCategories(false); setEditingCategory(cat); }}
          onDelete={(cat) => { setShowManageCategories(false); setDeletingCategory(cat); }}
        />
      )}

      {/* Add Category modal */}
      {showAddCategory && (
        <CategoryFormModal
          mode="add"
          onClose={() => { setShowAddCategory(false); setShowManageCategories(true); }}
          onConfirm={handleAddCategory}
        />
      )}

      {/* Edit Category modal */}
      {editingCategory && (
        <CategoryFormModal
          mode="edit"
          initialValue={editingCategory}
          onClose={() => { setEditingCategory(null); setShowManageCategories(true); }}
          onConfirm={handleEditCategory}
        />
      )}

      {/* Delete Category confirmation */}
      {deletingCategory && (
        <ConfirmDeleteModal
          onClose={() => { setDeletingCategory(null); setShowManageCategories(true); }}
          onConfirm={handleDeleteCategory}
        />
      )}
    </DashboardLayout>
  );
}
