import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import { getAuthUser, requireAdmin } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const order = await Order.findById(params.id).populate('user', 'name email');

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Only allow owner or admin to view
    if (order.user._id.toString() !== user._id.toString() && user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Get order error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await requireAdmin(request);
    await connectDB();

    const body = await request.json();
    const updates = {};

    if (body.status) {
      updates.status = body.status;
      if (body.status === 'delivered') {
        updates.isDelivered = true;
        updates.deliveredAt = new Date();
      }
    }

    if (body.isPaid !== undefined) {
      updates.isPaid = body.isPaid;
      if (body.isPaid) updates.paidAt = new Date();
    }

    const order = await Order.findByIdAndUpdate(
      params.id,
      { $set: updates },
      { new: true }
    ).populate('user', 'name email');

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    if (error.message === 'Unauthorized: Admin access required') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}
