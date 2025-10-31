"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

interface PremiumModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PremiumModal({ open, onOpenChange }: PremiumModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-400" />
            Upgrade to Premium
          </DialogTitle>
          <DialogDescription>
            Get access to exclusive features and connect directly with sellers.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="text-center mb-6">
            <p className="text-4xl font-bold">₹9</p>
            <p className="text-sm text-muted-foreground">per month</p>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-400" />
              <span>See seller's phone number</span>
            </li>
            <li className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-400" />
              <span>Higher chance of getting your request approved</span>
            </li>
            <li className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-400" />
              <span>Create and join exclusive communities</span>
            </li>
          </ul>
        </div>
        <Button className="w-full">Upgrade Now</Button>
      </DialogContent>
    </Dialog>
  );
}
