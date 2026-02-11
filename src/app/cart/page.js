'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { formatPrice } from '@/utils/formatPrice';
import {
  IoTrashOutline,
  IoCartOutline,
  IoArrowForward,
  IoRemoveOutline,
  IoAddOutline,
  IoTicketOutline,
} from 'react-icons/io5';

export default function CartPage() {
  const {
    cart,
    itemCount,
    subtotal,
    shippingCost,
    coupon,
    couponDiscount,
    total,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyCoupon,
    removeCoupon,
  } = useCart();
  const { token, isAuthenticated } = useAuth();
  const [couponCode, setCouponCode] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setApplyingCoupon(true);
    try {
      await applyCoupon(couponCode.trim(), token);
      setCouponCode('');
    } catch (error) {
      // Error handled in context
    } finally {
      setApplyingCoupon(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <IoCartOutline className="h-12 w-12 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 text-center">
          Looks like you haven&apos;t added any products yet.
        </p>
        <Link href="/products">
          <Button icon={IoArrowForward} size="lg">
            Start Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
        <h1 className="text-3xl font-bold text-primary-900 mb-8">
          Shopping Cart ({itemCount} items)
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 flex gap-4"
              >
                {/* Image */}
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 bg-gray-50 rounded-xl overflow-hidden shrink-0">
                  <Image
                    src={item.image || '/placeholder.png'}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/products/${item._id}`}
                    className="text-sm sm:text-base font-semibold text-primary-900 hover:text-accent transition-colors line-clamp-2"
                  >
                    {item.name}
                  </Link>

                  <p className="text-lg font-bold text-primary-900 mt-2">
                    {formatPrice(item.price)}
                  </p>

                  <div className="flex items-center justify-between mt-4">
                    {/* Quantity */}
                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50"
                      >
                        <IoRemoveOutline className="h-3 w-3" />
                      </button>
                      <span className="w-10 h-8 flex items-center justify-center text-sm font-semibold border-x border-gray-200">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
                      >
                        <IoAddOutline className="h-3 w-3" />
                      </button>
                    </div>

                    {/* Subtotal & Remove */}
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-gray-900">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <IoTrashOutline className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={clearCart}
              className="text-sm text-red-500 hover:text-red-600 font-medium"
            >
              Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>

              {/* Coupon */}
              {isAuthenticated && (
                <div className="mb-6">
                  {coupon ? (
                    <div className="flex items-center justify-between bg-green-50 p-3 rounded-xl">
                      <div className="flex items-center gap-2">
                        <IoTicketOutline className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-700">
                          {coupon.code}
                        </span>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-sm text-red-500 hover:text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Coupon code"
                        className="text-sm"
                      />
                      <Button
                        onClick={handleApplyCoupon}
                        loading={applyingCoupon}
                        variant="outline"
                        size="md"
                      >
                        Apply
                      </Button>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">{formatPrice(subtotal)}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-semibold">-{formatPrice(couponDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">
                    {shippingCost === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      formatPrice(shippingCost)
                    )}
                  </span>
                </div>
                {subtotal < 5000 && (
                  <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded-lg">
                    Add {formatPrice(5000 - subtotal)} more for free shipping!
                  </p>
                )}
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-bold text-gray-900 text-base">Total</span>
                  <span className="font-bold text-primary-900 text-lg">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                {isAuthenticated ? (
                  <Link href="/checkout">
                    <Button size="lg" className="w-full" icon={IoArrowForward}>
                      Proceed to Checkout
                    </Button>
                  </Link>
                ) : (
                  <Link href="/login?redirect=/checkout">
                    <Button size="lg" className="w-full">
                      Login to Checkout
                    </Button>
                  </Link>
                )}
              </div>

              <Link
                href="/products"
                className="block text-center text-sm text-accent hover:underline mt-4"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
