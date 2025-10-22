'use client';

import { useSearchParams } from 'next/navigation';
import React, { Suspense, useState } from 'react';
import Listings from '@/components/Listings';
import SearchFilters from '@/components/SearchFilters';

function SearchPageContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || undefined;

  // This will eventually hold state for all filters
  const [filters, setFilters] = React.useState({});

  return (
    <div className="container mx-auto px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <SearchFilters onFilterChange={setFilters} />
        </div>
        <div className="md:col-span-3">
          <h1 className="text-3xl font-bold mb-6">{category || 'All Listings'}</h1>
          <Listings categoryId={category} {...filters} />
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
