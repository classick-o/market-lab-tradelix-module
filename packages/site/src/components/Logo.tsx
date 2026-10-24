import { useId } from "react";

/** The Tradelix mark: a T whose stem is a candle. Working name and mark until the brand is final. */
export function LogoMark({ size = 26 }: { size?: number }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true" className="tx-mark">
      <defs>
        <linearGradient id={`${id}-g`} x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#55a8ff" />
        </linearGradient>
      </defs>
      <rect x="0.75" y="0.75" width="30.5" height="30.5" rx="9" stroke="rgba(255,255,255,0.14)" strokeWidth="1.5" />
      <path d="M7.5 9.5h17" stroke={`url(#${id}-g)`} strokeWidth="2.6" strokeLinecap="round" />
      <path d="M16 9.5v3M16 22v4" stroke={`url(#${id}-g)`} strokeWidth="1.8" strokeLinecap="round" />
      <rect x="12.9" y="12.5" width="6.2" height="9.5" rx="1.6" fill={`url(#${id}-g)`} />
    </svg>
  );
}

export function Logo() {
  return (
    <span className="tx-logo">
      <LogoMark />
      <span className="tx-logo-word">Tradelix</span>
    </span>
  );
}
