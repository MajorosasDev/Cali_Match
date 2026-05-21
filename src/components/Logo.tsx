import { Link } from "@tanstack/react-router";

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const dot = size === "lg" ? "h-9 w-9" : size === "sm" ? "h-6 w-6" : "h-7 w-7";
  const text = size === "lg" ? "text-2xl" : size === "sm" ? "text-base" : "text-lg";
  return (
    <Link to="/" className="inline-flex items-center gap-2 group">
      <span
        className={`${dot} rounded-full grid place-items-center bg-[image:var(--gradient-sunset)] glow-orange`}
      >
        <span className="text-[10px] font-black text-[oklch(0.16_0.02_280)]">C</span>
      </span>
      <span className={`${text} font-bold tracking-tight`}>
        Cali<span className="text-gradient-sunset">Guide</span>
      </span>
    </Link>
  );
}
