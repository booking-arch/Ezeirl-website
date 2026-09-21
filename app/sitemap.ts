import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://www.ezeirl.com", lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: "https://www.ezeirl.com/eze-fit", lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: "https://www.ezeirl.com/merch", lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: "https://www.ezeirl.com/privacy", lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: "https://www.ezeirl.com/terms", lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: "https://www.ezeirl.com/sponsorship-disclosure", lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: "https://www.ezeirl.com/filming-policy", lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: "https://www.ezeirl.com/accessibility", lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
  ];
}
