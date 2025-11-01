'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet';
import { useDebounce } from '@/hooks/useDebounce';
import { SlidersHorizontal, MapPin, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function SearchFilters({ onFilterChange }: { onFilterChange: (filters: any) => void }) {
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState<[number, number]>([0, 1000]);
  const [distance, setDistance] = useState(50);
  const [useNearby, setUseNearby] = useState(false);
  const [coords, setCoords] = useState<{ latitude: number | null, longitude: number | null }>({ latitude: null, longitude: null });
  const [isOpen, setIsOpen] = useState(false);

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

  // Count active filters
  const getActiveFilterCount = () => {
    let count = 0;
    if (location) count++;
    if (useNearby) count++;
    if (budget[0] > 0 || budget[1] < 1000) count++;
    return count;
  };

  const handleReset = () => {
    setLocation('');
    setBudget([0, 1000]);
    setDistance(50);
    setUseNearby(false);
  };

  const filtersContent = (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <Label htmlFor="nearby-switch" className="text-sm font-medium cursor-pointer">Search nearby</Label>
        </div>
        <Switch
          id="nearby-switch"
          checked={useNearby}
          onCheckedChange={setUseNearby}
        />
      </div>

      {!useNearby && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Location</Label>
          <Input 
            placeholder="Enter city or zip code" 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            disabled={useNearby}
            className="h-10"
          />
        </div>
      )}

      <div className="space-y-3">
        <Label className="text-sm font-medium">Budget (₹ per day)</Label>
        <Slider 
          value={budget}
          onValueChange={(value) => setBudget(value as [number, number])}
          max={1000} 
          step={10}
          className="py-4"
        />
        <div className="flex justify-between items-center">
          <Badge variant="secondary" className="text-xs">₹{budget[0]}</Badge>
          <span className="text-xs text-muted-foreground">to</span>
          <Badge variant="secondary" className="text-xs">₹{budget[1]}</Badge>
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium">Distance (km)</Label>
        <Slider 
          value={[distance]}
          onValueChange={(value) => setDistance(value[0])}
          max={100} 
          step={5}
          className="py-4"
        />
        <div className="text-center">
          <Badge variant="secondary" className="text-xs">{distance} km</Badge>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="md:hidden mb-4">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="w-full relative h-10">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters
              {getActiveFilterCount() > 0 && (
                <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs" variant="default">
                  {getActiveFilterCount()}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[85vw] max-w-sm p-0 flex flex-col">
            <SheetHeader className="px-5 pt-5 pb-4 border-b">
              <SheetTitle className="flex items-center justify-between text-lg">
                <span>Filters</span>
                {getActiveFilterCount() > 0 && (
                  <Button variant="ghost" size="sm" onClick={handleReset} className="h-8 text-xs">
                    <X className="mr-1 h-3 w-3" />
                    Clear all
                  </Button>
                )}
              </SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto px-5 py-5">
              {filtersContent}
            </div>
            <div className="border-t px-5 py-4 bg-background">
              <Button onClick={() => setIsOpen(false)} className="w-full h-10">
                Show Results
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block bg-card p-4 rounded-xl border shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Filters</h3>
          {getActiveFilterCount() > 0 && (
            <Button variant="ghost" size="sm" onClick={handleReset} className="h-8 text-xs">
              <X className="mr-1 h-3 w-3" />
              Clear
            </Button>
          )}
        </div>
        {filtersContent}
      </div>
    </>
  );
}

