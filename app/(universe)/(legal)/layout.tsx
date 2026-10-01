export default function LegalLayout({ children }: { children: React.ReactNode }) {
  // Nav, footer and <main id="main-content"> come from the (universe) shell.
  return <div className="mx-auto max-w-4xl px-4 pb-16 pt-28 sm:pb-20 sm:pt-32">{children}</div>;
}
