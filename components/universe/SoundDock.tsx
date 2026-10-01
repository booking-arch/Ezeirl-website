"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AMBIENT_AUDIO_SRC, SPOTIFY_URL, spotifyEmbed } from "@/lib/universe/content";
import { prefersReducedMotion } from "@/lib/universe/motion";
import { track } from "@/lib/universe/track";

const PREF_KEY = "eze-sound";
const read = (): boolean => { try { return sessionStorage.getItem(PREF_KEY) === "on"; } catch { return false; } };
const write = (on: boolean) => { try { sessionStorage.setItem(PREF_KEY, on ? "on" : "off"); } catch { /* storage unavailable: preference just is not remembered */ } };

/**
 * Bottom-left dock. "SOUND ON/OFF" toggles an ambient bed ONLY when AMBIENT_AUDIO_SRC is configured; "LISTEN"
 * opens a Spotify panel (iframe is mounted lazily, so no third-party request until the visitor opens it).
 * Audio never starts before a user gesture and never plays under prefers-reduced-motion.
 */
export default function SoundDock() {
  const audio = useRef<HTMLAudioElement | null>(null);
  const [on, setOn] = useState(false);
  const [panel, setPanel] = useState(false);
  const hasAmbient = AMBIENT_AUDIO_SRC !== null;

  const play = useCallback(async () => {
    if (!AMBIENT_AUDIO_SRC || prefersReducedMotion()) return false;
    audio.current ??= Object.assign(new Audio(AMBIENT_AUDIO_SRC), { loop: true, volume: 0.35, preload: "auto" });
    try { await audio.current.play(); return true; } catch { return false; }
  }, []);
  const stop = useCallback(() => { audio.current?.pause(); if (audio.current) audio.current.currentTime = 0; }, []);

  useEffect(() => { if (hasAmbient && read()) setOn(true); }, [hasAmbient]);
  useEffect(() => () => { stop(); audio.current = null; }, [stop]);

  // A remembered "on" preference can only start after the first user gesture (browser autoplay policy).
  useEffect(() => {
    if (!on || !hasAmbient) return;
    const start = () => { void play(); };
    window.addEventListener("pointerdown", start, { once: true });
    window.addEventListener("keydown", start, { once: true });
    return () => { window.removeEventListener("pointerdown", start); window.removeEventListener("keydown", start); };
  }, [on, hasAmbient, play]);

  const toggle = async () => {
    if (on) { setOn(false); write(false); stop(); return; }
    setOn(true); write(true); await play();
  };

  return (
    <div className={`sound-dock ${panel ? "sound-dock--open" : ""} ${on ? "sound-dock--live" : ""}`} role="region" aria-label="Sound dock">
      <div className="sound-dock__chrome">
        {hasAmbient && (
          <button type="button" className="sound-dock__toggle" onClick={toggle} aria-pressed={on} title={on ? "Mute ambient bed" : "Enable ambient bed"}>
            <span className="sound-dock__eq" aria-hidden><i /><i /><i /></span>
            <span className="sound-dock__label">{on ? "SOUND OFF" : "SOUND ON"}</span>
          </button>
        )}
        <button
          type="button"
          className="sound-dock__listen"
          aria-expanded={panel}
          aria-controls="sound-dock-panel"
          onClick={() => { setPanel((p) => { if (!p) track("sound_dock_open", { cta_label: "LISTEN", component: "SoundDock" }); return !p; }); }}
        >
          LISTEN
        </button>
      </div>
      <div id="sound-dock-panel" className="sound-dock__panel" hidden={!panel}>
        <div className="sound-dock__panel-head">
          <p className="sound-dock__artist">EZEKIEL CRUZ</p>
          <a href={SPOTIFY_URL} target="_blank" rel="noopener noreferrer" className="sound-dock__open" onClick={() => track("outbound_click", { cta_label: "Open in Spotify", component: "SoundDock", platform: "spotify", link_url: SPOTIFY_URL })}>
            Open in Spotify →
          </a>
        </div>
        {panel && (
          <iframe title="Ezekiel Cruz on Spotify" src={spotifyEmbed(0)} width="100%" height="152" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" className="sound-dock__iframe" />
        )}
      </div>
    </div>
  );
}
