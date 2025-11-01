import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: 'Electronics', slug: 'electronics' },
    { name: 'Cameras', slug: 'cameras' },
    { name: 'Laptops', slug: 'laptops' },
    { name: 'Smartphones', slug: 'smartphones' },
    { name: 'Gaming Consoles', slug: 'gaming-consoles' },
    { name: 'Audio Equipment', slug: 'audio-equipment' },
    { name: 'Drones', slug: 'drones' },
    { name: 'Tools & DIY', slug: 'tools-diy' },
    { name: 'Power Tools', slug: 'power-tools' },
    { name: 'Gardening', slug: 'gardening' },
    { name: 'Home Appliances', slug: 'home-appliances' },
    { name: 'Kitchen Appliances', slug: 'kitchen-appliances' },
    { name: 'Sports & Outdoors', slug: 'sports-outdoors' },
    { name: 'Camping Gear', slug: 'camping-gear' },
    { name: 'Cycling', slug: 'cycling' },
    { name: 'Water Sports', slug: 'water-sports' },
    { name: 'Party & Events', slug: 'party-events' },
    { name: 'Projectors', slug: 'projectors' },
    { name: 'Sound Systems', slug: 'sound-systems' },
    { name: 'Event Furniture', slug: 'event-furniture' },
    { name: 'Fashion', slug: 'fashion' },
    { name: 'Designer Bags', slug: 'designer-bags' },
    { name: 'Watches', slug: 'watches' },
    { name: 'Formal Wear', slug: 'formal-wear' },
    { name: 'Books & Media', slug: 'books-media' },
    { name: 'Textbooks', slug: 'textbooks' },
    { name: 'Musical Instruments', slug: 'musical-instruments' },
    { name: 'Guitars', slug: 'guitars' },
    { name: 'Keyboards', slug: 'keyboards' },
    { name: 'DJ Equipment', slug: 'dj-equipment' },
    { name: 'Vehicles', slug: 'vehicles' },
    { name: 'Cars', slug: 'cars' },
    { name: 'Motorcycles', slug: 'motorcycles' },
    { name: 'Bicycles', slug: 'bicycles' },
    { name: 'Other', slug: 'other' },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  console.log(`Seeded ${categories.length} categories`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
