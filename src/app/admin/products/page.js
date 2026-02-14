'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import {
  IoAdd,
  IoSearch,
  IoTrash,
  IoPencil,
  IoClose,
  IoCloudUpload,
  IoImageOutline,
} from 'react-icons/io5';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Spinner from '@/components/ui/Spinner';
import Badge from '@/components/ui/Badge';
import { formatPrice } from '@/utils/formatPrice';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    comparePrice: '',
    category: '',
    stock: '',
    sku: '',
    images: [],
    features: '',
    specifications: '',
    tags: '',
    isFeatured: false,
  });

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch(`/api/products?page=${page}&limit=10&search=${search}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      comparePrice: '',
      category: '',
      stock: '',
      sku: '',
      images: [],
      features: '',
      specifications: '',
      tags: '',
      isFeatured: false,
    });
    setEditingProduct(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price?.toString() || '',
      comparePrice: product.comparePrice?.toString() || '',
      category: product.category?._id || product.category || '',
      stock: product.stock?.toString() || '',
      sku: product.sku || '',
      images: product.images || [],
      features: (product.features || []).join('\n'),
      specifications: product.specifications
        ? Object.entries(product.specifications).map(([k, v]) => `${k}: ${v}`).join('\n')
        : '',
      tags: (product.tags || []).join(', '),
      isFeatured: product.isFeatured || false,
    });
    setShowModal(true);
  };

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files.length) return;

    setUploadingImages(true);
    const form = new FormData();
    Array.from(files).forEach((file) => form.append('files', file));

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      if (res.ok) {
        const data = await res.json();
        const uploadedImages = data.images || data.urls || [];
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, ...uploadedImages],
        }));
        toast.success(`${uploadedImages.length} image(s) uploaded`);
      } else {
        toast.error('Image upload failed');
      }
    } catch (error) {
      toast.error('Upload error');
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.category) {
      toast.error('Please fill in required fields');
      return;
    }

    setSaving(true);
    const payload = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : undefined,
      category: formData.category,
      stock: parseInt(formData.stock) || 0,
      sku: formData.sku,
      images: formData.images,
      features: formData.features
        ? formData.features.split('\n').filter((f) => f.trim())
        : [],
      specifications: formData.specifications
        ? Object.fromEntries(
            formData.specifications
              .split('\n')
              .filter((s) => s.includes(':'))
              .map((s) => {
                const [key, ...val] = s.split(':');
                return [key.trim(), val.join(':').trim()];
              })
          )
        : {},
      tags: formData.tags
        ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [],
      isFeatured: formData.isFeatured,
    };

    try {
      const url = editingProduct
        ? `/api/products/${editingProduct._id}`
        : '/api/products';
      const res = await fetch(url, {
        method: editingProduct ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(editingProduct ? 'Product updated!' : 'Product created!');
        setShowModal(false);
        resetForm();
        fetchProducts();
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
    if (!confirm('Are you sure you want to delete this product?')) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success('Product deleted');
        fetchProducts();
      } else {
        toast.error('Failed to delete product');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setDeleting(null);
    }
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary-900">Products</h1>
          <p className="text-gray-500 mt-1">Manage your product catalog</p>
        </div>
        <Button onClick={openCreateModal}>
          <IoAdd className="h-5 w-5 mr-1" />
          Add Product
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-semibold text-gray-500 uppercase border-b border-gray-100">
                <th className="px-6 py-3">Product</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3">Stock</th>
                <th className="px-6 py-3">Featured</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {product.images?.[0]?.url || product.images?.[0] ? (
                            <Image
                              src={product.images[0]?.url || product.images[0]}
                              alt={product.images[0]?.alt || product.name}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <IoImageOutline className="h-5 w-5 text-gray-300" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-primary-900 line-clamp-1">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-400">{product.sku || '—'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {product.category?.name || '—'}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-primary-900">
                        {formatPrice(product.price)}
                      </p>
                      {product.comparePrice > product.price && (
                        <p className="text-xs text-gray-400 line-through">
                          {formatPrice(product.comparePrice)}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Badge color={product.stock > 10 ? 'green' : product.stock > 0 ? 'yellow' : 'red'}>
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      {product.isFeatured ? (
                        <Badge color="blue">Featured</Badge>
                      ) : (
                        <span className="text-gray-300 text-sm">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-2 text-gray-400 hover:text-accent hover:bg-accent/10 rounded-lg transition-all"
                        >
                          <IoPencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          disabled={deleting === product._id}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          {deleting === product._id ? (
                            <Spinner size="sm" />
                          ) : (
                            <IoTrash className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-5 max-h-[70vh] overflow-y-auto pr-2">
          <Input
            label="Product Name *"
            value={formData.name}
            onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
            placeholder="e.g. Samsung Galaxy S24 Ultra"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all resize-none"
              placeholder="Product description..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Price (PKR) *"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData((p) => ({ ...p, price: e.target.value }))}
              placeholder="0"
            />
            <Input
              label="Compare Price"
              type="number"
              value={formData.comparePrice}
              onChange={(e) => setFormData((p) => ({ ...p, comparePrice: e.target.value }))}
              placeholder="0"
            />
            <Input
              label="Stock *"
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData((p) => ({ ...p, stock: e.target.value }))}
              placeholder="0"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all bg-white"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="SKU"
              value={formData.sku}
              onChange={(e) => setFormData((p) => ({ ...p, sku: e.target.value }))}
              placeholder="e.g. WSCF-001"
            />
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Images</label>
            <div className="flex flex-wrap gap-3 mb-3">
              {formData.images.map((img, i) => (
                <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden group">
                  <Image src={img} alt="" width={80} height={80} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <IoClose className="h-5 w-5 text-white" />
                  </button>
                </div>
              ))}
              <label className="w-20 h-20 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center cursor-pointer hover:border-accent hover:bg-accent/5 transition-all">
                {uploadingImages ? (
                  <Spinner size="sm" />
                ) : (
                  <IoCloudUpload className="h-6 w-6 text-gray-400" />
                )}
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploadingImages}
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Features <span className="text-gray-400 text-xs">(one per line)</span>
            </label>
            <textarea
              value={formData.features}
              onChange={(e) => setFormData((p) => ({ ...p, features: e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all resize-none"
              placeholder="Fast charging support&#10;Wireless connectivity&#10;Durable build"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Specifications <span className="text-gray-400 text-xs">(key: value, one per line)</span>
            </label>
            <textarea
              value={formData.specifications}
              onChange={(e) => setFormData((p) => ({ ...p, specifications: e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all resize-none"
              placeholder="Brand: Samsung&#10;Color: Black&#10;Weight: 150g"
            />
          </div>

          <Input
            label="Tags"
            value={formData.tags}
            onChange={(e) => setFormData((p) => ({ ...p, tags: e.target.value }))}
            placeholder="samsung, phone, flagship (comma separated)"
          />

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isFeatured}
              onChange={(e) => setFormData((p) => ({ ...p, isFeatured: e.target.checked }))}
              className="w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent"
            />
            <span className="text-sm font-medium text-gray-700">Featured product</span>
          </label>

          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={saving} className="flex-1">
              {editingProduct ? 'Update Product' : 'Create Product'}
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
