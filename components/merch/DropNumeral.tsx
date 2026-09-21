/**
 * Editorial numeral used when no approved campaign image exists. It is type, not a product:
 * nothing here can be mistaken for a garment.
 */
export default function DropNumeral({ size = "clamp(220px, 46vw, 620px)" }: { size?: string }) {
  return (
    <div
      aria-hidden="true"
      className="select-none font-display leading-[0.8] text-transparent"
      style={{ fontSize: size, WebkitTextStroke: "1px rgba(236,230,218,0.28)" }}
    >
      001
    </div>
  );
}
