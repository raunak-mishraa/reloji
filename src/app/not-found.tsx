'use client'

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Home, Search, ArrowLeft, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#0f8c27]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#0f8c27]/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-[#0f8c27]/8 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-6 md:space-y-8">
          {/* 404 Number with Animation */}
          <div className="relative py-4">
            <div className="text-[120px] sm:text-[140px] md:text-[180px] font-black leading-none">
              <span className="bg-gradient-to-br from-[#0f8c27] via-[#0da024] to-[#0b8a1f] bg-clip-text text-transparent animate-gradient inline-block">
                404
              </span>
            </div>
            
            {/* Floating Question Mark Icon */}
            <div className="absolute top-2 right-4 sm:top-4 sm:right-8 md:-top-4 md:-right-4 animate-bounce">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-[#0f8c27]/10 flex items-center justify-center backdrop-blur-sm border-2 border-[#0f8c27]/20">
                <HelpCircle className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-[#0f8c27]" />
              </div>
            </div>
          </div>

          {/* Error Message */}
          <div className="space-y-2 md:space-y-3">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
              Oops! Page Not Found
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-xl mx-auto px-4">
              The page you're looking for seems to have wandered off.
            </p>
          </div>

          {/* Decorative Divider */}
          <div className="flex items-center justify-center gap-3 py-2">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#0f8c27]/30"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-[#0f8c27]"></div>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#0f8c27]/30"></div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center px-4">
            <Button 
              size="default"
              className="w-full sm:w-auto gap-2 bg-gradient-to-r from-[#0f8c27] via-[#0da024] to-[#0f8c27] hover:from-[#0da024] hover:via-[#0b8a1f] hover:to-[#0da024] text-white font-bold shadow-lg shadow-[#0f8c27]/30 hover:shadow-xl hover:shadow-[#0f8c27]/50 hover:scale-105 transition-all duration-300 border-0 relative overflow-hidden group"
              onClick={() => router.push('/')}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
              <Home className="h-4 w-4 relative z-10" />
              <span className="relative z-10">Back to Home</span>
            </Button>
            
            <Button 
              size="default"
              variant="outline"
              className="w-full sm:w-auto gap-2 border-2 hover:bg-[#0f8c27]/5 hover:border-[#0f8c27]/50 transition-all duration-300"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
            
            <Button 
              size="default"
              variant="outline"
              className="w-full sm:w-auto gap-2 border-2 hover:bg-[#0f8c27]/5 hover:border-[#0f8c27]/50 transition-all duration-300"
              asChild
            >
              <Link href="/search">
                <Search className="h-4 w-4" />
                Browse Items
              </Link>
            </Button>
          </div>

          {/* Helpful Links */}
          <div className="pt-4 px-4">
            <p className="text-xs sm:text-sm text-muted-foreground mb-3">Looking for something specific?</p>
            <div className="flex flex-wrap justify-center gap-2">
              <Link href="/search?search=Tools" className="text-xs sm:text-sm px-3 py-1.5 rounded-full bg-[#0f8c27]/10 hover:bg-[#0f8c27]/20 text-[#0f8c27] font-medium transition-all hover:scale-105">
                Tools
              </Link>
              <Link href="/search?search=Electronics" className="text-xs sm:text-sm px-3 py-1.5 rounded-full bg-[#0f8c27]/10 hover:bg-[#0f8c27]/20 text-[#0f8c27] font-medium transition-all hover:scale-105">
                Electronics
              </Link>
              <Link href="/search?search=Sports" className="text-xs sm:text-sm px-3 py-1.5 rounded-full bg-[#0f8c27]/10 hover:bg-[#0f8c27]/20 text-[#0f8c27] font-medium transition-all hover:scale-105">
                Sports
              </Link>
              <Link href="/search?search=Music" className="text-xs sm:text-sm px-3 py-1.5 rounded-full bg-[#0f8c27]/10 hover:bg-[#0f8c27]/20 text-[#0f8c27] font-medium transition-all hover:scale-105">
                Music
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
