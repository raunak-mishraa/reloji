'use client';

import { useSearchParams } from 'next/navigation';
import React, { Suspense, useState } from 'react';
import Listings from '@/components/Listings';
import SearchFilters from '@/components/SearchFilters';

function SearchPageContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || undefined;
  const search = searchParams.get('search') || undefined;

  // This will eventually hold state for all filters
  const [filters, setFilters] = React.useState({});

  return (
    <div className="container mx-auto px-4 md:px-8 py-4 md:py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8">
        <div className="md:col-span-1">
          <SearchFilters onFilterChange={setFilters} />
        </div>
        <div className="md:col-span-3">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">{category || 'All Listings'}</h1>
          <Listings categoryId={category} search={search} {...filters} />
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
