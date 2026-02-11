'use client';

import { IoStar } from 'react-icons/io5';

const testimonials = [
  {
    name: 'Ahmed Khan',
    location: 'Islamabad',
    rating: 5,
    text: 'Excellent quality products! I ordered a WSCF Pro Max and the 65W charger. Both arrived in perfect condition within 2 days. Highly recommended!',
    avatar: 'A',
  },
  {
    name: 'Fatima Zahra',
    location: 'Karachi',
    rating: 5,
    text: 'Best mobile accessories store in Pakistan. The power bank I bought has been amazing - charges my phone super fast and the build quality is premium.',
    avatar: 'F',
  },
  {
    name: 'Muhammad Ali',
    location: 'Lahore',
    rating: 5,
    text: 'I have been buying from WSCF Store for 6 months now. Their cables are the most durable I have ever used. Customer service is also very responsive on WhatsApp.',
    avatar: 'M',
  },
  {
    name: 'Sarah Malik',
    location: 'Rawalpindi',
    rating: 4,
    text: 'Great shopping experience! The earbuds I ordered have amazing sound quality. Packaging was very professional too. Will definitely order again.',
    avatar: 'S',
  },
  {
    name: 'Hassan Raza',
    location: 'Faisalabad',
    rating: 5,
    text: 'Ordered the armor case and wireless charger. Both are premium quality. The website is easy to use and payment was seamless. 5 stars!',
    avatar: 'H',
  },
  {
    name: 'Ayesha Siddiqui',
    location: 'Peshawar',
    rating: 5,
    text: 'Free shipping on orders above 5000 is a great deal. I always stock up on cables and accessories from here. Genuine products at fair prices.',
    avatar: 'A',
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-accent/10 px-3 py-1.5 rounded-full text-accent text-sm font-medium mb-3">
            💬 Customer Reviews
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-primary-900">
            What Our Customers Say
          </h2>
          <p className="text-gray-500 mt-2 max-w-lg mx-auto">
            Join thousands of satisfied customers across Pakistan
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group bg-gray-50 hover:bg-white rounded-2xl p-6 border border-gray-100 hover:border-accent/20 hover:shadow-xl hover:shadow-accent/5 transition-all duration-300"
            >
              {/* Stars */}
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <IoStar
                    key={i}
                    className={`h-4 w-4 ${
                      i < testimonial.rating ? 'text-amber-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>

              {/* Text */}
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                &ldquo;{testimonial.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-accent to-blue-700 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {testimonial.avatar}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-primary-900">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-gray-500">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
