'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Users } from 'lucide-react';

interface Circle {
  id: string;
  name: string;
  slug: string;
  description: string;
  bannerImage: string | null;
  _count: { members: number };
}

export default function CirclesPage() {
  const [circles, setCircles] = useState<Circle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/circles')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch circles');
        return res.json();
      })
      .then(data => {
        setCircles(data);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="container mx-auto py-12 px-4 md:px-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Circles</h1>
        <Button asChild>
          <Link href="/circles/new">Create Circle</Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>
      ) : error ? (
        <div className="text-red-500">Error: {error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {circles.map(circle => (
            <Link href={`/circles/${circle.slug}`} key={circle.id}>
              <Card className="hover:shadow-lg transition-shadow overflow-hidden">
                <div className="h-32 bg-muted">
                  {circle.bannerImage && (
                    <img src={circle.bannerImage} alt={`${circle.name} banner`} className="w-full h-full object-cover" />
                  )}
                </div>
                <CardHeader>
                  <CardTitle>{circle.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 line-clamp-2">{circle.description}</p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-2" />
                    <span>{circle._count.members} members</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
