'use client';

import { useState } from 'react';
import { IoLocationSharp, IoCall, IoMail, IoLogoWhatsapp, IoTime, IoSend } from 'react-icons/io5';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { WHATSAPP_NUMBER } from '@/utils/constants';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }
    setLoading(true);
    // Simulate sending – in production, wire up an email API (e.g. Resend, Nodemailer)
    await new Promise((r) => setTimeout(r, 1500));
    toast.success('Message sent successfully! We\'ll get back to you within 24 hours.');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    setLoading(false);
  };

  return (
    <div className="bg-white">
      {/* Hero */}
      <div className="bg-primary-900 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Have questions? We&apos;d love to hear from you. Reach out to us through any of the channels below.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-primary-900 mb-6">Get in Touch</h2>
              <p className="text-gray-500 mb-8">
                We&apos;re here to help! Whether you have a question about a product, need help with an order,
                or just want to say hello – we&apos;re all ears.
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  icon: IoLocationSharp,
                  title: 'Address',
                  content: 'WSCF Store, Main Boulevard,\nLahore, Punjab, Pakistan',
                  color: 'bg-blue-100 text-blue-600',
                },
                {
                  icon: IoCall,
                  title: 'Phone',
                  content: '+92 300 1234567',
                  color: 'bg-green-100 text-green-600',
                },
                {
                  icon: IoMail,
                  title: 'Email',
                  content: 'support@wscfstore.com',
                  color: 'bg-purple-100 text-purple-600',
                },
                {
                  icon: IoTime,
                  title: 'Working Hours',
                  content: 'Monday – Saturday: 10 AM – 9 PM\nSunday: 12 PM – 6 PM',
                  color: 'bg-orange-100 text-orange-600',
                },
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-12 h-12 ${item.color} rounded-xl flex items-center justify-center`}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-900">{item.title}</h3>
                    <p className="text-gray-500 text-sm whitespace-pre-line">{item.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* WhatsApp CTA */}
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi, I'd like to get in touch with WSCF Store.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold transition-all w-full justify-center"
            >
              <IoLogoWhatsapp className="h-5 w-5" />
              Chat on WhatsApp
            </a>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-gray-50 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-primary-900 mb-6">Send a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Input
                    label="Full Name *"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                  />
                  <Input
                    label="Email Address *"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Input
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+92 300 1234567"
                  />
                  <Input
                    label="Subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What is this regarding?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    placeholder="Tell us how we can help..."
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all resize-none text-sm"
                  />
                </div>
                <Button type="submit" loading={loading} size="lg" className="w-full sm:w-auto">
                  <IoSend className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
