'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Address } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { SkeletonCard } from '@/components/SkeletonCard';

interface AddressFormData {
  fullName: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

const initialFormData: AddressFormData = {
  fullName: '',
  street: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'Nigeria',
  phone: '',
  isDefault: false,
};

export function AddressBook() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState<AddressFormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const { data, isLoading, isError } = useQuery({
    queryKey: ['addresses'],
    queryFn: () => api.addresses.list(),
  });

  const createMutation = useMutation({
    mutationFn: (data: Omit<Address, 'id'>) => api.addresses.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      closeModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Address> }) =>
      api.addresses.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.addresses.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });

  const setDefaultMutation = useMutation({
    mutationFn: (id: string) => api.addresses.setDefault(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) errors.fullName = 'Full name is required';
    if (!formData.street.trim()) errors.street = 'Street address is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.state.trim()) errors.state = 'State is required';
    if (!formData.postalCode.trim()) errors.postalCode = 'Postal code is required';
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (field: keyof AddressFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const openAddModal = () => {
    setEditingAddress(null);
    setFormData(initialFormData);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      fullName: address.fullName,
      street: address.street,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      phone: address.phone,
      isDefault: address.isDefault,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAddress(null);
    setFormData(initialFormData);
    setFormErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingAddress) {
      updateMutation.mutate({ id: editingAddress.id, data: formData });
    } else {
      createMutation.mutate(formData as Omit<Address, 'id'>);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this address?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <SkeletonCard key={i} className="h-32" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Failed to load addresses. Please try again.</p>
      </div>
    );
  }

  const addresses = data?.data || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-white">Saved Addresses</h3>
        <Button onClick={openAddModal} size="sm">
          Add Address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-12 bg-gray-900 rounded-lg border border-gray-800">
          <svg
            className="mx-auto h-12 w-12 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <h4 className="mt-4 text-white">No addresses saved</h4>
          <p className="mt-2 text-gray-400 text-sm">
            Add an address for faster checkout.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`p-4 bg-gray-900 rounded-lg border ${
                address.isDefault ? 'border-white' : 'border-gray-800'
              }`}
            >
              {address.isDefault && (
                <span className="text-xs text-white bg-gray-700 px-2 py-1 rounded mb-2 inline-block">
                  Default
                </span>
              )}
              <p className="font-medium text-white">{address.fullName}</p>
              <p className="text-gray-400 text-sm mt-1">{address.street}</p>
              <p className="text-gray-400 text-sm">
                {address.city}, {address.state} {address.postalCode}
              </p>
              <p className="text-gray-400 text-sm">{address.country}</p>
              <p className="text-gray-400 text-sm mt-1">{address.phone}</p>
              
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => openEditModal(address)}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Edit
                </button>
                {!address.isDefault && (
                  <>
                    <span className="text-gray-600">|</span>
                    <button
                      onClick={() => setDefaultMutation.mutate(address.id)}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      Set as default
                    </button>
                  </>
                )}
                <span className="text-gray-600">|</span>
                <button
                  onClick={() => handleDelete(address.id)}
                  className="text-sm text-red-500 hover:text-red-400 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingAddress ? 'Edit Address' : 'Add New Address'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            value={formData.fullName}
            onChange={handleChange('fullName')}
            error={formErrors.fullName}
            placeholder="John Doe"
          />
          
          <Input
            label="Street Address"
            value={formData.street}
            onChange={handleChange('street')}
            error={formErrors.street}
            placeholder="123 Main Street"
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="City"
              value={formData.city}
              onChange={handleChange('city')}
              error={formErrors.city}
              placeholder="Lagos"
            />
            <Input
              label="State"
              value={formData.state}
              onChange={handleChange('state')}
              error={formErrors.state}
              placeholder="Lagos"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Postal Code"
              value={formData.postalCode}
              onChange={handleChange('postalCode')}
              error={formErrors.postalCode}
              placeholder="100001"
            />
            <Input
              label="Country"
              value={formData.country}
              onChange={handleChange('country')}
              placeholder="Nigeria"
            />
          </div>
          
          <Input
            label="Phone Number"
            value={formData.phone}
            onChange={handleChange('phone')}
            error={formErrors.phone}
            placeholder="+234 800 000 0000"
          />
          
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isDefault}
              onChange={handleChange('isDefault')}
              className="w-4 h-4 bg-gray-900 border-gray-700 rounded"
            />
            <span className="text-sm text-gray-300">Set as default address</span>
          </label>
          
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={closeModal}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              isLoading={createMutation.isPending || updateMutation.isPending}
            >
              {editingAddress ? 'Save Changes' : 'Add Address'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
