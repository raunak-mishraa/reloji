import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://reloji.com';
 
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    '/',
    '/circles',
    '/dashboard',
    '/incoming-requests',
    '/listings',
    '/messages',
    '/my-listings',
    '/my-requests',
    '/profile',
    '/reset-password',
    '/search',
    '/forgot-password',
    '/signin',
    '/signup',
    '/admin',
    '/listings/new',
    '/circles/new',
  ];

  const staticUrls = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));

  const listings = await prisma.listing.findMany({
    where: {
      status: { in: ['APPROVED', 'ACTIVE'] },
      deletedAt: null,
    },
    select: {
      slug: true,
      updatedAt: true,
    },
  });

  const listingUrls = listings.map((listing) => ({
    url: `${baseUrl}/listings/${listing.slug}`,
    lastModified: listing.updatedAt,
  }));

  const circles = await prisma.circle.findMany({
    where: {
      privacy: 'PUBLIC',
    },
    select: {
      slug: true,
      updatedAt: true,
    },
  });

  const circleUrls = circles.map((circle) => ({
    url: `${baseUrl}/circles/${circle.slug}`,
    lastModified: circle.updatedAt,
  }));
 
  return [
    ...staticUrls,
    ...listingUrls,
    ...circleUrls,
  ];
}
