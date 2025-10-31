'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setAuthState } from '@/store/slices/authSlice';
import { useRouter } from 'next/navigation';

export default function PhoneVerificationModal({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAppSelector(s => s.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const isValidPhone = (value: string) => {
    const trimmed = value.trim();
    // Accepts E.164 like +XXXXXXXXXXX or local digits 10-15
    return /^\+?[0-9]{10,15}$/.test(trimmed);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    if (!isValidPhone(phone)) {
      setIsLoading(false);
      setError('Please enter a valid phone number');
      return;
    }
    try {
      const response = await fetch('/api/profile/phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, userId: auth.user?.id }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error((data as any).message || 'Failed to update phone number');
      }

      // Optimistically update redux auth state with phone
      dispatch(
        setAuthState({
          status: auth.status,
          user: auth.user ? { ...auth.user, phone } : auth.user,
        })
      );
      onOpenChange(false);
      router.push('/listings/new');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Phone Verification</DialogTitle>
          <DialogDescription>
            To create a listing, please add your phone number.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Enter your phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          {!isValidPhone(phone) && phone.length > 0 && (
            <p className="text-red-500 text-sm">Please enter a valid phone number</p>
          )}
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isLoading || !isValidPhone(phone)}>
            {isLoading ? 'Saving...' : 'Save and Continue'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
