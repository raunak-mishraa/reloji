import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*', // Allow all crawlers
        allow: '/', // Permit crawling of all pages
        disallow: [
          '/api/', // Block API routes
          '/admin/', // Block admin pages
        ],
      },
    ],
    sitemap: 'https://reloji.vercel.app/sitemap.xml', // Reference the sitemap
  };
}