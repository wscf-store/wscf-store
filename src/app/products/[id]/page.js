'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import ProductImages from '@/components/products/ProductImages';
import ProductCard from '@/components/products/ProductCard';
import WhatsAppButton from '@/components/layout/WhatsAppButton';
import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';
import { formatPrice } from '@/utils/formatPrice';
import {
  IoCartOutline,
  IoStar,
  IoShieldCheckmark,
  IoRocket,
  IoRefresh,
  IoLogoWhatsapp,
  IoChevronForward,
  IoRemoveOutline,
  IoAddOutline,
} from 'react-icons/io5';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        setProduct(data.product);
        setRelated(data.related || []);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <Spinner size="lg" className="py-40" />;
  if (!product) {
    return (
      <div className="text-center py-40">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
        <Link href="/products" className="text-accent hover:underline">
          Browse all products
        </Link>
      </div>
    );
  }

  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const whatsappMessage = `Hi! I'm interested in "${product.name}" (${formatPrice(product.price)}) from WSCF Store. Can you provide more details?`;
  const whatsappUrl = `https://wa.me/${(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+92XXXXXXXXXX').replace(/[^0-9+]/g, '')}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <>
      <div className="bg-gray-50 min-h-screen">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-accent">Home</Link>
            <IoChevronForward className="h-3 w-3" />
            <Link href="/products" className="hover:text-accent">Products</Link>
            <IoChevronForward className="h-3 w-3" />
            {product.category && (
              <>
                <Link
                  href={`/products?category=${product.category.slug}`}
                  className="hover:text-accent"
                >
                  {product.category.name}
                </Link>
                <IoChevronForward className="h-3 w-3" />
              </>
            )}
            <span className="text-gray-900 font-medium truncate">{product.name}</span>
          </nav>
        </div>

        {/* Product Details */}
        <div className="max-w-7xl mx-auto px-4 pb-16">
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-12 p-6 lg:p-10">
              {/* Images */}
              <ProductImages images={product.images} />

              {/* Info */}
              <div className="mt-6 lg:mt-0">
                {/* Category */}
                {product.category && (
                  <Link
                    href={`/products?category=${product.category.slug}`}
                    className="text-sm text-accent font-medium hover:underline"
                  >
                    {product.category.name}
                  </Link>
                )}

                <h1 className="text-2xl lg:text-3xl font-bold text-primary-900 mt-2">
                  {product.name}
                </h1>

                {/* Rating */}
                {product.ratings?.count > 0 && (
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <IoStar
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.round(product.ratings.average)
                              ? 'text-amber-400'
                              : 'text-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {product.ratings.average} ({product.ratings.count} reviews)
                    </span>
                    {product.sold > 0 && (
                      <span className="text-sm text-gray-400">
                        · {product.sold} sold
                      </span>
                    )}
                  </div>
                )}

                {/* Price */}
                <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-primary-900">
                      {formatPrice(product.price)}
                    </span>
                    {product.comparePrice && product.comparePrice > product.price && (
                      <>
                        <span className="text-lg text-gray-400 line-through">
                          {formatPrice(product.comparePrice)}
                        </span>
                        <span className="bg-red-100 text-red-700 text-sm font-bold px-2.5 py-1 rounded-lg">
                          {discount}% OFF
                        </span>
                      </>
                    )}
                  </div>
                  {product.comparePrice && (
                    <p className="text-sm text-emerald-600 font-medium mt-1">
                      You save {formatPrice(product.comparePrice - product.price)}!
                    </p>
                  )}
                </div>

                {/* Short Description */}
                {product.shortDescription && (
                  <p className="text-gray-600 mt-4 leading-relaxed">
                    {product.shortDescription}
                  </p>
                )}

                {/* Features */}
                {product.features?.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {product.features.map((feature, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium"
                      >
                        ✓ {feature}
                      </span>
                    ))}
                  </div>
                )}

                {/* Stock */}
                <div className="mt-6">
                  {product.stock > 0 ? (
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-emerald-600 font-medium text-sm">
                        In Stock ({product.stock} available)
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 bg-red-500 rounded-full" />
                      <span className="text-red-600 font-medium text-sm">Out of Stock</span>
                    </div>
                  )}
                </div>

                {/* Quantity & Add to Cart */}
                {product.stock > 0 && (
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-gray-700">Quantity:</span>
                      <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        >
                          <IoRemoveOutline className="h-4 w-4" />
                        </button>
                        <span className="w-12 h-10 flex items-center justify-center text-sm font-semibold border-x border-gray-200">
                          {quantity}
                        </span>
                        <button
                          onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                          className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        >
                          <IoAddOutline className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        onClick={() => addToCart(product, quantity)}
                        size="lg"
                        className="flex-1"
                        icon={IoCartOutline}
                      >
                        Add to Cart
                      </Button>
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-3.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold transition-colors flex items-center gap-2 shadow-lg shadow-green-500/25"
                      >
                        <IoLogoWhatsapp className="h-5 w-5" />
                        <span className="hidden sm:inline">Order via WhatsApp</span>
                      </a>
                    </div>
                  </div>
                )}

                {/* Trust Badges */}
                <div className="mt-8 grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="text-center">
                    <IoShieldCheckmark className="h-6 w-6 text-accent mx-auto mb-1" />
                    <p className="text-xs text-gray-600 font-medium">Genuine Product</p>
                  </div>
                  <div className="text-center">
                    <IoRocket className="h-6 w-6 text-accent mx-auto mb-1" />
                    <p className="text-xs text-gray-600 font-medium">Fast Delivery</p>
                  </div>
                  <div className="text-center">
                    <IoRefresh className="h-6 w-6 text-accent mx-auto mb-1" />
                    <p className="text-xs text-gray-600 font-medium">Easy Returns</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-t border-gray-100">
              <div className="flex gap-0 border-b border-gray-100 px-6 lg:px-10">
                {['description', 'specifications', 'reviews'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-4 text-sm font-medium capitalize transition-colors relative ${
                      activeTab === tab
                        ? 'text-accent'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
                    )}
                  </button>
                ))}
              </div>

              <div className="p-6 lg:p-10">
                {activeTab === 'description' && (
                  <div className="prose max-w-none text-gray-600 leading-relaxed">
                    <p>{product.description}</p>
                  </div>
                )}

                {activeTab === 'specifications' && (
                  <div>
                    {product.specifications?.length > 0 ? (
                      <table className="w-full max-w-lg">
                        <tbody>
                          {product.specifications.map((spec, i) => (
                            <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : ''}>
                              <td className="py-3 px-4 text-sm font-medium text-gray-900">
                                {spec.key}
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-600">
                                {spec.value}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p className="text-gray-500">No specifications available.</p>
                    )}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Customer reviews coming soon.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Related Products */}
          {related.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-primary-900 mb-8">
                Related Products
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {related.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <WhatsAppButton productName={product.name} />
    </>
  );
}
