import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://ezeirl.com", lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: "https://ezeirl.com/eze-fit", lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: "https://ezeirl.com/eze-form", lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: "https://ezeirl.com/partnerships", lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: "https://ezeirl.com/content", lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: "https://ezeirl.com/privacy", lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: "https://ezeirl.com/terms", lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: "https://ezeirl.com/sponsorship-disclosure", lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: "https://ezeirl.com/filming-policy", lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: "https://ezeirl.com/accessibility", lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
  ];
}
