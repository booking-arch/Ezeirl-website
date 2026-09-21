import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/ecosystem/Reveal";
import Photo from "@/components/irl/Photo";
import DropNumeral from "@/components/merch/DropNumeral";
import { ezeFitAssets, ezeIrlPhotos } from "@/config/assets";

type Tile = { id: string; label: string; line: string; href: string; visual: React.ReactNode };

const sizes = "(min-width: 1024px) 20vw, 62vw";

/** Six-tile category strip from the approved concept, minus a Nutrition tile (no honest imagery for it yet). */
export default function TileStrip() {
  const screen = ezeFitAssets.screens.track;
  const tiles: Tile[] = [
    { id: "fitness", label: "FITNESS", line: "GET STRONGER", href: "#irl", visual: <Photo asset={ezeIrlPhotos.curlRoar} sizes={sizes} /> },
    { id: "lifestyle", label: "LIFESTYLE", line: "LIVE BIGGER", href: "#lifestyle", visual: <Photo asset={ezeIrlPhotos.sunset} sizes={sizes} ungraded /> },
    {
      id: "eze-fit",
      label: "EZE-FIT",
      line: "IN PRIVATE BETA",
      href: "/eze-fit",
      visual: screen ? (
        <div className="absolute inset-0 bg-fit-ink pt-6">
          <Image src={screen.src} width={screen.width} height={screen.height} alt="" aria-hidden="true" sizes={sizes} className="mx-auto h-full w-[78%] rounded-t-2xl object-cover object-top opacity-90" />
        </div>
      ) : null,
    },
    {
      id: "eze-form",
      label: "EZE // FORM",
      line: "DROP 001 · COMING SOON",
      href: "/merch",
      visual: (
        <div className="absolute inset-0 grid place-items-center bg-form-ink">
          <DropNumeral size="clamp(120px, 15vw, 210px)" />
        </div>
      ),
    },
    { id: "content", label: "CONTENT", line: "REAL LIFE. NO FILTER.", href: "#watch", visual: <Photo asset={ezeIrlPhotos.dumbbellRow} sizes={sizes} /> },
  ];

  return (
    <section aria-label="Explore EZE" className="bg-brand-black pb-6">
      <ul
        className="flex snap-x snap-mandatory gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:px-8 lg:grid lg:grid-cols-5 lg:overflow-visible [&::-webkit-scrollbar]:hidden"
        tabIndex={0}
        aria-label="Categories"
      >
        {tiles.map((t, i) => (
          <Reveal as="li" key={t.id} delay={i * 70} className="w-[62vw] shrink-0 snap-start sm:w-[38vw] lg:w-auto">
            <Link href={t.href} className="group relative block aspect-[3/4] overflow-hidden bg-brand-graphite">
              <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.05]">{t.visual}</div>
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-brand-black/90 via-brand-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="font-display text-2xl tracking-[0.08em] text-brand-white">{t.label}</p>
                <p className="mt-1 flex items-center justify-between font-mono text-[10px] tracking-[0.25em] text-brand-white/80">
                  {t.line}
                  <span aria-hidden="true" className="text-brand-red transition-transform duration-300 group-hover:translate-x-1">→</span>
                </p>
              </div>
            </Link>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
