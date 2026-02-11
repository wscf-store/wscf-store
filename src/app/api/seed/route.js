import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Category from '@/models/Category';
import Product from '@/models/Product';
import Coupon from '@/models/Coupon';

async function seedDatabase() {
  try {
    await connectDB();

    // Check if already seeded
    const existingAdmin = await User.findOne({ email: 'admin@wscfstore.com' });
    if (existingAdmin) {
      return NextResponse.json({ message: 'Database already seeded' });
    }

    // Create admin user
    const admin = await User.create({
      name: 'WSCF Admin',
      email: 'admin@wscfstore.com',
      password: 'admin123456',
      role: 'admin',
      phone: '+92XXXXXXXXXX',
    });

    // Create test user
    await User.create({
      name: 'Test User',
      email: 'user@test.com',
      password: 'user123456',
      role: 'user',
      phone: '+923001234567',
    });

    // Create categories
    const categories = await Category.insertMany([
      {
        name: 'Smartphones',
        description: 'Latest WSCF smartphones with cutting-edge technology',
        icon: '📱',
        order: 1,
      },
      {
        name: 'Power Banks',
        description: 'High-capacity portable power banks for on-the-go charging',
        icon: '🔋',
        order: 2,
      },
      {
        name: 'Charging Cables',
        description: 'Durable USB-C, Lightning, and Micro-USB cables',
        icon: '🔌',
        order: 3,
      },
      {
        name: 'Chargers',
        description: 'Fast chargers and wireless charging solutions',
        icon: '⚡',
        order: 4,
      },
      {
        name: 'Phone Cases',
        description: 'Protective and stylish phone cases',
        icon: '🛡️',
        order: 5,
      },
      {
        name: 'Earbuds & Audio',
        description: 'Wireless earbuds and audio accessories',
        icon: '🎧',
        order: 6,
      },
    ]);

    // Create products
    const sampleProducts = [
      {
        name: 'WSCF Pro Max Smartphone 256GB',
        description: 'Experience the future of mobile technology with the WSCF Pro Max. Featuring a stunning 6.7-inch AMOLED display, 108MP camera system, and all-day battery life. Powered by the latest Snapdragon processor for lightning-fast performance.',
        shortDescription: 'Flagship smartphone with 108MP camera and 6.7" AMOLED display',
        price: 89999,
        comparePrice: 99999,
        category: categories[0]._id,
        images: [
          { url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800', alt: 'WSCF Pro Max Front' },
          { url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800', alt: 'WSCF Pro Max Back' },
        ],
        stock: 25,
        isFeatured: true,
        features: ['108MP Camera', '6.7" AMOLED Display', '5000mAh Battery', '256GB Storage', '5G Enabled'],
        specifications: [
          { key: 'Display', value: '6.7" AMOLED, 120Hz' },
          { key: 'Processor', value: 'Snapdragon 8 Gen 3' },
          { key: 'RAM', value: '12GB' },
          { key: 'Storage', value: '256GB' },
          { key: 'Battery', value: '5000mAh' },
        ],
        tags: ['smartphone', 'flagship', '5g', 'wscf'],
        ratings: { average: 4.8, count: 124 },
      },
      {
        name: 'WSCF Lite Smartphone 128GB',
        description: 'The perfect blend of performance and affordability. The WSCF Lite features a 6.4-inch display, 64MP dual camera, and smooth performance for everyday use.',
        shortDescription: 'Affordable smartphone with great camera and battery life',
        price: 34999,
        comparePrice: 39999,
        category: categories[0]._id,
        images: [
          { url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800', alt: 'WSCF Lite Front' },
          { url: 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=800', alt: 'WSCF Lite Back' },
        ],
        stock: 50,
        isFeatured: true,
        features: ['64MP Camera', '6.4" Display', '4500mAh Battery', '128GB Storage'],
        tags: ['smartphone', 'budget', 'wscf'],
        ratings: { average: 4.5, count: 89 },
      },
      {
        name: 'WSCF PowerVault 20000mAh',
        description: 'Never run out of power again. The WSCF PowerVault packs a massive 20000mAh capacity with 65W fast charging capability. Charge your phone up to 5 times. Features USB-C PD and dual USB-A ports.',
        shortDescription: '20000mAh power bank with 65W fast charging',
        price: 5499,
        comparePrice: 6999,
        category: categories[1]._id,
        images: [
          { url: 'https://images.unsplash.com/photo-1609592806596-43e3b5ebc3d7?w=800', alt: 'PowerVault 20000' },
        ],
        stock: 100,
        isFeatured: true,
        features: ['20000mAh Capacity', '65W Fast Charging', 'USB-C PD', 'Dual USB-A', 'LED Display'],
        specifications: [
          { key: 'Capacity', value: '20000mAh' },
          { key: 'Input', value: 'USB-C 65W' },
          { key: 'Output', value: 'USB-C PD 65W + USB-A 22.5W' },
          { key: 'Weight', value: '350g' },
        ],
        tags: ['power bank', 'fast charging', '20000mah'],
        ratings: { average: 4.7, count: 210 },
      },
      {
        name: 'WSCF PowerVault 10000mAh Slim',
        description: 'Ultra-slim power bank designed for portability. 10000mAh capacity with 22.5W fast charging. Slim enough to fit in your pocket.',
        shortDescription: 'Ultra-slim 10000mAh power bank for everyday carry',
        price: 2999,
        comparePrice: 3999,
        category: categories[1]._id,
        images: [
          { url: 'https://images.unsplash.com/photo-1585338107529-13afc25806f9?w=800', alt: 'PowerVault Slim' },
        ],
        stock: 150,
        isFeatured: false,
        features: ['10000mAh', 'Ultra Slim', '22.5W Fast Charge', 'Pocket-Friendly'],
        tags: ['power bank', 'slim', 'portable'],
        ratings: { average: 4.4, count: 156 },
      },
      {
        name: 'WSCF USB-C to USB-C 100W Cable (2m)',
        description: 'Premium braided USB-C cable with 100W power delivery support. Perfect for charging laptops, phones, and tablets. Supports 10Gbps data transfer. Durable nylon braiding with 15000+ bend lifespan.',
        shortDescription: '100W USB-C cable with premium braided build',
        price: 1299,
        comparePrice: 1799,
        category: categories[2]._id,
        images: [
          { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800', alt: 'USB-C Cable' },
        ],
        stock: 300,
        isFeatured: true,
        features: ['100W PD', '10Gbps Data', 'Nylon Braided', '2m Length', '15000+ Bends'],
        tags: ['cable', 'usb-c', 'fast charging'],
        ratings: { average: 4.6, count: 340 },
      },
      {
        name: 'WSCF Lightning Cable MFi Certified (1.5m)',
        description: 'Apple MFi certified Lightning cable for reliable charging and data sync. Premium aluminum connectors with braided nylon coating.',
        shortDescription: 'MFi certified Lightning cable for Apple devices',
        price: 999,
        comparePrice: 1499,
        category: categories[2]._id,
        images: [
          { url: 'https://images.unsplash.com/photo-1606292943133-a5e3e86f72f4?w=800', alt: 'Lightning Cable' },
        ],
        stock: 200,
        features: ['MFi Certified', 'Braided Nylon', '1.5m Length', '2.4A Fast Charge'],
        tags: ['cable', 'lightning', 'apple', 'iphone'],
        ratings: { average: 4.3, count: 87 },
      },
      {
        name: 'WSCF TurboCharge 65W GaN Charger',
        description: 'The smallest 65W charger on the market. GaN technology for cooler, more efficient charging. Dual USB-C ports for charging two devices simultaneously. Compatible with laptops, tablets, and phones.',
        shortDescription: 'Compact 65W GaN charger with dual USB-C ports',
        price: 3999,
        comparePrice: 4999,
        category: categories[3]._id,
        images: [
          { url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800', alt: 'GaN Charger' },
        ],
        stock: 75,
        isFeatured: true,
        features: ['65W Output', 'GaN Technology', 'Dual USB-C', 'Universal Compatibility', 'Compact Design'],
        specifications: [
          { key: 'Output', value: '65W (single) / 45W+20W (dual)' },
          { key: 'Input', value: '100-240V AC' },
          { key: 'Ports', value: '2x USB-C' },
          { key: 'Weight', value: '85g' },
        ],
        tags: ['charger', 'gan', 'fast charging', '65w'],
        ratings: { average: 4.9, count: 178 },
      },
      {
        name: 'WSCF Wireless Charging Pad 15W',
        description: 'Qi-certified wireless charging pad with 15W fast wireless charging. Sleek glass surface with anti-slip silicone ring. Compatible with all Qi-enabled devices.',
        shortDescription: '15W Qi wireless charger with elegant design',
        price: 2499,
        comparePrice: 2999,
        category: categories[3]._id,
        images: [
          { url: 'https://images.unsplash.com/photo-1622445275576-721325763afe?w=800', alt: 'Wireless Charger' },
        ],
        stock: 60,
        features: ['15W Fast Wireless', 'Qi Certified', 'LED Indicator', 'Anti-Slip', 'Universal'],
        tags: ['charger', 'wireless', 'qi'],
        ratings: { average: 4.5, count: 92 },
      },
      {
        name: 'WSCF Armor Case - Pro Max',
        description: 'Military-grade drop protection for your WSCF Pro Max. Raised edges protect camera and screen. Slim profile with excellent grip. Available in multiple colors.',
        shortDescription: 'Military-grade protective case with slim profile',
        price: 1499,
        comparePrice: 1999,
        category: categories[4]._id,
        images: [
          { url: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800', alt: 'Armor Case' },
        ],
        stock: 120,
        isFeatured: true,
        features: ['Military Drop Protection', 'Raised Bezels', 'Slim Profile', 'Wireless Charging Compatible'],
        tags: ['case', 'protective', 'armor'],
        ratings: { average: 4.6, count: 65 },
      },
      {
        name: 'WSCF Clear Crystal Case',
        description: 'Show off your phone\'s original design with this crystal-clear case. Anti-yellowing technology keeps it clear for months. Slim 1.2mm profile with shockproof corners.',
        shortDescription: 'Ultra-clear slim case with anti-yellowing tech',
        price: 799,
        comparePrice: 1199,
        category: categories[4]._id,
        images: [
          { url: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800', alt: 'Clear Case' },
        ],
        stock: 200,
        features: ['Anti-Yellowing', 'Crystal Clear', '1.2mm Slim', 'Shockproof Corners'],
        tags: ['case', 'clear', 'slim'],
        ratings: { average: 4.2, count: 134 },
      },
      {
        name: 'WSCF AirPods Pro X',
        description: 'Premium wireless earbuds with active noise cancellation and spatial audio. Up to 30 hours of battery life with the charging case. IPX5 water resistance for workouts.',
        shortDescription: 'ANC wireless earbuds with 30hr battery life',
        price: 7999,
        comparePrice: 9999,
        category: categories[5]._id,
        images: [
          { url: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800', alt: 'AirPods Pro X' },
        ],
        stock: 40,
        isFeatured: true,
        features: ['Active Noise Cancellation', 'Spatial Audio', '30hr Battery', 'IPX5', 'Touch Controls'],
        specifications: [
          { key: 'Driver', value: '11mm Dynamic' },
          { key: 'Battery (Buds)', value: '6 hours' },
          { key: 'Battery (Case)', value: '24 hours' },
          { key: 'Connectivity', value: 'Bluetooth 5.3' },
        ],
        tags: ['earbuds', 'wireless', 'anc', 'audio'],
        ratings: { average: 4.7, count: 203 },
      },
      {
        name: 'WSCF Bass Buds',
        description: 'Deep bass wireless earbuds designed for music lovers. 13mm drivers for powerful sound. Comfortable fit for extended use. 20 hours total battery life.',
        shortDescription: 'Bass-heavy wireless earbuds for music lovers',
        price: 3499,
        comparePrice: 4499,
        category: categories[5]._id,
        images: [
          { url: 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=800', alt: 'Bass Buds' },
        ],
        stock: 80,
        features: ['13mm Drivers', 'Deep Bass', '20hr Battery', 'Comfortable Fit', 'Touch Controls'],
        tags: ['earbuds', 'wireless', 'bass', 'budget'],
        ratings: { average: 4.3, count: 98 },
      },
    ];

    await Product.insertMany(sampleProducts);

    // Create sample coupons
    await Coupon.insertMany([
      {
        code: 'WELCOME10',
        description: '10% off on your first order',
        type: 'percentage',
        value: 10,
        maxDiscount: 2000,
        endDate: new Date('2027-12-31'),
      },
      {
        code: 'FLAT500',
        description: 'PKR 500 off on orders above PKR 3000',
        type: 'fixed',
        value: 500,
        minOrderAmount: 3000,
        endDate: new Date('2027-12-31'),
      },
    ]);

    return NextResponse.json(
      {
        message: 'Database seeded successfully!',
        data: {
          admin: { email: 'admin@wscfstore.com', password: 'admin123456' },
          testUser: { email: 'user@test.com', password: 'user123456' },
          categories: categories.length,
          products: sampleProducts.length,
          coupons: 2,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { error: 'Failed to seed database: ' + error.message },
      { status: 500 }
    );
  }
}

export async function POST() {
  return seedDatabase();
}

export async function GET() {
  return seedDatabase();
}
