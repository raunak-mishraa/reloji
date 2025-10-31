"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ItemCondition } from '@prisma/client';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Upload, X, ImageIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  pricePerDay: z.coerce.number().min(1, 'Price must be at least 1'),
  depositAmount: z.coerce.number().min(0, 'Deposit cannot be negative'),
  categoryId: z.string().min(1, 'Please select a category'),
  location: z.string().min(3, 'Location is required'),
  rules: z.string(),
  cancellationPolicy: z.string(),
  maxBorrowDuration: z.coerce.number(),
  condition: z.nativeEnum(ItemCondition),
  circleId: z.string().optional(),
});

type Category = { id: string; name: string };
type Circle = { id: string; name: string };

type FormValues = z.infer<typeof formSchema>;

export default function NewListingPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [circles, setCircles] = useState<Circle[]>([]);
  const router = useRouter();
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  const form = useForm<any>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      title: '',
      description: '',
      pricePerDay: 10,
      depositAmount: 50,
      categoryId: '',
      location: '',
      rules: 'No smoking.',
      cancellationPolicy: 'Full refund if cancelled 48 hours in advance.',
      maxBorrowDuration: 7,
      condition: ItemCondition.GOOD,
      circleId: '',
    },
  });

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then(setCategories);

    fetch('/api/user/circles')
      .then(res => res.json())
      .then(setCircles);
  }, []);

  useEffect(() => {
    if (!navigator?.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ lat: latitude, lng: longitude });
        try {
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          if (res.ok) {
            const data = await res.json();
            const city = data.city || data.locality || data.principalSubdivision || '';
            const country = data.countryName || '';
            const label = [city, country].filter(Boolean).join(', ');
            if (label) {
              form.setValue('location', label as any, { shouldValidate: true });
            }
          }
        } catch (e) {
          // ignore reverse geocode errors
        }
      },
      () => {
        // user denied or error, keep manual input
      }
    );
  }, []);

  const useCurrentLocation = () => {
    if (!navigator?.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ lat: latitude, lng: longitude });
        try {
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          if (res.ok) {
            const data = await res.json();
            const city = data.city || data.locality || data.principalSubdivision || '';
            const country = data.countryName || '';
            const label = [city, country].filter(Boolean).join(', ');
            if (label) {
              form.setValue('location', label as any, { shouldValidate: true });
            }
          }
        } catch {}
      },
      () => {}
    );
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'reloji');

    const uploadResponse = await fetch('/api/uploads/cloudinary', {
      method: 'POST',
      body: formData,
    });

    if (!uploadResponse.ok) {
      let msg = 'Failed to upload image.';
      try { msg = await uploadResponse.text(); } catch {}
      toast({ title: 'Upload error', description: msg || 'Server returned an error.', variant: 'destructive' });
      setIsUploading(false);
      return;
    }

    const data = await uploadResponse.json();
    const imageUrl = (data.url as string) || (data.secure_url as string);
    if (!imageUrl) {
      toast({ title: 'Error', description: 'Upload response missing image URL.', variant: 'destructive' });
      setIsUploading(false);
      return;
    }
    setImageUrls((prev) => [...prev, imageUrl]);
    setIsUploading(false);
  };

  async function onSubmit(values: FormValues) {
    if (imageUrls.length === 0) {
      toast({ title: "Error", description: "Please upload at least one image.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          imageUrls,
          location: {
            city: values.location,
            coords: coords ? { lat: coords.lat, lng: coords.lng } : undefined,
          },
        }),
      });

      if (!response.ok) {
        let errText = 'Failed to create listing';
        try { errText = await response.text(); } catch {}
        throw new Error(errText);
      }

      const newListing = await response.json();
      toast({ title: "Success", description: "Your listing has been created successfully!" });
      router.push(`/listings/${newListing.slug}`);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  }

  const removeImage = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#374151_1px,transparent_1px)]" />
      
      <div className="container mx-auto max-w-4xl py-12 px-4 md:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Create a New Listing
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">Share your item with the community and start earning</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit((v:any) => onSubmit(v as FormValues))} className="space-y-6">
            {/* Basic Information Card */}
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Basic Information</CardTitle>
                <CardDescription>Tell us about your item</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Canon EOS R5 Camera" {...field} className="h-11" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description *</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe your item in detail" {...field} className="min-h-32 resize-none" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category *</FormLabel>
                        <FormControl>
                          <select {...field} className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                            <option value="">Select a category</option>
                            {categories.map((cat) => (
                              <option key={cat.id} value={cat.id}>
                                {cat.name}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location *</FormLabel>
                        <FormControl>
                          <div className="flex gap-2">
                            <Input placeholder="e.g., San Francisco, CA" {...field} className="h-11" />
                            <Button type="button" variant="outline" onClick={useCurrentLocation} className="whitespace-nowrap">Use current</Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Circle Selection Card */}
            {circles.length > 0 && (
              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl">Share in a Circle</CardTitle>
                  <CardDescription>Optionally, share this item within one of your circles.</CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="circleId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Circle</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-11">
                              <SelectValue placeholder="Select a circle (optional)" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {circles.map((circle) => (
                              <SelectItem key={circle.id} value={circle.id}>
                                {circle.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}

            {/* Pricing Card */}
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Pricing</CardTitle>
                <CardDescription>Set your rates and deposit</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="pricePerDay"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price per Day (₹) *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                            <Input type="number" {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)} className="h-11 pl-8" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="depositAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deposit Amount (₹) *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                            <Input type="number" {...field} className="h-11 pl-8" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Details Card */}
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Rental Details</CardTitle>
                <CardDescription>Define your rental terms and conditions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="maxBorrowDuration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Borrow Duration (Days) *</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 7" {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)} className="h-11" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rules"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rental Rules</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., No smoking, return clean..." {...field} value={field.value ?? ''} className="min-h-24 resize-none" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cancellationPolicy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cancellation Policy</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., Full refund if cancelled 48 hours in advance..." {...field} value={field.value ?? ''} className="min-h-24 resize-none" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Images Card */}
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">Images</CardTitle>
                <CardDescription>Upload clear photos of your item *</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                  {/* Overlay while uploading */}
                  {isUploading && (
                    <div className="absolute inset-0 z-10 rounded-lg bg-background/60 backdrop-blur-sm flex items-center justify-center">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-5 w-5 animate-spin" /> Uploading...
                      </div>
                    </div>
                  )}
                  <label htmlFor="image-upload" className={`cursor-pointer flex flex-col items-center gap-2 ${isUploading ? 'pointer-events-none opacity-60' : ''}`}>
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                      <Upload className="w-8 h-8 text-primary" />
                    </div>
                    <p className="text-sm font-medium">{isUploading ? 'Uploading...' : 'Click to upload images'}</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG or WEBP (max. 5MB)</p>
                  </label>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                </div>

                {imageUrls.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {imageUrls.map((url, index) => (
                      <div key={url} className="relative group aspect-square rounded-lg overflow-hidden border-2">
                        <img src={url} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} size="lg" className="min-w-32">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Listing'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
