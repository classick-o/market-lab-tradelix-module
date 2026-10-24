/** The few icons the presentation pages need, drawn like the module's set: 24px grid, 1.5 stroke. */
const PATHS: Record<string, string> = {
  "arrow-right": "M5 12h14M13 6l6 6-6 6",
  "arrow-up-right": "M7 17L17 7M9 7h8v8",
  "arrow-down": "M12 5v14M6 13l6 6 6-6",
  "chevron-left": "M15 6l-6 6 6 6",
  "chevron-right": "M9 6l6 6-6 6",
  menu: "M4 8h16M4 16h16",
  x: "M6.5 6.5l11 11M17.5 6.5l-11 11",
  check: "M5 12.5l4.5 4.5L19 7.5",
  minus: "M6 12h12",
  plus: "M12 5v14M5 12h14",
  replay: "M4.5 12a7.5 7.5 0 107.5-7.5 7.4 7.4 0 00-5.3 2.2L4.5 9M4.5 4.5V9H9",
  lock: "M7.5 10.5V8a4.5 4.5 0 019 0v2.5M5.5 10.5h13v9.5h-13z",
  flame: "M12 21c3.5 0 6-2.4 6-5.8 0-3.7-2.8-5.6-3.8-8.7-.4 1.9-1.4 3-2.7 3.6.3-2.5-.6-5.3-3-6.6.2 2.9-1.4 4.6-2.7 6.2C4.6 11.2 6 14 6 15.2 6 18.6 8.5 21 12 21z",
  shield: "M12 3.5l7 2.5v5.5c0 4.5-3 7.6-7 9-4-1.4-7-4.5-7-9V6zM9 12l2 2 4-4",
  bolt: "M13 3L5 13.5h6L10 21l8-10.5h-6z",
  eye: "M2.5 12s3.5-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.5 6.5-9.5 6.5S2.5 12 2.5 12zM12 9.5a2.5 2.5 0 110 5 2.5 2.5 0 010-5z",
};

export function Icon({ name, size = 18, className }: { name: string; size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={className} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d={PATHS[name] ?? ""} />
    </svg>
  );
}
