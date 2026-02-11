'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { IoArrowForward, IoShieldCheckmark, IoRocket, IoHeart } from 'react-icons/io5';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-[#0d1f3c] to-primary-950">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-3xl" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-blue-300 text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Pakistan&apos;s #1 Mobile Accessories Store
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight">
              Premium{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-400">
                Mobile
              </span>{' '}
              Accessories
            </h1>

            <p className="mt-6 text-lg text-gray-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Discover top-quality smartphones, power banks, cables, chargers, and
              more at unbeatable prices. Fast delivery across Pakistan.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Link
                href="/products"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-accent hover:bg-blue-600 text-white rounded-xl font-semibold shadow-2xl shadow-accent/30 hover:shadow-accent/50 transition-all duration-300 hover:scale-105"
              >
                Shop Now
                <IoArrowForward className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/products?featured=true"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/20 text-white rounded-xl font-semibold hover:bg-white/10 transition-all duration-300"
              >
                View Featured
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 grid grid-cols-3 gap-6 max-w-lg mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-white">10K+</div>
                <div className="text-xs text-gray-400">Happy Customers</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-white">500+</div>
                <div className="text-xs text-gray-400">Products</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-white">4.9★</div>
                <div className="text-xs text-gray-400">Average Rating</div>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Feature Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="relative">
              {/* Main Feature Card */}
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-2xl p-6 hover:bg-white/15 transition-colors cursor-pointer group">
                    <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <IoRocket className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="text-white font-semibold mb-1">Fast Delivery</h3>
                    <p className="text-gray-400 text-sm">2-3 day nationwide delivery</p>
                  </div>

                  <div className="bg-white/10 rounded-2xl p-6 hover:bg-white/15 transition-colors cursor-pointer group">
                    <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <IoShieldCheckmark className="h-6 w-6 text-green-400" />
                    </div>
                    <h3 className="text-white font-semibold mb-1">100% Genuine</h3>
                    <p className="text-gray-400 text-sm">Authentic products guaranteed</p>
                  </div>

                  <div className="bg-white/10 rounded-2xl p-6 hover:bg-white/15 transition-colors cursor-pointer group">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <IoHeart className="h-6 w-6 text-purple-400" />
                    </div>
                    <h3 className="text-white font-semibold mb-1">Best Prices</h3>
                    <p className="text-gray-400 text-sm">Competitive market pricing</p>
                  </div>

                  <div className="bg-white/10 rounded-2xl p-6 hover:bg-white/15 transition-colors cursor-pointer group">
                    <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <svg className="h-6 w-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <h3 className="text-white font-semibold mb-1">24/7 Support</h3>
                    <p className="text-gray-400 text-sm">WhatsApp & phone support</p>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-accent to-blue-400 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-xl animate-float">
                🔥 Hot Deals!
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
