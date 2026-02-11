import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { requireAuth, requireAdmin, getAuthUser } from '@/lib/auth';

export async function GET(request) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const status = searchParams.get('status');

    let query = {};

    if (user.role === 'admin') {
      // Admin can see all orders
      if (status) query.status = status;
    } else {
      // Users can only see their own orders
      query.user = user._id;
    }

    const skip = (page - 1) * limit;
    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const user = await requireAuth(request);
    await connectDB();

    const body = await request.json();
    const { items, shippingAddress, paymentMethod, couponCode, paymentResult } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No order items' }, { status: 400 });
    }

    // Verify stock and calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item._id || item.product);
      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.name}` },
          { status: 400 }
        );
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}` },
          { status: 400 }
        );
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images?.[0]?.url || '',
        price: product.price,
        quantity: item.quantity,
      });

      subtotal += product.price * item.quantity;

      // Decrease stock
      product.stock -= item.quantity;
      product.sold += item.quantity;
      await product.save();
    }

    const shippingCost = subtotal >= 5000 ? 0 : 200;
    const discount = body.discount || 0;
    const total = subtotal - discount + shippingCost;

    const order = await Order.create({
      user: user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'stripe',
      paymentResult,
      subtotal,
      shippingCost,
      discount,
      couponCode,
      total,
      isPaid: paymentMethod === 'stripe' && paymentResult?.status === 'succeeded',
      paidAt: paymentMethod === 'stripe' && paymentResult?.status === 'succeeded' ? new Date() : undefined,
    });

    await order.populate('user', 'name email');

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
