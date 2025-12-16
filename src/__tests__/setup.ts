import { PrismaClient } from '@prisma/client';

// Create a test instance of Prisma
export const prisma = new PrismaClient();

// Mock data generators
export const generateTestEmail = () => `test-${Date.now()}@example.com`;

export const generateTestProduct = (overrides = {}) => ({
  title: 'Test Product',
  slug: `test-product-${Date.now()}`,
  description: 'Test Description',
  basePrice: 100,
  isActive: true,
  ...overrides,
});

export const generateTestUser = (overrides = {}) => ({
  email: generateTestEmail(),
  password: 'hashedPassword123',
  role: 'CUSTOMER',
  ...overrides,
});

export const generateTestOrder = (userId: string, overrides = {}) => ({
  userId,
  status: 'PENDING',
  totalAmount: 100,
  paymentRef: `ref-${Date.now()}`,
  ...overrides,
});
