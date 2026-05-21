import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { GlowBg } from "@/components/GlowBg";
import { Logo } from "@/components/Logo";
import { getParche, saveParche, type AdminQuiz, type Parche } from "@/lib/parche-store";

export const Route = createFileRoute("/parche_/$code/quiz")({
  head: () => ({ meta: [{ title: "Tu quiz — CaliGuide" }] }),
  component: AdminQuizPage,
});

const dias = [
  { id: "lun", label: "Lun" },
  { id: "mar", label: "Mar" },
  { id: "mie", label: "Mié" },
  { id: "jue", label: "Jue" },
  { id: "vie", label: "Vie" },
  { id: "sab", label: "Sáb" },
  { id: "dom", label: "Dom" },
];

const lugares = [
  { id: "rooftop", label: "Rooftop", emoji: "🌇" },
  { id: "salsa", label: "Salsa", emoji: "💃" },
  { id: "brunch", label: "Brunch", emoji: "🥐" },
  { id: "rumba", label: "Rumba", emoji: "🔥" },
  { id: "cafe", label: "Café", emoji: "☕" },
  { id: "cultura", label: "Cultura", emoji: "🎨" },
  { id: "gastro", label: "Gastro", emoji: "🍽️" },
  { id: "playa", label: "Naturaleza", emoji: "🌴" },
];

const moods = [
  { id: "chill", label: "Chill", emoji: "😌" },
  { id: "social", label: "Social", emoji: "🤝" },
  { id: "fiesta", label: "Fiesta", emoji: "🥳" },
  { id: "romantico", label: "Romántico", emoji: "🌹" },
  { id: "aventura", label: "Aventura", emoji: "🚀" },
  { id: "creativo", label: "Creativo", emoji: "🎨" },
];

const franjas = [
  { id: "dia", label: "Día", emoji: "☀️", time: "9am - 2pm" },
  { id: "tarde", label: "Tarde", emoji: "🌤️", time: "3pm - 7pm" },
  { id: "noche", label: "Noche", emoji: "🌙", time: "8pm - late" },
] as const;

function AdminQuizPage() {
  const navigate = useNavigate();
  const { code } = Route.useParams();
  const [parche, setParche] = useState<Parche | null>(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<AdminQuiz>({ disponibilidad: [], lugares: [] });

  useEffect(() => {
    const p = getParche(code);
    setParche(p);
    if (p?.adminQuiz) setAnswers(p.adminQuiz);
  }, [code]);

  const totalSteps = 4;
  const progress = ((step + 1) / totalSteps) * 100;

  const toggle = (key: "disponibilidad" | "lugares", id: string) => {
    setAnswers((a) => {
      const cur = a[key] ?? [];
      return { ...a, [key]: cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id] };
    });
  };

  const canAdvance =
    (step === 0 && (answers.disponibilidad?.length ?? 0) > 0) ||
    (step === 1 && (answers.lugares?.length ?? 0) > 0) ||
    (step === 2 && !!answers.mood) ||
    (step === 3 && !!answers.franja);

  const next = () => {
    if (step < totalSteps - 1) return setStep(step + 1);
    if (!parche) return;
    saveParche({ ...parche, adminAnswered: true, adminQuiz: answers });
    navigate({ to: "/parche/$code", params: { code } });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <GlowBg />
      <header className="px-5 py-5 flex items-center justify-between">
        <Logo size="sm" />
        <Link to="/parche/crear" className="text-xs text-muted-foreground hover:text-foreground">Salir</Link>
      </header>

      <div className="px-5">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span>Tu quiz · {step + 1} de {totalSteps}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
            <motion.div className="h-full bg-[image:var(--gradient-sunset)]" animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
          </div>
        </div>
      </div>

      <main className="flex-1 px-5 py-8">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              {step === 0 && (
                <Section title="¿Qué días tienes disponibles?" subtitle="Selecciona uno o varios.">
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 mt-6">
                    {dias.map((d) => {
                      const active = answers.disponibilidad?.includes(d.id);
                      return (
                        <button
                          key={d.id}
                          onClick={() => toggle("disponibilidad", d.id)}
                          className={`glass rounded-2xl py-4 font-bold text-sm transition ${active ? "ring-2 ring-[var(--sunset)] glow-orange" : "hover:bg-white/5"}`}
                        >
                          {d.label}
                        </button>
                      );
                    })}
                  </div>
                </Section>
              )}

              {step === 1 && (
                <Section title="¿Qué lugares te interesan hoy?" subtitle="Elige todos los que te llamen.">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                    {lugares.map((l) => {
                      const active = answers.lugares?.includes(l.id);
                      return (
                        <motion.button
                          key={l.id}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => toggle("lugares", l.id)}
                          className={`relative glass rounded-2xl p-5 text-center transition ${active ? "ring-2 ring-[var(--sunset)] glow-orange" : "hover:bg-white/5"}`}
                        >
                          <div className="text-3xl">{l.emoji}</div>
                          <div className="mt-2 text-xs font-semibold">{l.label}</div>
                          {active && (
                            <span className="absolute top-2 right-2 h-5 w-5 grid place-items-center rounded-full bg-[image:var(--gradient-sunset)]">
                              <Check className="h-3 w-3 text-black" />
                            </span>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </Section>
              )}

              {step === 2 && (
                <Section title="¿Cuál es tu mood de hoy?" subtitle="El vibe que tienes ahora mismo.">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
                    {moods.map((m) => {
                      const active = answers.mood === m.id;
                      return (
                        <motion.button
                          key={m.id}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setAnswers((a) => ({ ...a, mood: m.id }))}
                          className={`glass rounded-2xl p-5 text-center transition ${active ? "ring-2 ring-[var(--sunset)] glow-orange" : "hover:bg-white/5"}`}
                        >
                          <div className="text-3xl">{m.emoji}</div>
                          <div className="mt-2 text-sm font-semibold">{m.label}</div>
                        </motion.button>
                      );
                    })}
                  </div>
                </Section>
              )}

              {step === 3 && (
                <Section title="¿Día, tarde o noche?" subtitle="Define la franja del plan.">
                  <div className="grid grid-cols-3 gap-3 mt-6">
                    {franjas.map((f) => {
                      const active = answers.franja === f.id;
                      return (
                        <motion.button
                          key={f.id}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setAnswers((a) => ({ ...a, franja: f.id }))}
                          className={`glass rounded-2xl p-5 text-center transition ${active ? "ring-2 ring-[var(--sunset)] glow-orange" : "hover:bg-white/5"}`}
                        >
                          <div className="text-4xl">{f.emoji}</div>
                          <div className="mt-2 font-bold">{f.label}</div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">{f.time}</div>
                        </motion.button>
                      );
                    })}
                  </div>
                </Section>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-between gap-3">
            <button
              onClick={() => step > 0 && setStep(step - 1)}
              disabled={step === 0}
              className="rounded-full glass px-5 py-3 text-sm inline-flex items-center gap-2 disabled:opacity-40"
            >
              <ArrowLeft className="h-4 w-4" /> Atrás
            </button>
            <button
              onClick={next}
              disabled={!canAdvance}
              className="btn-sunset rounded-full px-6 py-3 inline-flex items-center gap-2 disabled:opacity-40"
            >
              {step === totalSteps - 1 ? "Listo, ver parche" : "Siguiente"} <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div>
      <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">{title}</h1>
      {subtitle && <p className="mt-2 text-muted-foreground text-sm">{subtitle}</p>}
      {children}
    </div>
  );
}
