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
  image?: string;
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
        className="w-full aspect-square flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: product.imageColor }}
      >
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <Package size={40} className="text-black/20" />
        )}
      </div>

      <div className="px-2 pb-2 pt-1 flex flex-col gap-0.5 flex-1">
        <p className="text-[10px] text-black font-bold uppercase tracking-wide truncate">{product.code}</p>
        <h3 className="font-semibold text-xs text-black leading-tight mt-1 truncate">{product.name}</h3>
        <p className="text-[10px] text-gray-500 leading-snug line-clamp-1">{product.description}</p>
        <p className="text-[10px] text-gray-500">Stock: {product.stock}</p>
        <p className="font-semibold text-xs text-black">L {product.price.toFixed(2)}</p>

        <div className="flex gap-1.5 mt-1.5">
          <button
            onClick={() => onEdit(product)}
            className="flex-1 py-1 text-[10px] font-semibold bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
          >
            Editar
          </button>
          <button
            onClick={() => onDelete(product)}
            className="flex-1 py-1 text-[10px] font-semibold border border-black text-black rounded-full hover:bg-gray-100 transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
