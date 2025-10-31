'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useDebounce } from '@/hooks/useDebounce';

export default function SearchFilters({ onFilterChange }: { onFilterChange: (filters: any) => void }) {
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState<[number, number]>([0, 1000]);
  const [distance, setDistance] = useState(50);
  const [useNearby, setUseNearby] = useState(false);
  const [coords, setCoords] = useState<{ latitude: number | null, longitude: number | null }>({ latitude: null, longitude: null });

  const debouncedLocation = useDebounce(location, 500);

  useEffect(() => {
    if (useNearby) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting user location:", error);
          setUseNearby(false);
        }
      );
    } else {
      setCoords({ latitude: null, longitude: null });
    }
  }, [useNearby]);

  useEffect(() => {
    const filters: any = {
      minPrice: budget[0],
      maxPrice: budget[1],
    };

    if (useNearby && coords.latitude && coords.longitude) {
      filters.latitude = coords.latitude;
      filters.longitude = coords.longitude;
      filters.distance = distance;
    } else {
      filters.location = debouncedLocation;
    }

    onFilterChange(filters);
  }, [debouncedLocation, budget, distance, onFilterChange, useNearby, coords]);

  return (
    <div className="bg-card p-4 rounded-xl border shadow-sm space-y-6">
      <h3 className="text-lg font-semibold">Filters</h3>

      <div className="flex items-center justify-between">
        <Label htmlFor="nearby-switch" className="text-sm font-medium">Search nearby</Label>
        <Switch
          id="nearby-switch"
          checked={useNearby}
          onCheckedChange={setUseNearby}
        />
      </div>

      {!useNearby && (
        <div>
          <label className="text-sm font-medium">Location</label>
          <Input 
            placeholder="Enter a city or zip code" 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            disabled={useNearby}
          />
        </div>
      )}

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
        <label className="text-sm font-medium">Distance (km)</label>
        <Slider 
          value={[distance]}
          onValueChange={(value) => setDistance(value[0])}
          max={100} 
          step={5} 
        />
        <div className="text-center text-xs text-muted-foreground mt-2">
          {distance} km
        </div>
      </div>
    </div>
  );
}

