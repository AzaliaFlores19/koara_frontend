"use client";

import { Package } from "lucide-react";

export interface Product {
  id: string;
  name: string;
  code: string;
  description: string;
  stock: number;
  minStock?: number;
  price: number;
  category: string;
  imageColor: string;
}

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export default function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-black flex flex-col">
      <div
        className="h-28 flex items-center justify-center"
        style={{ backgroundColor: product.imageColor }}
      >
        <Package size={32} className="text-black/20" />
      </div>

      <div className="px-3 pb-3 pt-1.5 flex flex-col gap-0.5 flex-1">
        <p className="text-xs text-black font-bold uppercase tracking-wide">{product.code}</p>
        <h3 className="font-semibold text-sm text-black leading-tight mt-2">{product.name}</h3>
        <p className="text-xs text-gray-500 leading-snug line-clamp-2">{product.description}</p>
        <p className="text-xs text-gray-500 mt-1">Stock: {product.stock}</p>
        <p className="font-semibold text-sm text-black">${product.price.toFixed(2)}</p>

        <div className="flex gap-2 mt-2">
          <button
            onClick={() => onEdit(product)}
            className="flex-1 py-1.5 text-xs font-semibold bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(product)}
            className="flex-1 py-1.5 text-xs font-semibold border border-black text-black rounded-full hover:bg-gray-100 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
