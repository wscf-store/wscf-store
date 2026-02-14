import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Category from '@/models/Category';
import Product from '@/models/Product';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find({ isActive: true }).sort({ order: 1 }).lean();

    // Get product counts for each category
    const categoriesWithCounts = await Promise.all(
      categories.map(async (cat) => {
        const count = await Product.countDocuments({
          category: cat._id,
          isActive: true,
        });
        return { ...cat, productCount: count };
      })
    );

    const response = NextResponse.json({ categories: categoriesWithCounts });
    
    // Disable caching for categories API
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error) {
    console.error('Get categories error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await requireAdmin(request);
    await connectDB();

    const body = await request.json();
    const category = await Category.create(body);

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    if (error.message === 'Unauthorized: Admin access required') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Create category error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create category' },
      { status: 500 }
    );
  }
}
