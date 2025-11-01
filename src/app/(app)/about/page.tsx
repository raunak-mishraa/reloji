import { Card } from '@/components/ui/card';
import { Globe, Target, Users, Shield, Zap, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#374151_1px,transparent_1px)]" />
      
      <div className="container mx-auto px-4 md:px-8 py-8 md:py-16 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-16 md:mb-20">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
            About <span className="text-primary">Reloji</span>
          </h1>
          <p className="text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto leading-relaxed">
            Building a trusted community marketplace where you can safely rent items from people nearby
          </p>
        </div>

        {/* Mission Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16 md:mb-20">
          <Card className="p-6 border-2 hover:border-foreground/20 transition-all hover:shadow-lg">
            <div className="w-12 h-12 rounded-lg bg-foreground/5 flex items-center justify-center mb-4">
              <Target className="h-6 w-6 text-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-foreground">Our Mission</h3>
            <p className="text-foreground/70 leading-relaxed">
              To make borrowing better than buying, for both your wallet and the planet. We connect communities and reduce waste.
            </p>
          </Card>

          <Card className="p-6 border-2 hover:border-foreground/20 transition-all hover:shadow-lg">
            <div className="w-12 h-12 rounded-lg bg-foreground/5 flex items-center justify-center mb-4">
              <Globe className="h-6 w-6 text-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-foreground">Our Vision</h3>
            <p className="text-foreground/70 leading-relaxed">
              A future where access to goods is simple, sustainable, and community-driven, creating a more resourceful world.
            </p>
          </Card>

          <Card className="p-6 border-2 hover:border-foreground/20 transition-all hover:shadow-lg">
            <div className="w-12 h-12 rounded-lg bg-foreground/5 flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-foreground">Our Community</h3>
            <p className="text-foreground/70 leading-relaxed">
              Built on trust and safety, our platform empowers people to share more and waste less. Your security is our priority.
            </p>
          </Card>
        </div>

        {/* Story Section */}
        <Card className="p-8 md:p-12 mb-16 md:mb-20 border-2">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">Our Story</h2>
          <div className="space-y-4 text-foreground/80 text-base md:text-lg leading-relaxed">
            <p>
              Reloji started with a simple observation: we own too much and use too little. Garages filled with tools used once a year, closets packed with items for one-time occasions. We saw an opportunity to change that.
            </p>
            <p>
              In 2023, a group of friends came together to build a platform that would make it easy and safe to rent items from neighbors. We wanted to create a system where you could get what you need, right when you need it, without the cost and clutter of ownership.
            </p>
            <p>
              Today, Reloji is a growing community of renters and owners who are passionate about sustainability, saving money, and connecting with their local community. We're proud of what we've built, and we're just getting started.
            </p>
          </div>
        </Card>

        {/* Values Section */}
        <div className="mb-16 md:mb-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-center text-foreground">What We Stand For</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-foreground/5 flex items-center justify-center shrink-0">
                <Shield className="h-5 w-5 text-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2 text-foreground">Trust & Safety</h3>
                <p className="text-foreground/70">
                  Every user is verified, and we provide secure payment processing to ensure safe transactions.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-foreground/5 flex items-center justify-center shrink-0">
                <Zap className="h-5 w-5 text-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2 text-foreground">Sustainability</h3>
                <p className="text-foreground/70">
                  By sharing resources, we reduce waste and minimize our environmental impact together.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-foreground/5 flex items-center justify-center shrink-0">
                <Heart className="h-5 w-5 text-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2 text-foreground">Community First</h3>
                <p className="text-foreground/70">
                  We believe in the power of local communities and building meaningful connections.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-foreground/5 flex items-center justify-center shrink-0">
                <Users className="h-5 w-5 text-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2 text-foreground">Accessibility</h3>
                <p className="text-foreground/70">
                  Making quality items accessible to everyone, regardless of budget or location.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <Card className="p-8 md:p-12 border-2 bg-foreground/[0.02]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">10K+</div>
              <div className="text-sm text-foreground/70">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">5K+</div>
              <div className="text-sm text-foreground/70">Items Listed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">50+</div>
              <div className="text-sm text-foreground/70">Cities</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">98%</div>
              <div className="text-sm text-foreground/70">Satisfaction</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
