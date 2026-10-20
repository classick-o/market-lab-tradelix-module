import { useEffect, useRef, useState } from "react";
import { Button, IconButton, Kbd, Segmented } from "./ui";

export const SPEEDS = [
  { value: "3", label: "1×" },
  { value: "6", label: "2×" },
  { value: "12", label: "4×" },
];

/** Moves a displayed step toward `target`, one candle per tick, while playing. */
export function usePlayback(target: number, initial: number, speed: number) {
  const [display, setDisplay] = useState(initial);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (display > target) setDisplay(target);
  }, [display, target]);

  useEffect(() => {
    if (!playing) return;
    if (display >= target) {
      setPlaying(false);
      return;
    }
    const t = window.setTimeout(() => setDisplay((d) => Math.min(target, d + 1)), 1000 / speed);
    return () => window.clearTimeout(t);
  }, [playing, display, target, speed]);

  return {
    display,
    playing,
    play: () => setPlaying(true),
    pause: () => setPlaying(false),
    step: () => setDisplay((d) => Math.min(target, d + 1)),
    skip: () => {
      setDisplay(target);
      setPlaying(false);
    },
  };
}

/** Space toggles playback and → advances one candle, unless focus is in a control that uses those keys. */
export function usePlaybackKeys(enabled: boolean, actions: { toggle: () => void; step: () => void }) {
  const ref = useRef(actions);
  ref.current = actions;
  useEffect(() => {
    if (!enabled) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.defaultPrevented) return;
      const t = e.target as HTMLElement | null;
      if (t?.closest("input, textarea, select, button, a, label, [role=radio], [role=tab], [contenteditable], dialog[open], svg")) return;
      if (e.key === " ") {
        e.preventDefault();
        ref.current.toggle();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        ref.current.step();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [enabled]);
}

export function PlaybackControls({
  playing,
  onPlay,
  onPause,
  onStep,
  onSkip,
  skipLabel = "Skip ahead",
  speed,
  onSpeed,
  canAdvance,
  progress,
}: {
  playing: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStep: () => void;
  onSkip?: () => void;
  skipLabel?: string;
  speed: number;
  onSpeed: (s: number) => void;
  canAdvance: boolean;
  progress?: number;
}) {
  return (
    <div className="ml-playback">
      <div className="ml-playback-buttons">
        {playing ? (
          <IconButton icon="pause" label="Pause" variant="secondary" onClick={onPause} />
        ) : (
          <IconButton icon="play" label="Play" variant="secondary" onClick={onPlay} disabled={!canAdvance} />
        )}
        <IconButton icon="next" label="Next candle" onClick={onStep} disabled={!canAdvance || playing} />
        {onSkip && (
          <Button size="sm" variant="tertiary" onClick={onSkip} disabled={!canAdvance}>
            {skipLabel}
          </Button>
        )}
      </div>
      {progress !== undefined && (
        <div className="ml-playback-track" aria-hidden="true">
          <div style={{ transform: `scaleX(${Math.max(0, Math.min(1, progress))})` }} />
        </div>
      )}
      <Segmented label="Playback speed" size="sm" value={String(speed)} onChange={(v) => onSpeed(Number(v))} options={SPEEDS} />
      <span className="ml-shortcuts" aria-hidden="true">
        <Kbd>Space</Kbd> play · <Kbd>→</Kbd> step
      </span>
    </div>
  );
}
