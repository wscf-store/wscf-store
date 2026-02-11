'use client';

import Image from 'next/image';
import Link from 'next/link';
import { IoCartOutline, IoStar, IoHeartOutline } from 'react-icons/io5';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/utils/formatPrice';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-accent/20 hover:shadow-xl hover:shadow-accent/5 transition-all duration-300">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <Link href={`/products/${product.slug || product._id}`}>
          <Image
            src={product.images?.[0]?.url || '/placeholder.png'}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {discount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
              -{discount}%
            </span>
          )}
          {product.isFeatured && (
            <span className="bg-accent text-white text-xs font-bold px-2.5 py-1 rounded-lg">
              Featured
            </span>
          )}
          {product.stock === 0 && (
            <span className="bg-gray-800 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
              Out of Stock
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="w-9 h-9 bg-white rounded-xl shadow-lg flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors">
            <IoHeartOutline className="h-4 w-4" />
          </button>
        </div>

        {/* Add to Cart Overlay */}
        {product.stock > 0 && (
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <button
              onClick={() => addToCart(product)}
              className="w-full flex items-center justify-center gap-2 bg-primary-900 hover:bg-primary-950 text-white py-2.5 rounded-xl text-sm font-semibold shadow-lg transition-colors"
            >
              <IoCartOutline className="h-4 w-4" />
              Add to Cart
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        {product.category && (
          <Link
            href={`/products?category=${product.category.slug}`}
            className="text-xs text-accent font-medium hover:underline"
          >
            {product.category.name}
          </Link>
        )}

        {/* Name */}
        <Link href={`/products/${product.slug || product._id}`}>
          <h3 className="text-sm font-semibold text-primary-900 mt-1 line-clamp-2 hover:text-accent transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        {product.ratings?.count > 0 && (
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <IoStar
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.round(product.ratings.average)
                      ? 'text-amber-400'
                      : 'text-gray-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">({product.ratings.count})</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mt-3">
          <span className="text-lg font-bold text-primary-900">
            {formatPrice(product.price)}
          </span>
          {product.comparePrice && product.comparePrice > product.price && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(product.comparePrice)}
            </span>
          )}
        </div>

        {/* Stock Status */}
        <div className="mt-2">
          {product.stock > 0 ? (
            <span className="text-xs text-emerald-600 font-medium">
              ✓ In Stock ({product.stock} available)
            </span>
          ) : (
            <span className="text-xs text-red-500 font-medium">✕ Out of Stock</span>
          )}
        </div>
      </div>
    </div>
  );
}
