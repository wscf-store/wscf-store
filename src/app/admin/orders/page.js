'use client';

import { useEffect, useState, useCallback } from 'react';
import { IoSearch, IoEye, IoChevronDown } from 'react-icons/io5';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Spinner from '@/components/ui/Spinner';
import { formatPrice } from '@/utils/formatPrice';
import { AdminGuard } from '@/components/admin/AdminGuard';

const ORDER_STATUSES = [
  { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'confirmed', label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
  { value: 'processing', label: 'Processing', color: 'bg-indigo-100 text-indigo-800' },
  { value: 'shipped', label: 'Shipped', color: 'bg-purple-100 text-purple-800' },
  { value: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-800' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
];

function AdminOrdersContent() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      let url = `/api/orders?page=${page}&limit=15`;
      if (statusFilter) url += `&status=${statusFilter}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, token]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateOrderStatus = async (orderId, newStatus) => {
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        toast.success(`Order status updated to ${newStatus}`);
        fetchOrders();
        if (selectedOrder?._id === orderId) {
          setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
        }
      } else {
        toast.error('Failed to update status');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const statusColors = {
    pending: 'yellow',
    processing: 'blue',
    shipped: 'purple',
    delivered: 'green',
    cancelled: 'red',
  };

  const filteredOrders = search
    ? orders.filter(
        (o) =>
          o.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
          o.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
          o.user?.email?.toLowerCase().includes(search.toLowerCase())
      )
    : orders;

  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-primary-900">Orders</h1>
        <p className="text-gray-500 mt-1">Manage and track customer orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by order number, customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
          />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="appearance-none pl-4 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all bg-white cursor-pointer"
          >
            <option value="">All Statuses</option>
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
          <IoChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-semibold text-gray-500 uppercase border-b border-gray-100">
                <th className="px-6 py-3">Order</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Items</th>
                <th className="px-6 py-3">Total</th>
                <th className="px-6 py-3">Payment</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm font-semibold text-primary-900">
                        {order.orderNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-primary-900">
                          {order.user?.name || 'Deleted User'}
                        </p>
                        <p className="text-xs text-gray-400">{order.user?.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {order.items?.length || 0} items
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-primary-900">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge color={order.payment?.status === 'paid' ? 'green' : 'yellow'}>
                        {order.payment?.status || 'pending'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        disabled={updatingStatus}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-full border-0 cursor-pointer focus:ring-2 focus:ring-accent/20 ${
                          order.status === 'delivered'
                            ? 'bg-green-100 text-green-700'
                            : order.status === 'cancelled'
                            ? 'bg-red-100 text-red-700'
                            : order.status === 'shipped'
                            ? 'bg-purple-100 text-purple-700'
                            : order.status === 'processing'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {ORDER_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 text-gray-400 hover:text-accent hover:bg-accent/10 rounded-lg transition-all"
                      >
                        <IoEye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-400">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Order ${selectedOrder?.orderNumber || ''}`}
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
            {/* Status & Date */}
            <div className="flex items-center justify-between">
              <Badge color={statusColors[selectedOrder.status]} size="lg">
                {selectedOrder.status}
              </Badge>
              <span className="text-sm text-gray-500">
                {new Date(selectedOrder.createdAt).toLocaleString()}
              </span>
            </div>

            {/* Customer Info */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-sm text-primary-900 mb-2">Customer</h3>
              <p className="text-sm text-gray-600">{selectedOrder.user?.name || 'Deleted User'}</p>
              <p className="text-sm text-gray-500">{selectedOrder.user?.email}</p>
            </div>

            {/* Shipping Address */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-sm text-primary-900 mb-2">Shipping Address</h3>
              <div className="text-sm text-gray-600 space-y-0.5">
                <p>{selectedOrder.shippingAddress?.fullName}</p>
                <p>{selectedOrder.shippingAddress?.address}</p>
                <p>
                  {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state}{' '}
                  {selectedOrder.shippingAddress?.zipCode}
                </p>
                <p>{selectedOrder.shippingAddress?.phone}</p>
              </div>
            </div>

            {/* Items */}
            <div>
              <h3 className="font-semibold text-sm text-primary-900 mb-3">Items</h3>
              <div className="space-y-3">
                {selectedOrder.items?.map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-primary-900">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span>{formatPrice(selectedOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping</span>
                <span>{selectedOrder.shippingCost === 0 ? 'Free' : formatPrice(selectedOrder.shippingCost)}</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Discount</span>
                  <span className="text-green-600">-{formatPrice(selectedOrder.discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-primary-900 pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>{formatPrice(selectedOrder.total)}</span>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-sm text-primary-900 mb-2">Payment</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-gray-500">Method:</span>
                <span className="capitalize">{selectedOrder.payment?.method || 'stripe'}</span>
                <span className="text-gray-500">Status:</span>
                <Badge color={selectedOrder.payment?.status === 'paid' ? 'green' : 'yellow'}>
                  {selectedOrder.payment?.status || 'pending'}
                </Badge>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
