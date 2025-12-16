'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRedirectIfAuthenticated } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function RegisterPage() {
  const { register, isLoading, error, clearError } = useRedirectIfAuthenticated('/account');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    // Clear field error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (!validateForm()) return;
    
    try {
      await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
      });
    } catch {
      // Error is handled by the store
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-white tracking-wider">
            BOMA
          </Link>
          <h1 className="mt-6 text-2xl font-semibold text-white">
            Create your account
          </h1>
          <p className="mt-2 text-gray-400">
            Join the BOMA community
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500 rounded-md">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First name"
              type="text"
              value={formData.firstName}
              onChange={handleChange('firstName')}
              error={formErrors.firstName}
              placeholder="John"
              autoComplete="given-name"
            />

            <Input
              label="Last name"
              type="text"
              value={formData.lastName}
              onChange={handleChange('lastName')}
              error={formErrors.lastName}
              placeholder="Doe"
              autoComplete="family-name"
            />
          </div>

          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
            error={formErrors.email}
            placeholder="you@example.com"
            autoComplete="email"
          />

          <Input
            label="Password"
            type="password"
            value={formData.password}
            onChange={handleChange('password')}
            error={formErrors.password}
            placeholder="••••••••"
            helperText="Must be at least 8 characters"
            autoComplete="new-password"
          />

          <Input
            label="Confirm password"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange('confirmPassword')}
            error={formErrors.confirmPassword}
            placeholder="••••••••"
            autoComplete="new-password"
          />

          <div className="flex items-start">
            <input
              type="checkbox"
              id="terms"
              className="w-4 h-4 mt-0.5 bg-gray-900 border-gray-700 rounded focus:ring-white"
              required
            />
            <label htmlFor="terms" className="ml-2 text-sm text-gray-400">
              I agree to the{' '}
              <Link href="/terms" className="text-white hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-white hover:underline">
                Privacy Policy
              </Link>
            </label>
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            isLoading={isLoading}
          >
            Create account
          </Button>
        </form>

        <p className="mt-8 text-center text-gray-400">
          Already have an account?{' '}
          <Link
            href="/auth/login"
            className="text-white hover:underline font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
