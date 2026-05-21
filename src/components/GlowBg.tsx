export function GlowBg() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-32 -left-20 h-[420px] w-[420px] rounded-full bg-[var(--purple-glow)] opacity-30 blur-[120px]" />
      <div className="absolute top-1/3 -right-20 h-[480px] w-[480px] rounded-full bg-[var(--sunset)] opacity-25 blur-[140px]" />
      <div className="absolute bottom-0 left-1/3 h-[380px] w-[380px] rounded-full bg-[var(--pink-glow)] opacity-20 blur-[140px]" />
    </div>
  );
}
