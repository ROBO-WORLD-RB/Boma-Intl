import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Product names for the BOMA 2025 collection
const productNames = [
  'Culture Tee',
  'Streets Hoodie',
  'Accra Jacket',
  'Movement Pants',
  'Heritage Cap',
  'Unity Shorts',
  'Roots Sweater',
  'Vision Tank',
  'Legacy Joggers',
  'Spirit Vest',
  'Rhythm Shirt',
  'Flow Cardigan',
];

// Price range in GHS
const priceRanges = [250, 280, 300, 310, 320, 350, 380, 400];

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@streetwear.com' },
    update: {},
    create: {
      email: 'admin@streetwear.com',
      passwordHash: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create 24 products
  for (let i = 0; i < 24; i++) {
    const imageNum = i + 1;
    const nameIndex = i % productNames.length;
    const basePrice = priceRanges[i % priceRanges.length];
    const productName = `${productNames[nameIndex]} ${Math.floor(i / productNames.length) + 1}`;
    const slug = `${productNames[nameIndex].toLowerCase().replace(/\s+/g, '-')}-${i + 1}`;

    const product = await prisma.product.upsert({
      where: { slug },
      update: {},
      create: {
        title: productName,
        slug,
        description: `Premium streetwear piece from the BOMA 2025 collection. Crafted with attention to detail and designed for those who define the culture.`,
        basePrice,
        variants: {
          create: [
            { size: 'S', color: 'Black', stockQuantity: 5, sku: `BOMA-${i}-S-BLK` },
            { size: 'M', color: 'Black', stockQuantity: 8, sku: `BOMA-${i}-M-BLK` },
            { size: 'L', color: 'Black', stockQuantity: 3, sku: `BOMA-${i}-L-BLK` },
            { size: 'XL', color: 'Black', stockQuantity: 2, sku: `BOMA-${i}-XL-BLK` },
            { size: 'S', color: 'White', stockQuantity: 4, sku: `BOMA-${i}-S-WHT` },
            { size: 'M', color: 'White', stockQuantity: 6, sku: `BOMA-${i}-M-WHT` },
            { size: 'L', color: 'White', stockQuantity: 7, sku: `BOMA-${i}-L-WHT` },
          ],
        },
        images: {
          create: [
            {
              url: `/lookbook/Konu_pixels - ALL RIGHTS RESERVED-BOMA 2025_${imageNum}.jpg`,
              isMain: true,
              altText: `${productName} - Front View`,
            },
            {
              url: `/lookbook/Konu_pixels - ALL RIGHTS RESERVED-BOMA 2025_${((imageNum + 12) % 24) + 1}.jpg`,
              isMain: false,
              altText: `${productName} - Back View`,
            },
          ],
        },
      },
    });
    console.log(`✅ Product created: ${product.title}`);
  }

  console.log('🎉 Seeding completed! 24 products created.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
