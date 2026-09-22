import Link from "next/link";
import Image from "next/image";
import { ezeIrlBrand } from "@/config/assets";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-brand-black text-brand-white">
      <header className="border-b border-brand-border/40 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center" aria-label="EZE IRL Home">
            <Image src={ezeIrlBrand.lockup.src} width={ezeIrlBrand.lockup.width} height={ezeIrlBrand.lockup.height} alt="" className="h-7 w-auto" />
          </Link>
          <Link href="/" className="text-brand-muted text-xs font-mono tracking-widest hover:text-brand-white transition-colors uppercase">← Back</Link>
        </div>
      </header>
      <main id="main-content" className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
        {children}
      </main>
      <footer className="border-t border-brand-border/40 px-4 py-6 text-center">
        <p className="text-brand-subtle text-xs font-mono">© {new Date().getFullYear()} EZE Media. <a href="mailto:booking@ezeirl.com" className="underline hover:text-brand-muted">booking@ezeirl.com</a></p>
      </footer>
    </div>
  );
}
