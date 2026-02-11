'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/products/ProductCard';
import Spinner from '@/components/ui/Spinner';
import { IoArrowForward } from 'react-icons/io5';

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeatured();
  }, []);

  const fetchFeatured = async () => {
    try {
      const res = await fetch('/api/products?featured=true&limit=8');
      const data = await res.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Failed to fetch featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 bg-accent/10 px-3 py-1.5 rounded-full text-accent text-sm font-medium mb-3">
              ⭐ Featured Collection
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-primary-900">
              Best Selling Products
            </h2>
            <p className="text-gray-500 mt-2 max-w-lg">
              Handpicked selection of our most popular products loved by thousands of customers
            </p>
          </div>
          <Link
            href="/products"
            className="hidden sm:inline-flex items-center gap-2 text-accent font-semibold hover:gap-3 transition-all"
          >
            View All
            <IoArrowForward className="h-5 w-5" />
          </Link>
        </div>

        {loading ? (
          <Spinner size="lg" className="py-20" />
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">
            <p>No featured products yet. Seed the database to get started.</p>
          </div>
        )}

        <div className="sm:hidden mt-8 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-xl font-semibold"
          >
            View All Products
            <IoArrowForward className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
