"use client";

/**
 * Catches a crash in the root layout itself (fonts, providers, etc.) — the one case app/error.tsx
 * cannot catch, since that boundary lives inside the layout it would need to render around. Must
 * render its own <html>/<body>; kept intentionally minimal (no external font, no client-only
 * providers) so it cannot itself fail. Same rule as app/error.tsx: nothing about the underlying
 * error is ever shown to the visitor.
 */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#0a0a0a", color: "#f5f5f5", fontFamily: "system-ui, sans-serif", display: "flex", minHeight: "100vh", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "1.5rem" }}>
        <p style={{ fontSize: "0.75rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#ff5c5c", marginBottom: "1rem" }}>EZE IRL</p>
        <h1 style={{ fontSize: "2rem", fontWeight: 900, margin: "0 0 1rem" }}>Something went wrong.</h1>
        <p style={{ maxWidth: 28 + "rem", color: "#888", marginBottom: "2rem", lineHeight: 1.6 }}>
          Please try again, or email{" "}
          <a href="mailto:booking@ezeirl.com" style={{ color: "#f5f5f5" }}>
            booking@ezeirl.com
          </a>
          .
        </p>
        <button
          type="button"
          onClick={() => reset()}
          style={{ background: "#cc0000", color: "#0a0a0a", border: "none", padding: "1rem 2rem", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer" }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
