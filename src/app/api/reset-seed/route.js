import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Category from '@/models/Category';
import Product from '@/models/Product';
import Coupon from '@/models/Coupon';

async function resetAndSeed() {
  try {
    await connectDB();

    // Clear all existing data
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Product.deleteMany({}),
      Coupon.deleteMany({}),
    ]);

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
        slug: 'smartphones',
        description: 'Latest WSCF smartphones with cutting-edge technology',
        icon: '📱',
        order: 1,
        isActive: true,
      },
      {
        name: 'Power Banks',
        slug: 'power-banks',
        description: 'High-capacity portable power banks for on-the-go charging',
        icon: '🔋',
        order: 2,
        isActive: true,
      },
      {
        name: 'Cables & Chargers',
        slug: 'cables-chargers',
        description: 'Fast charging cables and universal chargers',
        icon: '🔌',
        order: 3,
        isActive: true,
      },
      {
        name: 'Phone Cases',
        slug: 'phone-cases',
        description: 'Protective cases and covers for all devices',
        icon: '🛡️',
        order: 4,
        isActive: true,
      },
      {
        name: 'Audio',
        slug: 'audio',
        description: 'Earbuds, headphones, and speakers',
        icon: '🎧',
        order: 5,
        isActive: true,
      },
      {
        name: 'Screen Protectors',
        slug: 'screen-protectors',
        description: 'Tempered glass and screen protection',
        icon: '📋',
        order: 6,
        isActive: true,
      },
    ]);

    const categoryMap = {
      smartphones: categories[0]._id,
      powerBanks: categories[1]._id,
      cables: categories[2]._id,
      cases: categories[3]._id,
      audio: categories[4]._id,
      protectors: categories[5]._id,
    };

    // Create sample products
    const sampleProducts = [
      {
        name: 'Anker PowerCore 20000mAh',
        slug: 'anker-powercore-20000',
        description: 'High-capacity portable charger with dual USB-A ports and 18W fast charging support.',
        price: 4999,
        comparePrice: 6499,
        category: categoryMap.powerBanks,
        images: ['https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600'],
        stock: 50,
        sku: 'WSCF-PB-001',
        features: ['20000mAh capacity', '18W fast charging', 'Dual USB-A ports', 'LED indicator', 'Travel-friendly'],
        specifications: { Brand: 'Anker', Capacity: '20000mAh', Output: '18W', Weight: '356g' },
        tags: ['power bank', 'anker', 'portable charger'],
        isFeatured: true,
        ratings: { average: 4.7, count: 89 },
      },
      {
        name: 'Baseus 10000mAh Slim Power Bank',
        slug: 'baseus-10000-slim',
        description: 'Ultra-slim power bank with built-in cable and 20W PD fast charging.',
        price: 3299,
        comparePrice: 3999,
        category: categoryMap.powerBanks,
        images: ['https://images.unsplash.com/photo-1585338447937-7082f8fc763d?w=600'],
        stock: 30,
        sku: 'WSCF-PB-002',
        features: ['10000mAh capacity', '20W PD fast charge', 'Built-in USB-C cable', 'Ultra slim design'],
        specifications: { Brand: 'Baseus', Capacity: '10000mAh', Output: '20W PD', Thickness: '12mm' },
        tags: ['power bank', 'baseus', 'slim'],
        isFeatured: true,
        ratings: { average: 4.5, count: 56 },
      },
      {
        name: 'Samsung Galaxy S24 Ultra',
        slug: 'samsung-galaxy-s24-ultra',
        description: 'The ultimate smartphone experience with 6.8" Dynamic AMOLED display, 200MP camera, and Snapdragon 8 Gen 3.',
        price: 289999,
        comparePrice: 319999,
        category: categoryMap.smartphones,
        images: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600'],
        stock: 15,
        sku: 'WSCF-SM-001',
        features: ['6.8" Dynamic AMOLED 2X display', '200MP Main Camera with AI', 'Snapdragon 8 Gen 3', '5000mAh battery with 45W charging', 'Built-in S Pen'],
        specifications: { Brand: 'Samsung', Display: '6.8 inch', RAM: '12GB', Storage: '256GB', Battery: '5000mAh' },
        tags: ['samsung', 'flagship', 'smartphone'],
        isFeatured: true,
        ratings: { average: 4.8, count: 124 },
      },
      {
        name: 'iPhone 15 Pro Max',
        slug: 'iphone-15-pro-max',
        description: 'Apple\'s most powerful iPhone with A17 Pro chip, titanium design, and 48MP camera system.',
        price: 449999,
        comparePrice: 479999,
        category: categoryMap.smartphones,
        images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600'],
        stock: 10,
        sku: 'WSCF-SM-002',
        features: ['6.7" Super Retina XDR OLED', 'A17 Pro chip', '48MP camera system', 'Titanium design', 'Action button'],
        specifications: { Brand: 'Apple', Display: '6.7 inch', Chip: 'A17 Pro', Storage: '256GB', Battery: '4422mAh' },
        tags: ['iphone', 'apple', 'flagship'],
        isFeatured: true,
        ratings: { average: 4.9, count: 210 },
      },
      {
        name: 'USB-C to Lightning Braided Cable 2m',
        slug: 'usb-c-lightning-cable-2m',
        description: 'MFi certified braided nylon cable for fast charging iPhones. Durable & tangle-free.',
        price: 1299,
        comparePrice: 1799,
        category: categoryMap.cables,
        images: ['https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600'],
        stock: 100,
        sku: 'WSCF-CC-001',
        features: ['MFi Certified', '2-meter length', 'Braided nylon', '20W fast charging', '480Mbps data transfer'],
        specifications: { Length: '2m', Connector: 'USB-C to Lightning', Material: 'Braided Nylon' },
        tags: ['cable', 'lightning', 'usb-c', 'iphone'],
        isFeatured: true,
        ratings: { average: 4.6, count: 201 },
      },
      {
        name: '65W GaN USB-C Charger',
        slug: '65w-gan-usb-c-charger',
        description: 'Compact GaN charger with 65W output. Charges laptops, tablets, and phones.',
        price: 3999,
        comparePrice: 4999,
        category: categoryMap.cables,
        images: ['https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600'],
        stock: 40,
        sku: 'WSCF-CC-002',
        features: ['65W output', 'GaN technology', 'USB-C + USB-A', 'Foldable plug', 'Universal compatibility'],
        specifications: { Output: '65W', Ports: 'USB-C + USB-A', Technology: 'GaN', Weight: '120g' },
        tags: ['charger', 'gan', '65w', 'fast charging'],
        isFeatured: false,
        ratings: { average: 4.8, count: 73 },
      },
      {
        name: 'Spigen Ultra Hybrid iPhone 15 Case',
        slug: 'spigen-ultra-hybrid-iphone-15',
        description: 'Crystal-clear military-grade protection with air-cushion corners.',
        price: 2499,
        comparePrice: 2999,
        category: categoryMap.cases,
        images: ['https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600'],
        stock: 60,
        sku: 'WSCF-PC-001',
        features: ['Military-grade protection', 'Crystal clear back', 'Air-cushion technology', 'Wireless charging compatible'],
        specifications: { Brand: 'Spigen', Material: 'TPU + PC', Compatibility: 'iPhone 15' },
        tags: ['case', 'spigen', 'iphone 15', 'clear'],
        isFeatured: true,
        ratings: { average: 4.7, count: 145 },
      },
      {
        name: 'Samsung Galaxy S24 Silicone Case',
        slug: 'samsung-galaxy-s24-silicone-case',
        description: 'Official Samsung silicone case with soft-touch finish and precise cutouts.',
        price: 1999,
        category: categoryMap.cases,
        images: ['https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600'],
        stock: 45,
        sku: 'WSCF-PC-002',
        features: ['Official Samsung accessory', 'Soft-touch silicone', 'Precise cutouts', 'Slim profile'],
        specifications: { Brand: 'Samsung', Material: 'Silicone', Compatibility: 'Galaxy S24' },
        tags: ['case', 'samsung', 'silicone'],
        isFeatured: false,
        ratings: { average: 4.4, count: 38 },
      },
      {
        name: 'Sony WF-1000XM5 Earbuds',
        slug: 'sony-wf-1000xm5-earbuds',
        description: 'Industry-leading noise cancelling wireless earbuds with Hi-Res Audio and 24-hour battery.',
        price: 54999,
        comparePrice: 64999,
        category: categoryMap.audio,
        images: ['https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=600'],
        stock: 20,
        sku: 'WSCF-AU-001',
        features: ['Industry-leading ANC', 'Hi-Res Audio', '24hr battery with case', 'IPX4 water resistant', 'Multipoint connection'],
        specifications: { Brand: 'Sony', Driver: '8.4mm', ANC: 'Yes', Battery: '8hrs (24 with case)' },
        tags: ['earbuds', 'sony', 'anc', 'wireless'],
        isFeatured: true,
        ratings: { average: 4.9, count: 87 },
      },
      {
        name: 'JBL Tune 520BT Headphones',
        slug: 'jbl-tune-520bt-headphones',
        description: 'On-ear wireless headphones with JBL Pure Bass sound and 57-hour battery life.',
        price: 8499,
        comparePrice: 9999,
        category: categoryMap.audio,
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'],
        stock: 35,
        sku: 'WSCF-AU-002',
        features: ['JBL Pure Bass', '57-hour battery', 'Multipoint connection', 'Foldable design', 'Voice assistant support'],
        specifications: { Brand: 'JBL', Type: 'On-ear', Battery: '57 hours', Bluetooth: '5.3' },
        tags: ['headphones', 'jbl', 'wireless', 'bass'],
        isFeatured: false,
        ratings: { average: 4.5, count: 112 },
      },
      {
        name: 'Tempered Glass iPhone 15 Pro (3-Pack)',
        slug: 'tempered-glass-iphone-15-3pack',
        description: '9H hardness tempered glass with easy-install frame. Bubble-free application.',
        price: 999,
        comparePrice: 1499,
        category: categoryMap.protectors,
        images: ['https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=600'],
        stock: 200,
        sku: 'WSCF-SP-001',
        features: ['9H hardness', '3-pack value', 'Easy-install frame', 'Bubble-free', 'Case friendly'],
        specifications: { Material: 'Tempered Glass', Hardness: '9H', Pack: '3 pieces', Compatibility: 'iPhone 15 Pro' },
        tags: ['screen protector', 'tempered glass', 'iphone 15'],
        isFeatured: false,
        ratings: { average: 4.3, count: 67 },
      },
      {
        name: 'Privacy Screen Protector Samsung S24',
        slug: 'privacy-screen-samsung-s24',
        description: 'Anti-spy privacy filter with 9H tempered glass. Visible only from the front.',
        price: 1499,
        comparePrice: 1999,
        category: categoryMap.protectors,
        images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600'],
        stock: 80,
        sku: 'WSCF-SP-002',
        features: ['Privacy filter', '9H tempered glass', 'Anti-fingerprint', 'Precise cutouts'],
        specifications: { Type: 'Privacy', Hardness: '9H', Compatibility: 'Samsung Galaxy S24' },
        tags: ['screen protector', 'privacy', 'samsung'],
        isFeatured: false,
        ratings: { average: 4.2, count: 34 },
      },
    ];

    await Product.insertMany(sampleProducts);

    // Create coupons
    await Coupon.insertMany([
      {
        code: 'WELCOME10',
        type: 'percentage',
        value: 10,
        minOrderAmount: 2000,
        maxDiscount: 5000,
        usageLimit: 100,
        isActive: true,
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      },
      {
        code: 'FLAT500',
        type: 'fixed',
        value: 500,
        minOrderAmount: 3000,
        isActive: true,
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      },
    ]);

    return NextResponse.json(
      {
        message: '✅ Database reset and seeded successfully!',
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
    console.error('Reset seed error:', error);
    return NextResponse.json(
      { error: 'Failed to reset and seed database: ' + error.message },
      { status: 500 }
    );
  }
}

export async function POST() {
  return resetAndSeed();
}

export async function GET() {
  return resetAndSeed();
}
