import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Self-hosted, latin subset (see docs/fonts.md). The files are the exact woff2 bytes Google Fonts served through
// next/font, committed so builds never depend on fonts.googleapis.com. Preloaded, with a size-adjusted fallback so
// the swap does not shift layout (CLS). CSS variable names are the ones Tailwind and components already use.
const inter = localFont({ src: "./fonts/inter-latin-variable.woff2", weight: "100 900", variable: "--font-inter", display: "swap", adjustFontFallback: "Arial" });
const bebas = localFont({ src: "./fonts/bebas-neue-400-latin.woff2", weight: "400", variable: "--font-bebas", display: "swap", adjustFontFallback: "Arial" });
const script = localFont({ src: "./fonts/permanent-marker-latin.woff2", weight: "400", variable: "--font-script", display: "swap", adjustFontFallback: false, fallback: ["cursive"] });
const jetbrains = localFont({ src: "./fonts/jetbrains-mono-latin-variable.woff2", weight: "100 800", variable: "--font-jetbrains", display: "swap", adjustFontFallback: "Arial" });

export const metadata: Metadata = {
  metadataBase: new URL("https://ezeirl.com"),
  title: "EZE IRL | Discipline Creates Freedom",
  description:
    "EZE IRL is a fitness, lifestyle and real-life media brand: training, adventure and the discipline behind it. Home of EZE-FIT, the fitness app in private beta, and EZE // FORM apparel.",
  keywords: [
    "EZE IRL", "EZE", "fitness livestream", "IRL fitness content", "gym challenges",
    "fitness comedy", "real conversations", "Los Angeles fitness creator",
    "EZE Media", "gym challenge stream", "real life content creator",
  ],
  authors: [{ name: "EZE IRL", url: "https://ezeirl.com" }],
  creator: "EZE IRL",
  publisher: "EZE Media",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ezeirl.com",
    siteName: "EZE IRL",
    title: "EZE IRL | Discipline Creates Freedom",
    description:
      "Fitness. Lifestyle. Discipline. EZE IRL follows the training, the wins and the real life behind it.",
  },
  twitter: {
    card: "summary_large_image",
    title: "EZE IRL | Discipline Creates Freedom",
    description: "Fitness. Lifestyle. Discipline. EZE IRL.",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`scroll-smooth ${inter.variable} ${bebas.variable} ${jetbrains.variable} ${script.variable}`}>
      <body className="bg-brand-black text-brand-white antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-brand-red focus:text-brand-black focus:text-sm focus:font-mono focus:tracking-widest"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
