"use client";

import { Package, ShoppingCart, Loader2 } from "lucide-react";

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
  onAddToCart?: (product: Product) => void;
  isAddingToCart?: boolean;
  canEdit?: boolean;
}

export default function ProductCard({ product, onEdit, onDelete, onAddToCart, isAddingToCart, canEdit = true }: ProductCardProps) {
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
          {canEdit && (
            <button
              onClick={() => onEdit(product)}
              className="flex-1 py-1 text-[10px] font-semibold bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
            >
              Editar
            </button>
          )}
          {canEdit && (
            <button
              onClick={() => onDelete(product)}
              className="flex-1 py-1 text-[10px] font-semibold border border-black text-black rounded-full hover:bg-gray-100 transition-colors"
            >
              Eliminar
            </button>
          )}
        </div>

        {onAddToCart && (
          <button
            onClick={() => onAddToCart(product)}
            disabled={isAddingToCart || product.stock < 1}
            className="mt-1.5 w-full py-1 text-[10px] font-semibold bg-koara-primary text-black rounded-full border border-black hover:bg-koara-primary/80 transition-colors disabled:opacity-40 flex items-center justify-center gap-1"
          >
            {isAddingToCart ? (
              <Loader2 size={11} className="animate-spin" />
            ) : (
              <>
                <ShoppingCart size={11} />
                {product.stock < 1 ? "Sin stock" : "Agregar al carrito"}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
