"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Camera, HardHat, Music, Bike, Tent, Gamepad2, ImageIcon } from 'lucide-react';

type Category = {
  id: string;
  name: string;
  icon?: string;
};

const dummyCategories: Category[] = [
    { id: 'clxne4o9c000008l3f8g2h4j1', name: 'Photography' },
    { id: 'clxne4o9d000108l3c2g1h7k2', name: 'Tools & DIY' },
    { id: 'clxne4o9d000208l3a9f8b6c3', name: 'Music' },
    { id: 'clxne4o9d000308l3e7d6f4g5', name: 'Sports' },
    { id: 'clxne4o9e000408l3h2j1k9l8', name: 'Outdoor' },
    { id: 'clxne4o9e000508l3b4c2d1e9', name: 'Gaming' },
];

const categoryIcons: { [key: string]: React.ElementType } = {
  default: ImageIcon,
  Photography: Camera,
  'Tools & DIY': HardHat,
  Music: Music,
  Sports: Bike,
  Outdoor: Tent,
  Gaming: Gamepad2,
};

export default function CategoryGrid() {
  const [categories, setCategories] = useState<Category[]>(dummyCategories);

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(fetchedCategories => {
        if (fetchedCategories && fetchedCategories.length > 0) {
          setCategories(fetchedCategories);
        }
      })
      .catch(() => {
        console.log("Failed to fetch categories, using dummy data.");
      });
  }, []);

  return (
    <div className="py-12">
      <h2 className="text-2xl font-bold text-center mb-8">Browse by Category</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {categories.map(category => {
          const Icon = categoryIcons[category.name] || categoryIcons.default;
          return (
            <Link href={`/?categoryId=${category.id}`} key={category.id}>
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
