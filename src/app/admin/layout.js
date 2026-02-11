'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  IoGridOutline,
  IoGrid,
  IoCubeOutline,
  IoCube,
  IoReceiptOutline,
  IoReceipt,
  IoLayersOutline,
  IoLayers,
  IoTicketOutline,
  IoTicket,
  IoPeopleOutline,
  IoPeople,
  IoSettingsOutline,
  IoSettings,
  IoStorefrontOutline,
  IoMenuOutline,
  IoCloseOutline,
  IoChevronBack,
} from 'react-icons/io5';
import { useAuth } from '@/context/AuthContext';
import Spinner from '@/components/ui/Spinner';

const sidebarLinks = [
  { href: '/admin', label: 'Dashboard', icon: IoGridOutline, activeIcon: IoGrid },
  { href: '/admin/products', label: 'Products', icon: IoCubeOutline, activeIcon: IoCube },
  { href: '/admin/orders', label: 'Orders', icon: IoReceiptOutline, activeIcon: IoReceipt },
  { href: '/admin/categories', label: 'Categories', icon: IoLayersOutline, activeIcon: IoLayers },
  { href: '/admin/coupons', label: 'Coupons', icon: IoTicketOutline, activeIcon: IoTicket },
];

export default function AdminLayout({ children }) {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push('/login?redirect=/admin');
    }
  }, [user, isAdmin, loading, router]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-primary-900 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-2">
            <IoStorefrontOutline className="h-6 w-6 text-accent" />
            <span className="font-bold text-lg">WSCF Admin</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
            <IoCloseOutline className="h-6 w-6" />
          </button>
        </div>

        <nav className="px-4 py-6 space-y-1">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = isActive ? link.activeIcon : link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-accent text-white shadow-lg shadow-accent/25'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="h-5 w-5" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-3 text-gray-400 hover:text-white text-sm transition-colors"
          >
            <IoChevronBack className="h-4 w-4" />
            Back to Store
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-gray-600 hover:text-gray-900"
            >
              <IoMenuOutline className="h-6 w-6" />
            </button>
            <div className="hidden lg:block" />
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-semibold text-primary-900">{user?.name}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <div className="w-9 h-9 bg-accent rounded-full flex items-center justify-center text-white font-bold text-sm">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="p-4 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
