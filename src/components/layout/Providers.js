'use client';

import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';

export function Providers({ children }) {
  return (
    <AuthProvider>
      <CartProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#0F172A',
              color: '#fff',
              borderRadius: '12px',
              padding: '12px 20px',
              fontSize: '14px',
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
        {children}
      </CartProvider>
    </AuthProvider>
  );
}
