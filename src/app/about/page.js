import { IoShieldCheckmark, IoRocket, IoHeart, IoPeople, IoStar } from 'react-icons/io5';

export const metadata = {
  title: 'About Us - WSCF Store',
  description: 'Learn about WSCF Store - Pakistan\'s trusted destination for premium mobile accessories.',
};

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <div className="bg-primary-900 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">About WSCF Store</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Pakistan&apos;s most trusted destination for premium mobile accessories, smartphones, and tech gadgets since 2020.
          </p>
        </div>
      </div>

      {/* Story */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-primary-900 mb-6">Our Story</h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            WSCF Store was founded with a simple mission: to provide Pakistani consumers with genuine,
            high-quality mobile accessories at fair prices. We noticed that the market was flooded with
            counterfeit products that break within weeks, and we wanted to change that.
          </p>
          <p className="text-gray-600 text-lg leading-relaxed">
            Today, we serve over 10,000 happy customers across Pakistan, offering a carefully curated
            selection of smartphones, power banks, charging cables, chargers, phone cases, and audio
            accessories. Every product on our store is tested for quality and backed by our satisfaction guarantee.
          </p>
        </div>
      </div>

      {/* Values */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-primary-900 text-center mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: IoShieldCheckmark,
                title: '100% Genuine Products',
                description: 'Every product is authentic and verified. We never sell counterfeit items.',
                color: 'text-blue-500 bg-blue-100',
              },
              {
                icon: IoRocket,
                title: 'Fast Delivery',
                description: 'Nationwide delivery within 2-3 business days. Free shipping on orders above PKR 5,000.',
                color: 'text-green-500 bg-green-100',
              },
              {
                icon: IoHeart,
                title: 'Best Prices',
                description: 'We offer competitive pricing. Get premium quality without breaking the bank.',
                color: 'text-red-500 bg-red-100',
              },
              {
                icon: IoPeople,
                title: '24/7 Support',
                description: 'Our support team is always ready to help via WhatsApp, phone, or email.',
                color: 'text-purple-500 bg-purple-100',
              },
            ].map((item, index) => (
              <div key={index} className="text-center p-6">
                <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <item.icon className="h-8 w-8" />
                </div>
                <h3 className="font-bold text-primary-900 text-lg mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: '10,000+', label: 'Happy Customers' },
              { value: '500+', label: 'Products' },
              { value: '4.9/5', label: 'Average Rating' },
              { value: '50+', label: 'Cities Served' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-accent mb-2">{stat.value}</div>
                <div className="text-gray-500 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
