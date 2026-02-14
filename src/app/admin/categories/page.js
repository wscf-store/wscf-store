'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import {
  IoAdd,
  IoTrash,
  IoPencil,
  IoClose,
  IoCloudUpload,
  IoImageOutline,
  IoReorderFour,
} from 'react-icons/io5';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Spinner from '@/components/ui/Spinner';
import Badge from '@/components/ui/Badge';
import { AdminGuard } from '@/components/admin/AdminGuard';

function AdminCategoriesContent() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    icon: '',
    isActive: true,
    order: 0,
  });

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const resetForm = () => {
    setFormData({ name: '', description: '', image: '', icon: '', isActive: true, order: 0 });
    setEditingCategory(null);
  };

  const openCreate = () => {
    resetForm();
    setShowModal(true);
  };

  const openEdit = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name || '',
      description: cat.description || '',
      image: cat.image || '',
      icon: cat.icon || '',
      isActive: cat.isActive !== false,
      order: cat.order || 0,
    });
    setShowModal(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    const form = new FormData();
    form.append('files', file);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      if (res.ok) {
        const data = await res.json();
        setFormData((p) => ({ ...p, image: data.urls[0] }));
        toast.success('Image uploaded');
      } else {
        toast.error('Upload failed');
      }
    } catch {
      toast.error('Upload error');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error('Name is required');
      return;
    }

    setSaving(true);
    try {
      const url = editingCategory
        ? `/api/categories/${editingCategory._id}`
        : '/api/categories';
      const res = await fetch(url, {
        method: editingCategory ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success(editingCategory ? 'Category updated!' : 'Category created!');
        setShowModal(false);
        resetForm();
        fetchCategories();
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
    if (!confirm('Delete this category? Products in this category won\'t be deleted.')) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success('Category deleted');
        fetchCategories();
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to delete');
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary-900">Categories</h1>
          <p className="text-gray-500 mt-1">Organise your products into categories</p>
        </div>
        <Button onClick={openCreate}>
          <IoAdd className="h-5 w-5 mr-1" />
          Add Category
        </Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.length > 0 ? (
          categories.map((cat) => (
            <div
              key={cat._id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group"
            >
              <div className="h-40 bg-gray-100 relative">
                {cat.image ? (
                  <Image src={cat.image} alt={cat.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <IoImageOutline className="h-10 w-10 text-gray-300" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => openEdit(cat)}
                    className="p-2 bg-white rounded-xl text-primary-900 hover:bg-accent hover:text-white transition-all shadow-lg"
                  >
                    <IoPencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat._id)}
                    disabled={deleting === cat._id}
                    className="p-2 bg-white rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-lg"
                  >
                    {deleting === cat._id ? <Spinner size="sm" /> : <IoTrash className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-primary-900">{cat.name}</h3>
                  <Badge color={cat.isActive !== false ? 'green' : 'gray'}>
                    {cat.isActive !== false ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {cat.description || 'No description'}
                </p>
                {cat.productCount !== undefined && (
                  <p className="text-xs text-gray-400 mt-2">{cat.productCount} products</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-400">
            No categories yet. Create your first one!
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title={editingCategory ? 'Edit Category' : 'Add Category'}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Category Name *"
            value={formData.name}
            onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
            placeholder="e.g. Power Banks"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all resize-none"
              placeholder="Brief category description..."
            />
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Image</label>
            {formData.image ? (
              <div className="relative w-full h-40 rounded-xl overflow-hidden mb-2">
                <Image src={formData.image} alt="" fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => setFormData((p) => ({ ...p, image: '' }))}
                  className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70"
                >
                  <IoClose className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-accent hover:bg-accent/5 transition-all">
                {uploadingImage ? (
                  <Spinner size="sm" />
                ) : (
                  <div className="text-center">
                    <IoCloudUpload className="h-8 w-8 text-gray-400 mx-auto mb-1" />
                    <span className="text-sm text-gray-500">Click to upload</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploadingImage}
                />
              </label>
            )}
          </div>

          <Input
            label="Icon (emoji or class)"
            value={formData.icon}
            onChange={(e) => setFormData((p) => ({ ...p, icon: e.target.value }))}
            placeholder="📱 or icon name"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Display Order"
              type="number"
              value={formData.order}
              onChange={(e) => setFormData((p) => ({ ...p, order: parseInt(e.target.value) || 0 }))}
            />
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData((p) => ({ ...p, isActive: e.target.checked }))}
                  className="w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent"
                />
                <span className="text-sm font-medium text-gray-700">Active</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={saving} className="flex-1">
              {editingCategory ? 'Update' : 'Create'} Category
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

export default function AdminCategoriesPage() {
  return (
    <AdminGuard>
      <AdminCategoriesContent />
    </AdminGuard>
  );
}
