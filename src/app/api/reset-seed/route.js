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
      name: 'Ankerhub Admin',
      email: 'admin@ankerhub.com',
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
        description: 'Latest Ankerhub smartphones with cutting-edge technology',
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

    // Create sample products - Anker, Soundcore, Eufy collection
    const sampleProducts = [
      // Anker Power Banks
      { name: 'Anker PowerCore 20000mAh', slug: 'anker-powercore-20000', description: 'High-capacity portable charger with dual USB-A ports.', price: 4999, comparePrice: 6499, category: categoryMap.powerBanks, images: [{ url: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=600', alt: 'Anker PowerCore 20000' }], stock: 50, sku: 'AH-PB-001', features: ['20000mAh', '18W fast charging', 'Dual USB-A ports'], specifications: [{ key: 'Brand', value: 'Anker' }, { key: 'Capacity', value: '20000mAh' }, { key: 'Output', value: '18W' }], tags: ['anker', 'power bank'], isFeatured: true, ratings: { average: 4.7, count: 89 } },
      { name: 'Anker PowerCore 10000mAh', slug: 'anker-powercore-10000', description: 'Compact power bank with 10000mAh capacity and 12W output.', price: 2499, comparePrice: 2999, category: categoryMap.powerBanks, images: [{ url: 'https://images.unsplash.com/photo-1609720268335-3ff297e4ced0?w=600', alt: 'Anker PowerCore 10000' }], stock: 60, sku: 'AH-PB-003', features: ['10000mAh', '12W output', 'Compact design'], specifications: [{ key: 'Brand', value: 'Anker' }, { key: 'Capacity', value: '10000mAh' }, { key: 'Output', value: '12W' }], tags: ['anker', 'power bank'], isFeatured: true, ratings: { average: 4.6, count: 145 } },
      { name: 'Anker PowerCore Slim 5000', slug: 'anker-powercore-slim-5000', description: 'Ultra-slim 5000mAh power bank, perfect for travel.', price: 1499, comparePrice: 1999, category: categoryMap.powerBanks, images: [{ url: 'https://images.unsplash.com/photo-1609720268324-f77eef1e0bfd?w=600', alt: 'Anker Slim Power Bank' }], stock: 100, sku: 'AH-PB-004', features: ['5000mAh', 'Ultra slim', 'Lightweight'], specifications: [{ key: 'Brand', value: 'Anker' }, { key: 'Capacity', value: '5000mAh' }, { key: 'Weight', value: '120g' }], tags: ['anker', 'slim'], isFeatured: false, ratings: { average: 4.5, count: 92 } },
      { name: 'Anker PowerCore Solar 21W', slug: 'anker-powercore-solar', description: 'Solar-powered portable charger with 21W output.', price: 5999, comparePrice: 7499, category: categoryMap.powerBanks, images: [{ url: 'https://images.unsplash.com/photo-1617638924702-92d37c439220?w=600', alt: 'Anker Solar Charger' }], stock: 25, sku: 'AH-PB-005', features: ['Solar charging', '21W output', 'Durable design'], specifications: [{ key: 'Brand', value: 'Anker' }, { key: 'Type', value: 'Solar' }, { key: 'Output', value: '21W' }], tags: ['anker', 'solar', 'eco'], isFeatured: true, ratings: { average: 4.8, count: 67 } },
      { name: 'Anker PowerCore Essential 20000', slug: 'anker-powercore-essential', description: 'Essential power bank with 20000mAh and fast charging.', price: 3999, comparePrice: 4999, category: categoryMap.powerBanks, images: [{ url: 'https://images.unsplash.com/photo-1609720268335-3ff297e4ced0?w=600', alt: 'Anker PowerCore Essential' }], stock: 40, sku: 'AH-PB-006', features: ['20000mAh', 'Fast charging', 'LED display'], specifications: [{ key: 'Brand', value: 'Anker' }, { key: 'Capacity', value: '20000mAh' }, { key: 'Output', value: '15W' }], tags: ['anker', 'essential'], isFeatured: false, ratings: { average: 4.6, count: 112 } },
      
      // Soundcore Earbuds & Audio
      { name: 'Soundcore by Anker Space A40', slug: 'soundcore-space-a40', description: 'Premium noise-cancelling earbuds with spatial audio.', price: 12999, comparePrice: 15999, category: categoryMap.audio, images: [{ url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600', alt: 'Soundcore Earbuds' }], stock: 30, sku: 'AH-AU-003', features: ['Active noise cancelling', 'Spatial audio', '10hr battery'], specifications: [{ key: 'Brand', value: 'Soundcore' }, { key: 'Type', value: 'Earbuds' }, { key: 'ANC', value: 'Yes' }], tags: ['soundcore', 'earbuds', 'anc'], isFeatured: true, ratings: { average: 4.8, count: 234 } },
      { name: 'Soundcore Space Q45', slug: 'soundcore-space-q45', description: 'Over-ear wireless headphones with premium ANC.', price: 16999, comparePrice: 19999, category: categoryMap.audio, images: [{ url: 'https://images.unsplash.com/photo-1487215388519-e21cc028cb29?w=600', alt: 'Soundcore Headphones' }], stock: 20, sku: 'AH-AU-004', features: ['Top-tier ANC', 'Hi-Res audio', '50hr battery'], specifications: [{ key: 'Brand', value: 'Soundcore' }, { key: 'Type', value: 'Over-ear' }, { key: 'Battery', value: '50hrs' }], tags: ['soundcore', 'headphones', 'premium'], isFeatured: true, ratings: { average: 4.9, count: 187 } },
      { name: 'Soundcore Liberty 4', slug: 'soundcore-liberty-4', description: 'Balanced sound earbuds with 28-hour battery life.', price: 8999, comparePrice: 10999, category: categoryMap.audio, images: [{ url: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=600', alt: 'Soundcore Earbuds' }], stock: 45, sku: 'AH-AU-005', features: ['28hr battery', 'Balanced sound', 'IPX4 waterproof'], specifications: [{ key: 'Brand', value: 'Soundcore' }, { key: 'Type', value: 'Earbuds' }, { key: 'Waterproof', value: 'IPX4' }], tags: ['soundcore', 'earbuds'], isFeatured: false, ratings: { average: 4.7, count: 156 } },
      { name: 'Soundcore Select 3', slug: 'soundcore-select-3', description: 'Budget-friendly earbuds with powerful bass.', price: 4999, comparePrice: 6499, category: categoryMap.audio, images: [{ url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600', alt: 'Soundcore Earbuds' }], stock: 60, sku: 'AH-AU-006', features: ['Powerful bass', 'Long battery', 'Comfortable fit'], specifications: [{ key: 'Brand', value: 'Soundcore' }, { key: 'Type', value: 'Earbuds' }, { key: 'Battery', value: '8hrs' }], tags: ['soundcore', 'budget'], isFeatured: false, ratings: { average: 4.5, count: 203 } },
      { name: 'Soundcore ANC 738', slug: 'soundcore-anc-738', description: 'Affordable wireless headphones with active noise cancelling.', price: 7999, comparePrice: 9999, category: categoryMap.audio, images: [{ url: 'https://images.unsplash.com/photo-1492447271666-5b0eca63d37d?w=600', alt: 'Soundcore Headphones' }], stock: 35, sku: 'AH-AU-007', features: ['Active ANC', '40hr battery', 'Foldable'], specifications: [{ key: 'Brand', value: 'Soundcore' }, { key: 'Type', value: 'On-ear' }, { key: 'Battery', value: '40hrs' }], tags: ['soundcore', 'anc', 'affordable'], isFeatured: true, ratings: { average: 4.6, count: 178 } },
      
      // Eufy Products
      { name: 'Eufy Security eufyCam 3', slug: 'eufy-security-cam-3', description: 'Outdoor wireless security camera with AI detection.', price: 14999, comparePrice: 17999, category: categoryMap.cables, images: [{ url: 'https://images.unsplash.com/photo-1597933613876-87f83e80d9ba?w=600', alt: 'Eufy Camera' }], stock: 20, sku: 'AH-EF-001', features: ['AI detection', '4K video', 'No subscription'], specifications: [{ key: 'Brand', value: 'Eufy' }, { key: 'Resolution', value: '4K' }, { key: 'Type', value: 'Outdoor' }], tags: ['eufy', 'security', 'camera'], isFeatured: true, ratings: { average: 4.8, count: 127 } },
      { name: 'Eufy Video Doorbell 2K', slug: 'eufy-doorbell-2k', description: 'Smart video doorbell with crystal-clear 2K video.', price: 9999, comparePrice: 12999, category: categoryMap.cables, images: [{ url: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600', alt: 'Eufy Doorbell' }], stock: 25, sku: 'AH-EF-002', features: ['2K video', 'Night vision', 'Smart alerts'], specifications: [{ key: 'Brand', value: 'Eufy' }, { key: 'Resolution', value: '2K' }, { key: 'Type', value: 'Doorbell' }], tags: ['eufy', 'doorbell', 'smart'], isFeatured: false, ratings: { average: 4.7, count: 94 } },
      { name: 'Eufy RoboVac G30', slug: 'eufy-robovac-g30', description: 'Smart robotic vacuum with strong suction power.', price: 24999, comparePrice: 29999, category: categoryMap.cables, images: [{ url: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600', alt: 'Eufy Vacuum' }], stock: 15, sku: 'AH-EF-003', features: ['Smart navigation', 'Strong suction', 'App control'], specifications: [{ key: 'Brand', value: 'Eufy' }, { key: 'Type', value: 'Robot Vacuum' }, { key: 'Power', value: '2000Pa' }], tags: ['eufy', 'vacuum', 'smart home'], isFeatured: true, ratings: { average: 4.9, count: 156 } },
      { name: 'Eufy Lumos Smart Bulb', slug: 'eufy-lumos-bulb', description: 'Smart LED bulb with color changing capability.', price: 3999, comparePrice: 4999, category: categoryMap.cables, images: [{ url: 'https://images.unsplash.com/photo-1569695729953-44e3ac36ca2b?w=600', alt: 'Eufy Bulb' }], stock: 80, sku: 'AH-EF-004', features: ['16M colors', 'App control', 'Voice compatible'], specifications: [{ key: 'Brand', value: 'Eufy' }, { key: 'Type', value: 'Smart Bulb' }, { key: 'Colors', value: '16M' }], tags: ['eufy', 'smart bulb'], isFeatured: false, ratings: { average: 4.6, count: 172 } },
      { name: 'Eufy SoloCam S340', slug: 'eufy-solocam-s340', description: 'Solar-powered wireless outdoor camera.', price: 19999, comparePrice: 24999, category: categoryMap.cables, images: [{ url: 'https://images.unsplash.com/photo-1597933613876-87f83e80d9ba?w=600', alt: 'Eufy Solar Camera' }], stock: 18, sku: 'AH-EF-005', features: ['Solar powered', '4K video', 'AI detection'], specifications: [{ key: 'Brand', value: 'Eufy' }, { key: 'Power', value: 'Solar' }, { key: 'Resolution', value: '4K' }], tags: ['eufy', 'solar', 'camera'], isFeatured: true, ratings: { average: 4.8, count: 203 } },
      
      // Anker Chargers & Cables
      { name: 'Anker 67W GaN Charger', slug: 'anker-67w-gan', description: '67W compact GaN charger for all devices.', price: 4999, comparePrice: 5999, category: categoryMap.cables, images: [{ url: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=600', alt: 'Anker Charger' }], stock: 50, sku: 'AH-CC-003', features: ['67W output', 'GaN tech', 'Compact'], specifications: [{ key: 'Brand', value: 'Anker' }, { key: 'Output', value: '67W' }, { key: 'Type', value: 'GaN' }], tags: ['anker', 'charger', 'gan'], isFeatured: true, ratings: { average: 4.8, count: 278 } },
      { name: 'Anker 33W Dual Port Charger', slug: 'anker-33w-dual', description: 'Dual port charger with 33W total output.', price: 2999, comparePrice: 3999, category: categoryMap.cables, images: [{ url: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600', alt: 'Anker Charger' }], stock: 70, sku: 'AH-CC-004', features: ['Dual USB-C', '33W output', 'Foldable'], specifications: [{ key: 'Brand', value: 'Anker' }, { key: 'Output', value: '33W' }, { key: 'Ports', value: 'Dual' }], tags: ['anker', 'charger'], isFeatured: false, ratings: { average: 4.7, count: 189 } },
      { name: 'Anker USB-C Cable 3m', slug: 'anker-usb-c-cable-3m', description: 'High-speed USB-C cable with 100W power delivery.', price: 1999, comparePrice: 2499, category: categoryMap.cables, images: [{ url: 'https://images.unsplash.com/photo-1618128750388-49c2c5f5dd0e?w=600', alt: 'Anker Cable' }], stock: 120, sku: 'AH-CC-005', features: ['100W PD', '3 meter', 'Durable'], specifications: [{ key: 'Brand', value: 'Anker' }, { key: 'Length', value: '3m' }, { key: 'Power', value: '100W' }], tags: ['anker', 'cable'], isFeatured: false, ratings: { average: 4.6, count: 245 } },
      { name: 'Anker Lightning Cable 2m (2-Pack)', slug: 'anker-lightning-2pack', description: 'MFi certified lightning cables, pack of 2.', price: 2499, comparePrice: 3499, category: categoryMap.cables, images: [{ url: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=600', alt: 'Anker Lightning Cable' }], stock: 90, sku: 'AH-CC-006', features: ['MFi certified', '2m length', '2 pack'], specifications: [{ key: 'Brand', value: 'Anker' }, { key: 'Length', value: '2m' }, { key: 'Pack', value: '2' }], tags: ['anker', 'lightning', 'cable'], isFeatured: true, ratings: { average: 4.7, count: 312 } },
      { name: 'Anker 30W Nano Charger', slug: 'anker-30w-nano', description: 'Smallest 30W charger, perfect for travel.', price: 2199, comparePrice: 2999, category: categoryMap.cables, images: [{ url: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600', alt: 'Anker Nano Charger' }], stock: 60, sku: 'AH-CC-007', features: ['30W output', 'Compact', 'Travel ready'], specifications: [{ key: 'Brand', value: 'Anker' }, { key: 'Output', value: '30W' }, { key: 'Size', value: 'Nano' }], tags: ['anker', 'charger', 'travel'], isFeatured: false, ratings: { average: 4.5, count: 156 } },
      
      // Phone Cases
      { name: 'Anker Case iPhone 15', slug: 'anker-case-iphone15', description: 'Protective case with drop protection.', price: 2199, comparePrice: 2999, category: categoryMap.cases, images: [{ url: 'https://images.unsplash.com/photo-1551028719-ac991b46e42f?w=600', alt: 'Anker Case' }], stock: 50, sku: 'AH-PC-003', features: ['Drop protection', 'Slim design', 'Grip'], specifications: [{ key: 'Brand', value: 'Anker' }, { key: 'Material', value: 'TPU' }, { key: 'Compatibility', value: 'iPhone 15' }], tags: ['anker', 'case'], isFeatured: false, ratings: { average: 4.6, count: 98 } },
      { name: 'Eufy Clear Case Galaxy S24', slug: 'eufy-clear-case-s24', description: 'Crystal clear protective case for Galaxy S24.', price: 1799, comparePrice: 2399, category: categoryMap.cases, images: [{ url: 'https://images.unsplash.com/photo-1565452868876-ae9c89005266?w=600', alt: 'Eufy Case' }], stock: 70, sku: 'AH-PC-004', features: ['Crystal clear', 'Drop protection', 'Slim'], specifications: [{ key: 'Brand', value: 'Eufy' }, { key: 'Material', value: 'Clear TPU' }, { key: 'Compatibility', value: 'Galaxy S24' }], tags: ['eufy', 'case'], isFeatured: true, ratings: { average: 4.5, count: 127 } },
      
      // Screen Protectors
      { name: 'Anker Tempered Glass iPhone 15 (2-Pack)', slug: 'anker-glass-iphone15', description: '9H tempered glass screen protectors, 2-pack.', price: 1499, comparePrice: 1999, category: categoryMap.protectors, images: [{ url: 'https://images.unsplash.com/photo-1505612592247-334d3d14e63c?w=600', alt: 'Anker Screen Protector' }], stock: 100, sku: 'AH-SP-003', features: ['9H hardness', '2 pack', 'Easy install'], specifications: [{ key: 'Brand', value: 'Anker' }, { key: 'Hardness', value: '9H' }, { key: 'Pack', value: '2' }], tags: ['anker', 'glass'], isFeatured: true, ratings: { average: 4.7, count: 187 } },
      { name: 'Eufy Privacy Protector S24', slug: 'eufy-privacy-s24', description: 'Privacy screen protector with 9H hardness.', price: 1399, comparePrice: 1899, category: categoryMap.protectors, images: [{ url: 'https://images.unsplash.com/photo-1607198039124-430d67fd6a63?w=600', alt: 'Eufy Protector' }], stock: 80, sku: 'AH-SP-004', features: ['Privacy filter', '9H hardness', 'Anti-glare'], specifications: [{ key: 'Brand', value: 'Eufy' }, { key: 'Type', value: 'Privacy' }, { key: 'Hardness', value: '9H' }], tags: ['eufy', 'privacy'], isFeatured: false, ratings: { average: 4.6, count: 143 } },
      
      // Smartphones (for variety)
      { name: 'Samsung Galaxy S24 Ultra', slug: 'samsung-s24-ultra', description: '6.8" AMOLED, Snapdragon 8 Gen 3, 200MP camera.', price: 289999, comparePrice: 319999, category: categoryMap.smartphones, images: [{ url: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600', alt: 'Samsung S24' }], stock: 15, sku: 'AH-SM-001', features: ['6.8" AMOLED', '200MP camera', 'S Pen'], specifications: [{ key: 'Brand', value: 'Samsung' }, { key: 'Display', value: '6.8"' }, { key: 'RAM', value: '12GB' }], tags: ['samsung', 'flagship'], isFeatured: true, ratings: { average: 4.8, count: 124 } },
      { name: 'iPhone 15 Pro Max', slug: 'iphone-15-pro-max', description: '6.7" Super Retina, A17 Pro, 48MP camera.', price: 449999, comparePrice: 479999, category: categoryMap.smartphones, images: [{ url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600', alt: 'iPhone 15 Pro' }], stock: 10, sku: 'AH-SM-002', features: ['6.7" Super Retina', 'A17 Pro', '48MP'], specifications: [{ key: 'Brand', value: 'Apple' }, { key: 'Display', value: '6.7"' }, { key: 'Chip', value: 'A17' }], tags: ['apple', 'flagship'], isFeatured: true, ratings: { average: 4.9, count: 210 } },
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
          admin: { email: 'admin@ankerhub.com', password: 'admin123456' },
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
