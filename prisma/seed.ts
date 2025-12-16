import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// BOMA 2025 Products with actual pricing (GHS)
const products = [
  // Main Collection
  { name: 'Racket Tee', price: 425, description: 'Premium cotton tee with bold BOMA graphics' },
  { name: 'Dice', price: 500, description: 'Statement piece from the BOMA 2025 collection' },
  { name: 'BOMA Ride', price: 575, description: 'Premium streetwear for the bold and fearless' },
  { name: 'Bikea', price: 425, description: 'Classic BOMA style with modern edge' },
  
  // Boma Babe Collection
  { name: 'Halter', price: 160, description: 'Stylish halter top for the BOMA babe' },
  { name: 'Baby Tee', price: 300, description: 'Fitted baby tee with BOMA branding' },
  { name: 'Baby Shorts', price: 200, description: 'Comfortable shorts for everyday wear' },
  { name: 'Sleeveless', price: 250, description: 'Sleeveless top perfect for the streets' },
  { name: 'Ford', price: 200, description: 'Casual streetwear essential' },
  
  // Accessories
  { name: 'Distressed Cap', price: 250, description: 'Vintage-style distressed cap with BOMA logo' },
  { name: 'Trucker Cap', price: 200, description: 'Classic trucker cap with mesh back' },
  
  // Bottoms
  { name: 'BOMA Pants', price: 600, description: 'Premium pants for the complete BOMA look' },
];

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  console.log('🗑️ Clearing existing products...');
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.image.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@boma.com' },
    update: {},
    create: {
      email: 'admin@boma.com',
      passwordHash: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create products - use 24 images across 12 products (2 images each)
  for (let i = 0; i < products.length; i++) {
    const { name, price, description } = products[i];
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    const imageNum = (i * 2) + 1; // Each product gets 2 consecutive images

    const product = await prisma.product.create({
      data: {
        title: name,
        slug,
        description,
        basePrice: price,
        variants: {
          create: [
            { size: 'S', color: 'Black', stockQuantity: 10, sku: `BOMA-${slug}-S-BLK` },
            { size: 'M', color: 'Black', stockQuantity: 15, sku: `BOMA-${slug}-M-BLK` },
            { size: 'L', color: 'Black', stockQuantity: 12, sku: `BOMA-${slug}-L-BLK` },
            { size: 'XL', color: 'Black', stockQuantity: 8, sku: `BOMA-${slug}-XL-BLK` },
            { size: 'S', color: 'White', stockQuantity: 8, sku: `BOMA-${slug}-S-WHT` },
            { size: 'M', color: 'White', stockQuantity: 12, sku: `BOMA-${slug}-M-WHT` },
            { size: 'L', color: 'White', stockQuantity: 10, sku: `BOMA-${slug}-L-WHT` },
          ],
        },
        images: {
          create: [
            {
              url: `/lookbook/Konu_pixels - ALL RIGHTS RESERVED-BOMA 2025_${imageNum}.jpg`,
              isMain: true,
              altText: `${name} - Main View`,
            },
            {
              url: `/lookbook/Konu_pixels - ALL RIGHTS RESERVED-BOMA 2025_${imageNum + 1}.jpg`,
              isMain: false,
              altText: `${name} - Alternate View`,
            },
          ],
        },
      },
    });
    console.log(`✅ Product created: ${product.title} - GHS ${price}`);
  }

  console.log('🎉 Seeding completed! 12 BOMA products created.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
