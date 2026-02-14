'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Spinner from '@/components/ui/Spinner';

const categoryIcons = {
  Smartphones: '📱',
  'Power Banks': '🔋',
  'Charging Cables': '🔌',
  Chargers: '⚡',
  'Phone Cases': '🛡️',
  'Earbuds & Audio': '🎧',
};

const categoryColors = [
  'from-blue-500/10 to-blue-600/5 hover:from-blue-500/20 hover:to-blue-600/10 border-blue-200/50',
  'from-green-500/10 to-green-600/5 hover:from-green-500/20 hover:to-green-600/10 border-green-200/50',
  'from-orange-500/10 to-orange-600/5 hover:from-orange-500/20 hover:to-orange-600/10 border-orange-200/50',
  'from-yellow-500/10 to-yellow-600/5 hover:from-yellow-500/20 hover:to-yellow-600/10 border-yellow-200/50',
  'from-purple-500/10 to-purple-600/5 hover:from-purple-500/20 hover:to-purple-600/10 border-purple-200/50',
  'from-pink-500/10 to-pink-600/5 hover:from-pink-500/20 hover:to-pink-600/10 border-pink-200/50',
];

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      });
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-gray-50/80">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-accent/10 px-3 py-1.5 rounded-full text-accent text-sm font-medium mb-3">
            🏷️ Shop by Category
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-primary-900">
            Browse Categories
          </h2>
          <p className="text-gray-500 mt-2 max-w-lg mx-auto">
            Find exactly what you need from our wide range of mobile accessories
          </p>
        </div>

        {loading ? (
          <Spinner size="lg" className="py-12" />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <Link
                key={category._id}
                href={`/products?category=${category.slug}`}
                className={`group relative bg-gradient-to-br ${categoryColors[index % categoryColors.length]} border rounded-2xl p-6 text-center transition-all duration-300 hover:shadow-lg hover:scale-105`}
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {category.icon || categoryIcons[category.name] || '📦'}
                </div>
                <h3 className="font-semibold text-primary-900 text-sm">
                  {category.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {category.productCount || 0} products
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
