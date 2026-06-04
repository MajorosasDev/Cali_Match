import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, MapPin, Sparkles } from "lucide-react";
import { GlowBg } from "@/components/GlowBg";
import { Logo } from "@/components/Logo";
import { getParche, saveParche, type Parche } from "@/lib/parche-store";
import { finalizeGroupInSupabase } from "@/lib/supabase";

export const Route = createFileRoute("/parche_/$code/match")({
  head: () => ({ meta: [{ title: "Recomendación — CaliGuide" }] }),
  component: Match,
});

function Match() {
  const navigate = useNavigate();
  const { code } = Route.useParams();
  const [parche, setParche] = useState<Parche | null>(null);
  const [score, setScore] = useState(0);

  // Finalize on mount if not already done
  useEffect(() => {
    const p = getParche(code);
    setParche(p);

    if (p && (p.status ?? "active") !== "finalizado") {
      const updated: Parche = { ...p, status: "finalizado", finalizedAt: new Date().toISOString() };
      saveParche(updated);
      setParche(updated);
      finalizeGroupInSupabase(code).catch((err) =>
        console.error("[match] No se pudo finalizar en Supabase:", err),
      );
    }
  }, [code]);

  // Animate score counter toward backend score or computed fallback
  const targetScore = parche?.recommendation?.score ?? computeFallbackScore(parche);
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i += 2;
      setScore(Math.min(i, targetScore));
      if (i >= targetScore) clearInterval(id);
    }, 25);
    return () => clearInterval(id);
  }, [targetScore]);

  // ── Data: prefer backend result, fall back to local quiz computation ─────────
  const rec = parche?.recommendation;
  const hasBackend = !!(rec?.top_lugares && rec.top_lugares.length > 0);

  // Backend: top lugares
  const backendLugares = (rec?.top_lugares ?? []) as Array<Record<string, unknown>>;

  // Fallback: compute categories from local quiz answers
  const memberAnswers = parche?.memberAnswers ?? {};
  const allAnswers = Object.values(memberAnswers);
  const total = allAnswers.length || 1;

  const actCounts: Record<string, number> = {};
  allAnswers.forEach((a) => {
    (a?.actividades ?? []).forEach((act) => {
      actCounts[act] = (actCounts[act] ?? 0) + 1;
    });
  });
  const actLabels: Record<string, { label: string; emoji: string }> = {
    comer: { label: "Comer rico", emoji: "🍴" },
    lugares_bonitos: { label: "Lugares bonitos", emoji: "📸" },
    cultural: { label: "Cultural", emoji: "🎨" },
    relajarse: { label: "Relajarse", emoji: "🌿" },
    explorar_ciudad: { label: "Explorar ciudad", emoji: "🏛️" },
    hablar_tiempo: { label: "Pasar tiempo juntos", emoji: "☕" },
    lugares_nuevos: { label: "Descubrir lugares", emoji: "🚶" },
    mercados: { label: "Mercados / tiendas", emoji: "🛍️" },
  };
  const localCats = Object.entries(actCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4)
    .map(([id, count]) => ({
      label: actLabels[id]?.label ?? id,
      emoji: actLabels[id]?.emoji ?? "✨",
      value: Math.round((count / total) * 100),
    }));
  const fallbackCats = localCats.length > 0 ? localCats : [
    { label: "Comer rico", value: 90, emoji: "🍴" },
    { label: "Lugares bonitos", value: 80, emoji: "📸" },
    { label: "Cultural", value: 70, emoji: "🎨" },
    { label: "Relajarse", value: 65, emoji: "🌿" },
  ];

  // Display categories
  const displayCats = hasBackend
    ? backendLugares.slice(0, 4).map((l) => ({
        label: String(l.nombre ?? ""),
        emoji: String(l.emoji ?? "✨"),
        value: Number(l.match_pct ?? 0),
      }))
    : fallbackCats;

  // Insights
  const backendInsights = rec?.insights ?? [];
  const vibeCounts: Record<string, number> = {};
  allAnswers.forEach((a) => { if (a?.vibe) vibeCounts[a.vibe] = (vibeCounts[a.vibe] ?? 0) + 1; });
  const topVibe = Object.entries(vibeCounts).sort(([, a], [, b]) => b - a)[0]?.[0];
  const vibeLabel: Record<string, string> = {
    sunset_urbano: "vibe de sunset urbano 🌇", cafe_acogedor: "café acogedor ☕",
    arte_cultura: "arte y cultura 🎨", naturaleza: "naturaleza relajante 🌿",
    foodie: "experiencia foodie 🍽️", hidden_gems: "hidden gems 📸",
  };
  const localInsights = [
    fallbackCats[0] ? `${fallbackCats[0].emoji} Al parche le gana ${fallbackCats[0].label}` : "El parche está listo para explorar Cali 🔥",
    topVibe ? `El grupo quiere un plan con ${vibeLabel[topVibe] ?? topVibe}` : "La vibra del parche es única 💫",
    "Recomendación generada a partir de las respuestas del grupo 🎯",
  ];
  const insights = backendInsights.length > 0 ? backendInsights : localInsights;

  return (
    <div className="min-h-screen flex flex-col">
      <GlowBg />
      <header className="px-5 py-5 flex items-center justify-between">
        <Logo size="sm" />
        <Link to="/parche/$code" params={{ code }} className="text-sm text-muted-foreground inline-flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Parche
        </Link>
      </header>

      <main className="flex-1 px-5 py-6 pb-10">
        <div className="max-w-2xl mx-auto">

          {/* Header */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 text-xs mb-3">
              ✓ Parche finalizado
            </div>
            <p className="text-xs tracking-[0.2em] text-[var(--sunset)] font-semibold">
              {hasBackend ? "RECOMENDACIÓN PERSONALIZADA" : "COMPATIBILIDAD GRUPAL"}
            </p>
            <h1 className="mt-2 text-3xl md:text-4xl font-extrabold">
              {parche?.name ?? "Tu parche"} <span className="text-gradient-sunset">tiene química 🔥</span>
            </h1>
            {rec?.explicacion && (
              <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">{rec.explicacion}</p>
            )}
          </div>

          {/* Score ring */}
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

          {/* Top lugares from backend OR preference bars */}
          {hasBackend ? (
            <div className="mt-8 space-y-3">
              <p className="text-xs tracking-[0.2em] text-[var(--sunset)] font-semibold">LUGARES RECOMENDADOS</p>
              {backendLugares.slice(0, 4).map((l, i) => (
                <motion.div
                  key={String(l.id ?? i)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  className="glass rounded-2xl p-4 flex items-start gap-4"
                >
                  <div className="h-12 w-12 rounded-xl bg-[image:var(--gradient-sunset)] grid place-items-center text-2xl shrink-0">
                    {String(l.emoji ?? "✨")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold truncate">{String(l.nombre ?? "")}</span>
                      <span className="text-xs font-bold text-[var(--sunset)] shrink-0">{Number(l.match_pct ?? 0)}%</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span>{String(l.barrio ?? "")} · {String(l.zona ?? "")}</span>
                    </div>
                    {l.explicacion ? (
                      <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{String(l.explicacion)}</p>
                    ) : null}
                    <div className="mt-2 h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${l.match_pct ?? 0}%` }}
                        transition={{ delay: 0.3 + i * 0.08, duration: 0.5 }}
                        className="h-full bg-[image:var(--gradient-sunset)]"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="mt-8 glass rounded-3xl p-5 space-y-4">
              <p className="text-xs tracking-[0.2em] text-[var(--sunset)] font-semibold">PREFERENCIAS DEL PARCHE</p>
              {displayCats.map((c, i) => (
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
          )}

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
            onClick={() => void navigate({ to: "/telegram", search: { group_id: code } })}
            className="mt-7 btn-sunset w-full rounded-2xl py-3.5 inline-flex items-center justify-center gap-2"
          >
            <Sparkles className="h-4 w-4" /> Continuar en Telegram <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </main>
    </div>
  );
}

function computeFallbackScore(parche: Parche | null): number {
  const answers = Object.values(parche?.memberAnswers ?? {});
  if (answers.length === 0) return 72;
  return Math.min(72 + answers.length * 4, 94);
}
