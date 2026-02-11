import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/layout/WhatsAppButton';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

export const metadata = {
  title: {
    default: 'WSCF Store - Premium Mobile Accessories in Pakistan',
    template: '%s | WSCF Store',
  },
  description:
    'Shop premium mobile accessories at WSCF Store. Smartphones, power banks, cables, chargers, phone cases, and earbuds. Free delivery across Pakistan on orders above PKR 5,000.',
  keywords: [
    'mobile accessories',
    'smartphones Pakistan',
    'power bank',
    'USB cables',
    'chargers',
    'phone cases',
    'earbuds',
    'WSCF Store',
    'online shopping Pakistan',
  ],
  authors: [{ name: 'WSCF Store' }],
  openGraph: {
    title: 'WSCF Store - Premium Mobile Accessories',
    description: 'Your trusted destination for premium mobile accessories in Pakistan.',
    type: 'website',
    locale: 'en_US',
    siteName: 'WSCF Store',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WSCF Store - Premium Mobile Accessories',
    description: 'Your trusted destination for premium mobile accessories in Pakistan.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable}`}>
      <body className="font-sans min-h-screen flex flex-col bg-white text-gray-900 antialiased">
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
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <WhatsAppButton />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
