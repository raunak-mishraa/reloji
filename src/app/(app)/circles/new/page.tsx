'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2, Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function NewCirclePage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [privacy, setPrivacy] = useState('PUBLIC');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      let bannerImageUrl: string | undefined = undefined;
      if (bannerImage) {
        // In a real app, you'd upload the bannerImage file to a service like Cloudinary
        // For now, we'll just use the base64 data URL as a placeholder.
        bannerImageUrl = bannerImage;
      }

      const response = await fetch('/api/circles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, privacy, bannerImage: bannerImageUrl }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to create circle');
      }

      const newCircle = await response.json();
      router.push(`/circles/${newCircle.slug}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-12 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Create a new Circle</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Circle Name</Label>
              <Input id="name" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Banner Image</Label>
              <div className="relative border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                {isUploading && (
                  <div className="absolute inset-0 z-10 rounded-lg bg-background/60 backdrop-blur-sm flex items-center justify-center">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-5 w-5 animate-spin" /> Uploading...
                    </div>
                  </div>
                )}
                <label htmlFor="banner-upload" className={`cursor-pointer flex flex-col items-center gap-2 ${isUploading ? 'pointer-events-none opacity-60' : ''}`}>
                  {bannerImage ? (
                    <img src={bannerImage} alt="Banner preview" className="h-24 w-full object-cover rounded-md" />
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                        <Upload className="w-8 h-8 text-primary" />
                      </div>
                      <p className="text-sm font-medium">Click to upload a banner</p>
                      <p className="text-xs text-muted-foreground">PNG, JPG or WEBP (max. 5MB)</p>
                    </>
                  )}
                </label>
                <Input
                  id="banner-upload"
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    // In a real app, you'd upload to a service like Cloudinary.
                    // For this example, we'll use a base64 data URL.
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setBannerImage(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  }}
                  className="hidden"
                  disabled={isUploading}
                />
                {bannerImage && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => setBannerImage(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Privacy</Label>
              <RadioGroup value={privacy} onValueChange={setPrivacy} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="PUBLIC" id="public" />
                  <Label htmlFor="public">Public</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="PRIVATE" id="private" />
                  <Label htmlFor="private">Private</Label>
                </div>
              </RadioGroup>
            </div>
            {error && <p className="text-red-500 text-sm">Error: {error}</p>}
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Circle
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
