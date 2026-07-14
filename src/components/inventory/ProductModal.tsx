"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, ImagePlus, ChevronDown } from "lucide-react";
import { apiClient } from "@/lib/api/axios";
import { AlertModal } from "@/components/AlertModal";

export interface ProductFormData {
  name: string;
  code: string;
  description: string;
  price: string;
  stock: string;
  minStock: string;
  category: string;
  image: string;
}

interface ProductModalProps {
  isOpen: boolean;
  mode: "add" | "edit";
  formData: ProductFormData;
  categories: string[];
  setFormData: (data: ProductFormData) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

function resizeToSquare(file: File, size = 800): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, size, size);
      const scale = Math.min(size / img.width, size / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      const x = (size - w) / 2;
      const y = (size - h) / 2;
      ctx.drawImage(img, x, y, w, h);
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("resize failed"))),
        "image/jpeg",
        0.85
      );
    };
    img.onerror = reject;
    img.src = url;
  });
}

export function ProductModal({
  isOpen,
  mode,
  formData,
  categories,
  setFormData,
  onClose,
  onSubmit,
  isSubmitting,
}: ProductModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadErrorOpen, setIsUploadErrorOpen] = useState(false);
  const [isCatOpen, setIsCatOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const blob = await resizeToSquare(file);
      const form = new FormData();
      form.append("file", blob, "product.jpg");
      const { data } = await apiClient.post("/upload/image", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFormData({ ...formData, image: data.url });
    } catch {
      setIsUploadErrorOpen(true);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm animate-koara-fade"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-[61] overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="koara-modal-card animate-koara-modal w-full">
            <h2 className="text-2xl font-bold mb-6 text-black">
              {mode === "add" ? "Agregar Producto" : "Editar Producto"}
            </h2>

            <form onSubmit={onSubmit} className="space-y-4">

              {/* Image upload */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-black uppercase tracking-wider">Imagen</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-32 rounded-xl border border-slate-900 flex items-center justify-center cursor-pointer overflow-hidden hover:bg-gray-50 transition-colors"
                >
                  {isUploading ? (
                    <Loader2 size={24} className="animate-spin text-gray-400" />
                  ) : formData.image ? (
                    <img src={formData.image} alt="preview" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-gray-400">
                      <ImagePlus size={24} />
                      <span className="text-xs">Subir imagen</span>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-black uppercase tracking-wider">Nombre</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="koara-input-field"
                  placeholder="Nombre del producto"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-black uppercase tracking-wider">Código</label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="koara-input-field"
                  placeholder="Ej. CM001"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-black uppercase tracking-wider">Descripción</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="koara-input-field"
                  placeholder="Descripción breve del producto"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-black uppercase tracking-wider">Precio (L)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="koara-input-field"
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-black uppercase tracking-wider">Stock</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="koara-input-field"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-black uppercase tracking-wider">Stock Mínimo</label>
                <input
                  type="number"
                  min="0"
                  value={formData.minStock}
                  onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                  className="koara-input-field"
                  placeholder="0"
                />
              </div>

              <div className="space-y-1.5 relative">
                <label className="text-xs font-bold text-black uppercase tracking-wider">Categoría</label>
                <button
                  type="button"
                  onClick={() => setIsCatOpen(!isCatOpen)}
                  className="w-full bg-white border-2 border-slate-900 rounded-xl px-4 py-2 font-bold text-sm text-left outline-none flex justify-between items-center"
                >
                  {formData.category || "Selecciona una categoría"}
                  <ChevronDown size={16} className={`transition-transform ${isCatOpen ? "rotate-180" : ""}`} />
                </button>
                {isCatOpen && (
                  <div className="absolute z-50 w-full bottom-full mb-1 max-h-60 overflow-y-auto bg-white border-2 border-slate-900 rounded-xl shadow-xl py-1 scrollbar-thin scrollbar-thumb-gray-300">
                    {categories.map((cat) => (
                      <div
                        key={cat}
                        onClick={() => {
                          setFormData({ ...formData, category: cat });
                          setIsCatOpen(false);
                        }}
                        className={`px-4 py-2 text-sm cursor-pointer transition-colors ${
                          formData.category === cat ? "bg-koara-primary font-bold" : "hover:bg-gray-100"
                        }`}
                      >
                        {cat}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-2">
                <button type="button" onClick={onClose} className="koara-btn-cancel">
                  Cancelar
                </button>
                <button type="submit" disabled={isSubmitting || isUploading} className="koara-btn-pink">
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : "Confirmar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <AlertModal
        isOpen={isUploadErrorOpen}
        title="Error al subir imagen"
        message="Error al subir la imagen. Intenta de nuevo."
        onClose={() => setIsUploadErrorOpen(false)}
      />
    </>
  );
}
