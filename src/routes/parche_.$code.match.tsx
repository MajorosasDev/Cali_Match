import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { GlowBg } from "@/components/GlowBg";
import { Logo } from "@/components/Logo";
import { getParche, type Parche } from "@/lib/parche-store";

export const Route = createFileRoute("/parche_/$code/match")({
  head: () => ({ meta: [{ title: "Compatibilidad — CaliGuide" }] }),
  component: Match,
});

function Match() {
  const navigate = useNavigate();
  const { code } = Route.useParams();
  const [parche, setParche] = useState<Parche | null>(null);
  const [score, setScore] = useState(0);

  useEffect(() => setParche(getParche()), []);

  useEffect(() => {
    const target = 91;
    let i = 0;
    const id = setInterval(() => {
      i += 2;
      setScore(Math.min(i, target));
      if (i >= target) clearInterval(id);
    }, 25);
    return () => clearInterval(id);
  }, []);

  const cats = [
    { label: "Salsa", value: 95, emoji: "💃" },
    { label: "Rooftop", value: 82, emoji: "🌇" },
    { label: "Brunch", value: 64, emoji: "🥐" },
    { label: "Rumba", value: 78, emoji: "🔥" },
  ];

  const insights = [
    "Su parche ama los rooftops al atardecer 🌇",
    "La salsa está peligrosamente fuerte aquí 💃",
    "Presupuesto compatible: medio premium 💸",
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <GlowBg />
      <header className="px-5 py-5 flex items-center justify-between">
        <Logo size="sm" />
        <Link to="/parche/$code" params={{ code }} className="text-sm text-muted-foreground inline-flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Atrás
        </Link>
      </header>

      <main className="flex-1 px-5 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center">
            <p className="text-xs tracking-[0.2em] text-[var(--sunset)] font-semibold">COMPATIBILIDAD GRUPAL</p>
            <h1 className="mt-2 text-3xl md:text-4xl font-extrabold">
              {parche?.name ?? "Tu parche"} <span className="text-gradient-sunset">tiene química 🔥</span>
            </h1>
          </div>

          {/* Big match */}
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mt-8 grid place-items-center">
            <div className="relative h-56 w-56">
              <div className="absolute inset-0 rounded-full bg-[image:var(--gradient-glow)] blur-3xl opacity-80" />
              <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
                <circle cx="50" cy="50" r="44" fill="none" stroke="oklch(1 0 0 / 0.08)" strokeWidth="8" />
                <motion.circle
                  cx="50" cy="50" r="44" fill="none"
                  stroke="url(#g)" strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={`${(score / 100) * 276} 276`}
                />
                <defs>
                  <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="oklch(0.7 0.21 35)" />
                    <stop offset="100%" stopColor="oklch(0.85 0.17 88)" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 grid place-items-center">
                <div className="text-center">
                  <div className="text-6xl font-extrabold text-gradient-sunset">{score}%</div>
                  <div className="text-xs text-muted-foreground mt-1">match grupal</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Categories */}
          <div className="mt-8 glass rounded-3xl p-5 space-y-4">
            <p className="text-xs tracking-[0.2em] text-[var(--sunset)] font-semibold">CATEGORÍAS FAVORITAS</p>
            {cats.map((c, i) => (
              <div key={c.label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium">{c.emoji} {c.label}</span>
                  <span className="text-muted-foreground">{c.value}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${c.value}%` }}
                    transition={{ delay: 0.2 + i * 0.1, duration: 0.6, ease: "easeOut" }}
                    className="h-full bg-[image:var(--gradient-sunset)]"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Insights */}
          <div className="mt-5 grid gap-2">
            {insights.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="glass rounded-2xl px-4 py-3 text-sm"
              >
                {t}
              </motion.div>
            ))}
          </div>

          <button
            onClick={() => navigate({ to: "/telegram" })}
            className="mt-7 btn-sunset w-full rounded-2xl py-3.5 inline-flex items-center justify-center gap-2"
          >
            <Sparkles className="h-4 w-4" /> Continuar en Telegram <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </main>
    </div>
  );
}
