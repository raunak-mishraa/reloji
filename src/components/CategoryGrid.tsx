"use client";

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Camera, HardHat, Music, Bike, Tent, Gamepad2, ImageIcon, Wrench, Laptop, Car } from 'lucide-react';

type Category = {
  id: string;
  name: string;
  icon?: string;
};

// Static categories - no API fetch
const categories: Category[] = [
    { id: 'tools', name: 'Tools & DIY' },
    { id: 'music', name: 'Music' },
    { id: 'sports', name: 'Sports' },
    { id: 'gaming', name: 'Gaming' },
    { id: 'electronics', name: 'Electronics' },
    { id: 'vehicles', name: 'Vehicles' },
];

const categoryIcons: { [key: string]: React.ElementType } = {
  default: ImageIcon,
  'Tools & DIY': HardHat,
  Music: Music,
  Sports: Bike,
  Gaming: Gamepad2,
  Electronics: Laptop,
  Vehicles: Car,
};

export default function CategoryGrid() {
  return (
    <div className="py-12">
      <h2 className="text-2xl font-bold text-center mb-8">Browse by Category</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {categories.map(category => {
          const Icon = categoryIcons[category.name] || categoryIcons.default;
          return (
            <Link href={`/search?search=${encodeURIComponent(category.name)}`} key={category.id}>
              <Card className="p-4 flex flex-col items-center justify-center aspect-square hover:bg-primary/5 hover:shadow-lg transition-all">
                <Icon className="h-10 w-10 text-primary mb-2" />
                <p className="font-semibold text-center">{category.name}</p>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
