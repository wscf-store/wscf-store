'use client';

import { useEffect, useState, useCallback } from 'react';
import { IoAdd, IoTrash, IoPencil, IoCopy } from 'react-icons/io5';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Spinner from '@/components/ui/Spinner';
import Badge from '@/components/ui/Badge';
import { formatPrice } from '@/utils/formatPrice';
import { AdminGuard } from '@/components/admin/AdminGuard';

function AdminCouponsContent() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage',
    value: '',
    minOrderAmount: '',
    maxDiscount: '',
    usageLimit: '',
    startDate: '',
    endDate: '',
    isActive: true,
  });

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

  const fetchCoupons = useCallback(async () => {
    try {
      const res = await fetch('/api/coupons', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCoupons(data.coupons || []);
      }
    } catch (error) {
      console.error('Error:', error);
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const resetForm = () => {
    setFormData({
      code: '',
      type: 'percentage',
      value: '',
      minOrderAmount: '',
      maxDiscount: '',
      usageLimit: '',
      startDate: '',
      endDate: '',
      isActive: true,
    });
    setEditingCoupon(null);
  };

  const openCreate = () => {
    resetForm();
    setShowModal(true);
  };

  const openEdit = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code || '',
      type: coupon.type || 'percentage',
      value: coupon.value?.toString() || '',
      minOrderAmount: coupon.minOrderAmount?.toString() || '',
      maxDiscount: coupon.maxDiscount?.toString() || '',
      usageLimit: coupon.usageLimit?.toString() || '',
      startDate: coupon.startDate ? new Date(coupon.startDate).toISOString().split('T')[0] : '',
      endDate: coupon.endDate ? new Date(coupon.endDate).toISOString().split('T')[0] : '',
      isActive: coupon.isActive !== false,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.code || !formData.value) {
      toast.error('Code and value are required');
      return;
    }

    setSaving(true);
    const payload = {
      ...formData,
      code: formData.code.toUpperCase(),
      value: parseFloat(formData.value),
      minOrderAmount: formData.minOrderAmount ? parseFloat(formData.minOrderAmount) : 0,
      maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : undefined,
      usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : undefined,
      startDate: formData.startDate || undefined,
      endDate: formData.endDate || undefined,
    };

    try {
      const url = editingCoupon
        ? `/api/coupons/${editingCoupon._id}`
        : '/api/coupons';
      const res = await fetch(url, {
        method: editingCoupon ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(editingCoupon ? 'Coupon updated!' : 'Coupon created!');
        setShowModal(false);
        resetForm();
        fetchCoupons();
      } else {
        const err = await res.json();
        toast.error(err.error || 'Something went wrong');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this coupon?')) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/coupons/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success('Coupon deleted');
        fetchCoupons();
      } else {
        toast.error('Failed to delete coupon');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setDeleting(null);
    }
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary-900">Coupons</h1>
          <p className="text-gray-500 mt-1">Create and manage discount coupons</p>
        </div>
        <Button onClick={openCreate}>
          <IoAdd className="h-5 w-5 mr-1" />
          Add Coupon
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-semibold text-gray-500 uppercase border-b border-gray-100">
                <th className="px-6 py-3">Code</th>
                <th className="px-6 py-3">Discount</th>
                <th className="px-6 py-3">Min Order</th>
                <th className="px-6 py-3">Usage</th>
                <th className="px-6 py-3">Valid Until</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {coupons.length > 0 ? (
                coupons.map((coupon) => {
                  const isExpired = coupon.endDate && new Date(coupon.endDate) < new Date();
                  return (
                    <tr key={coupon._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-primary-900 bg-gray-100 px-3 py-1 rounded-lg text-sm">
                            {coupon.code}
                          </span>
                          <button
                            onClick={() => copyCode(coupon.code)}
                            className="text-gray-400 hover:text-accent"
                          >
                            <IoCopy className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-primary-900">
                        {coupon.type === 'percentage'
                          ? `${coupon.value}%`
                          : formatPrice(coupon.value)}
                        {coupon.maxDiscount && (
                          <span className="text-xs text-gray-400 block">
                            Max: {formatPrice(coupon.maxDiscount)}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {coupon.minOrderAmount ? formatPrice(coupon.minOrderAmount) : '—'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {coupon.usedCount || 0}
                        {coupon.usageLimit ? ` / ${coupon.usageLimit}` : ''}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {coupon.endDate
                          ? new Date(coupon.endDate).toLocaleDateString()
                          : 'No expiry'}
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          color={
                            isExpired ? 'red' : coupon.isActive ? 'green' : 'gray'
                          }
                        >
                          {isExpired ? 'Expired' : coupon.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEdit(coupon)}
                            className="p-2 text-gray-400 hover:text-accent hover:bg-accent/10 rounded-lg transition-all"
                          >
                            <IoPencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(coupon._id)}
                            disabled={deleting === coupon._id}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          >
                            {deleting === coupon._id ? (
                              <Spinner size="sm" />
                            ) : (
                              <IoTrash className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                    No coupons yet. Create your first one!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title={editingCoupon ? 'Edit Coupon' : 'Create Coupon'}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Coupon Code *"
            value={formData.code}
            onChange={(e) =>
              setFormData((p) => ({ ...p, code: e.target.value.toUpperCase() }))
            }
            placeholder="e.g. SAVE20"
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData((p) => ({ ...p, type: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all bg-white"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (PKR)</option>
              </select>
            </div>
            <Input
              label={`Value * ${formData.type === 'percentage' ? '(%)' : '(PKR)'}`}
              type="number"
              value={formData.value}
              onChange={(e) => setFormData((p) => ({ ...p, value: e.target.value }))}
              placeholder="e.g. 20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Min Order Amount (PKR)"
              type="number"
              value={formData.minOrderAmount}
              onChange={(e) =>
                setFormData((p) => ({ ...p, minOrderAmount: e.target.value }))
              }
              placeholder="0"
            />
            <Input
              label="Max Discount (PKR)"
              type="number"
              value={formData.maxDiscount}
              onChange={(e) =>
                setFormData((p) => ({ ...p, maxDiscount: e.target.value }))
              }
              placeholder="No limit"
            />
          </div>

          <Input
            label="Usage Limit"
            type="number"
            value={formData.usageLimit}
            onChange={(e) => setFormData((p) => ({ ...p, usageLimit: e.target.value }))}
            placeholder="Unlimited"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData((p) => ({ ...p, startDate: e.target.value }))}
            />
            <Input
              label="End Date"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData((p) => ({ ...p, endDate: e.target.value }))}
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData((p) => ({ ...p, isActive: e.target.checked }))}
              className="w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent"
            />
            <span className="text-sm font-medium text-gray-700">Active</span>
          </label>

          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={saving} className="flex-1">
              {editingCoupon ? 'Update' : 'Create'} Coupon
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default function AdminCouponsPage() {
  return (
    <AdminGuard>
      <AdminCouponsContent />
    </AdminGuard>
  );
}
