'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useDebounce } from '@/hooks/useDebounce';

export default function SearchFilters({ onFilterChange }: { onFilterChange: (filters: any) => void }) {
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState<[number, number]>([0, 1000]);
  const [distance, setDistance] = useState(50);

  const debouncedLocation = useDebounce(location, 500);

  useEffect(() => {
    onFilterChange({ 
      location: debouncedLocation, 
      minPrice: budget[0],
      maxPrice: budget[1],
      distance 
    });
  }, [debouncedLocation, budget, distance, onFilterChange]);

  return (
    <div className="bg-card p-4 rounded-xl border shadow-sm space-y-6">
      <h3 className="text-lg font-semibold">Filters</h3>

      <div>
        <label className="text-sm font-medium">Location</label>
        <Input 
          placeholder="Enter a city or zip code" 
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      <div>
        <label className="text-sm font-medium">Budget (₹ per day)</label>
        <Slider 
          value={budget}
          onValueChange={(value) => setBudget(value as [number, number])}
          max={1000} 
          step={10} 
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>₹{budget[0]}</span>
          <span>₹{budget[1]}</span>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Distance (miles)</label>
        <Slider 
          value={[distance]}
          onValueChange={(value) => setDistance(value[0])}
          max={100} 
          step={5} 
        />
        <div className="text-center text-xs text-muted-foreground mt-2">
          {distance} miles
        </div>
      </div>
    </div>
  );
}

