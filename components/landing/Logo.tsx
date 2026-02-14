import Link from "next/link";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className = "", showText = true }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`}>
      <svg
        width="36"
        height="36"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
        aria-hidden
      >
        {/* Tulip bloom - elegant cup shape */}
        <path
          d="M20 6c-3 5-5 10-5 14 0 5 2 8 5 8s5-3 5-8c0-4-2-9-5-14z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary"
        />
        <path d="M20 28v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-foreground/80" />
        <path d="M12 28c4 0 6 4 8 4s4-4 8-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" className="text-foreground/60" />
      </svg>
      {showText && (
        <span className="flex flex-col leading-tight">
          <span className="text-base font-semibold tracking-tight text-foreground">
            TULIP
          </span>
          <span className="text-xs font-medium uppercase tracking-widest text-primary">
            Garden
          </span>
        </span>
      )}
    </Link>
  );
}
