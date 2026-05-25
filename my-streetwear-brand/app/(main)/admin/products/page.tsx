'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Product, Size } from '@/types';
import { ProductTable } from '@/components/admin/ProductTable';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Plus, Trash2, Image as ImageIcon } from 'lucide-react';

interface VariantFormData {
  size: Size;
  color: string;
  stockQuantity: number;
  sku: string;
  priceOverride?: number;
}

interface ImageFormData {
  url: string;
  isMain: boolean;
  altText?: string;
}

interface ProductFormData {
  title: string;
  slug: string;
  description: string;
  basePrice: number;
  category: string;
  isActive: boolean;
  variants: VariantFormData[];
  images: ImageFormData[];
}

const initialFormData: ProductFormData = {
  title: '',
  slug: '',
  description: '',
  basePrice: 0,
  category: '',
  isActive: true,
  variants: [
    { size: 'M' as Size, color: 'Black', stockQuantity: 10, sku: '' }
  ],
  images: [],
};

export default function AdminProductsPage() {
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.products.list({ limit: 100 });
      const productList = Array.isArray(response.data) 
        ? response.data 
        : (response.data as any)?.products || [];
      setProducts(productList);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (editId && products.length > 0) {
      const product = products.find(p => p.id === editId);
      if (product) {
        handleEdit(product.id);
      }
    }
  }, [editId, products]);

  const handleEdit = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setEditingProduct(product);
      setFormData({
        title: product.title,
        slug: product.slug,
        description: product.description || '',
        basePrice: Number(product.basePrice),
        category: product.category || '',
        isActive: product.isActive,
        variants: product.variants?.map(v => ({
          size: v.size,
          color: v.color,
          stockQuantity: v.stockQuantity,
          sku: v.sku,
          priceOverride: v.priceOverride ? Number(v.priceOverride) : undefined
        })) || [],
        images: product.images?.map(img => ({
          url: img.url,
          isMain: img.isMain,
          altText: img.altText || ''
        })) || [],
      });
      setIsModalOpen(true);
    }
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setFormData(initialFormData);
    setIsModalOpen(true);
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await api.products.delete(productId);
      await fetchProducts();
    } catch (err) {
      console.error('Failed to delete product:', err);
      setError('Failed to delete product');
    }
  };

  const handleToggleActive = async (productId: string, isActive: boolean) => {
    try {
      await api.products.update(productId, { isActive });
      await fetchProducts();
    } catch (err) {
      console.error('Failed to update product:', err);
      setError('Failed to update product');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      if (editingProduct) {
        await api.products.update(editingProduct.id, formData as any);
      } else {
        await api.products.create(formData as any);
      }
      setIsModalOpen(false);
      await fetchProducts();
    } catch (err) {
      console.error('Failed to save product:', err);
      setError(err instanceof Error ? err.message : 'Failed to save product');
    } finally {
      setIsSaving(false);
    }
  };

  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { size: 'M' as Size, color: 'Black', stockQuantity: 0, sku: '' }]
    }));
  };

  const removeVariant = (index: number) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const compressImage = (file: File, maxWidth = 1000, quality = 0.7): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(event.target?.result as string);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        };
        img.onerror = () => {
          resolve(event.target?.result as string);
        };
        img.src = event.target?.result as string;
      };
      reader.onerror = () => {
        resolve('');
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      try {
        const compressedBase64 = await compressImage(file);
        if (!compressedBase64) continue;
        
        setFormData((prev) => {
          const isMain = prev.images.length === 0;
          return {
            ...prev,
            images: [...prev.images, { url: compressedBase64, isMain, altText: file.name }]
          };
        });
      } catch (err) {
        console.error('Failed to compress image:', err);
      }
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Inventory Management</h1>
          <p className="text-gray-400 mt-1">Add new items and update stock levels</p>
        </div>
        <Button onClick={handleCreate} className="bg-white text-black hover:bg-gray-200">
          <Plus className="w-4 h-4 mr-2" />
          Add New Item
        </Button>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 text-red-400 flex justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-300 hover:text-red-200">Dismiss</button>
        </div>
      )}

      <ProductTable
        products={products}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleActive={handleToggleActive}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? 'Edit Item' : 'Add New Item'}
      >
        <form onSubmit={handleSubmit} className="space-y-8 max-h-[70vh] overflow-y-auto px-1">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-gray-800 pb-2">Basic Information</h3>
              <Input
                label="Item Name"
                value={formData.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setFormData(prev => ({
                    ...prev,
                    title,
                    slug: editingProduct ? prev.slug : generateSlug(title),
                  }));
                }}
                placeholder="e.g. BOMA Signature Hoodie"
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-white transition-colors resize-none"
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-gray-800 pb-2">Pricing & Status</h3>
              <Input
                label="Base Price (GH₵)"
                type="number"
                value={formData.basePrice}
                onChange={(e) => setFormData(prev => ({ ...prev, basePrice: Number(e.target.value) }))}
                min={0}
                required
              />
              <Input
                label="Category"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                placeholder="e.g. Hoodies, Tees, Accessories"
                required
              />
              <div className="flex items-center gap-2 pt-4">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="w-5 h-5 rounded border-gray-700 bg-gray-900 text-white focus:ring-0"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-300">
                  Visible to Customers
                </label>
              </div>
            </div>
          </div>

          {/* Variants */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-2">
              <h3 className="text-lg font-semibold text-white">Variants (Sizes & Colors)</h3>
              <Button type="button" variant="outline" size="sm" onClick={addVariant}>
                <Plus className="w-4 h-4 mr-1" /> Add Variant
              </Button>
            </div>
            <div className="space-y-3">
              {formData.variants.map((variant, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-3 p-4 bg-gray-900/50 rounded-lg border border-gray-800 relative group">
                  <div>
                    <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Size</label>
                    <select
                      value={variant.size}
                      onChange={(e) => {
                        const newVariants = [...formData.variants];
                        newVariants[index].size = e.target.value as Size;
                        setFormData(prev => ({ ...prev, variants: newVariants }));
                      }}
                      className="w-full px-2 py-1.5 bg-gray-800 border border-gray-700 rounded text-sm text-white"
                    >
                      {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Color</label>
                    <input
                      value={variant.color}
                      onChange={(e) => {
                        const newVariants = [...formData.variants];
                        newVariants[index].color = e.target.value;
                        setFormData(prev => ({ ...prev, variants: newVariants }));
                      }}
                      className="w-full px-2 py-1.5 bg-gray-800 border border-gray-700 rounded text-sm text-white"
                      placeholder="e.g. Black"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Stock</label>
                    <input
                      type="number"
                      value={variant.stockQuantity}
                      onChange={(e) => {
                        const newVariants = [...formData.variants];
                        newVariants[index].stockQuantity = Number(e.target.value);
                        setFormData(prev => ({ ...prev, variants: newVariants }));
                      }}
                      className="w-full px-2 py-1.5 bg-gray-800 border border-gray-700 rounded text-sm text-white"
                      min={0}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">SKU</label>
                    <input
                      value={variant.sku}
                      onChange={(e) => {
                        const newVariants = [...formData.variants];
                        newVariants[index].sku = e.target.value;
                        setFormData(prev => ({ ...prev, variants: newVariants }));
                      }}
                      className="w-full px-2 py-1.5 bg-gray-800 border border-gray-700 rounded text-sm text-white"
                      placeholder="BOMA-BLK-M"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="text-red-500 hover:text-red-400 hover:bg-red-500/10 w-full"
                      onClick={() => removeVariant(index)}
                      disabled={formData.variants.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-2">
              <h3 className="text-lg font-semibold text-white">Product Images</h3>
              <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-700 bg-gray-900 rounded-lg text-sm font-medium text-white hover:bg-gray-800 transition-colors">
                <ImageIcon className="w-4 h-4 mr-2" /> Upload Images
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
            
            {formData.images.length === 0 ? (
              <div className="border-2 border-dashed border-gray-800 rounded-lg p-8 text-center text-gray-500">
                <p>No images uploaded yet.</p>
                <p className="text-xs text-gray-600 mt-1">Click the button above to upload images from your local drive.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="p-3 bg-gray-900/50 rounded-lg border border-gray-800 space-y-3 relative group">
                    <div className="h-40 w-full overflow-hidden rounded bg-black flex items-center justify-center relative">
                      <img
                        src={image.url}
                        alt={image.altText || 'Product image'}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="main-image"
                          id={`main-${index}`}
                          checked={image.isMain}
                          onChange={() => {
                            const newImages = formData.images.map((img, i) => ({
                              ...img,
                              isMain: i === index
                            }));
                            setFormData(prev => ({ ...prev, images: newImages }));
                          }}
                          className="w-4 h-4 text-white focus:ring-0 focus:ring-offset-0 cursor-pointer"
                        />
                        <label htmlFor={`main-${index}`} className="text-xs text-gray-400 cursor-pointer">Main Image</label>
                      </div>
                      <button 
                        type="button"
                        onClick={() => removeImage(index)}
                        className="text-red-500 hover:text-red-400 text-xs font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-800">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" className="bg-white text-black hover:bg-gray-200 px-8" isLoading={isSaving}>
              {editingProduct ? 'Update Product' : 'Confirm & Save Item'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
