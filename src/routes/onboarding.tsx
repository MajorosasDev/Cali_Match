import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { GlowBg } from "@/components/GlowBg";
import { Logo } from "@/components/Logo";
import {
  saveOnboarding,
  getSessionId,
  type OnboardingAnswers,
  type Horario,
  type Distancia,
} from "@/lib/parche-store";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "Tu vibra — CaliGuide" }] }),
  component: Onboarding,
});

const ambientes: { id: string; label: string; emoji: string }[] = [
  { id: "elegante", label: "Elegante", emoji: "🥂" },
  { id: "casual", label: "Casual", emoji: "👕" },
  { id: "alternativo", label: "Alternativo", emoji: "🎸" },
  { id: "tropical", label: "Tropical", emoji: "🌴" },
  { id: "romantico", label: "Romántico", emoji: "🌹" },
  { id: "fiesta", label: "Fiesta", emoji: "🎉" },
];

const experienciaOpts = [
  { id: "cafes", label: "Cafés bonitos", emoji: "☕" },
  { id: "cultura", label: "Lugares culturales", emoji: "🎨" },
  { id: "museos", label: "Museos o historia", emoji: "🏛️" },
  { id: "naturaleza", label: "Naturaleza y miradores", emoji: "🌿" },
  { id: "gastro", label: "Gastronomía local", emoji: "🍽️" },
  { id: "insta", label: "Instagrameables", emoji: "📸" },
  { id: "mercados", label: "Mercados y tiendas", emoji: "🛍️" },
  { id: "eventos", label: "Eventos culturales", emoji: "🎭" },
  { id: "barrios", label: "Caminar barrios", emoji: "🚶" },
  { id: "musica", label: "Música", emoji: "🎵" },
];

function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<OnboardingAnswers>({});
  const [loading, setLoading] = useState(false);

  const totalSteps = 5;
  const progress = ((step + 1) / totalSteps) * 100;

  const next = () => {
    if (step < totalSteps - 1) setStep(step + 1);
    else finish();
  };
  const prev = () => step > 0 && setStep(step - 1);

  const finish = async () => {
    saveOnboarding(answers); // respaldo local
    setLoading(true);

    // Guardar onboarding en Supabase usando el id UUID de sesión
    const userId = getSessionId();
    if (userId) {
      const payload = {
        experiencias: answers.experiencias,
        budget: answers.budget,
        distancia: answers.distancia,
        ambiente: answers.ambiente,
        horario: answers.horario,
      };

      console.log("PAYLOAD:", payload);
      console.log("USER ID:", userId);

      const { data, error } = await supabase
        .from("usuarios")
        .update(payload)
        .eq("id", userId)
        .select();

      console.log("UPDATED:", data);
      console.log("ERROR:", error);

      if (error) {
        console.error("[Onboarding] Error guardando en Supabase:", error);
      } else {
        console.log("[Onboarding] Guardado exitoso para userId:", userId);
      }
    } else {
      console.warn("[Onboarding] No hay userId en sesión — onboarding solo guardado local");
    }

    setTimeout(() => navigate({ to: "/bienvenida" }), 2200);
  };

  const update = <K extends keyof OnboardingAnswers>(k: K, v: OnboardingAnswers[K]) =>
    setAnswers((a) => ({ ...a, [k]: v }));

  if (loading) return <LoadingFinal />;

  const canAdvance =
    (step === 0 && (answers.experiencias?.length ?? 0) > 0) ||
    (step === 1 && answers.budget != null) ||
    (step === 2 && answers.distancia) ||
    (step === 3 && (answers.ambiente?.length ?? 0) > 0) ||
    (step === 4 && answers.horario);

  return (
    <div className="min-h-screen flex flex-col">
      <GlowBg />
      <header className="px-5 py-5 flex items-center justify-between">
        <Logo size="sm" />
        <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">
          Salir
        </Link>
      </header>

      {/* Progress */}
      <div className="px-5">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span>
              Pregunta {step + 1} de {totalSteps}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              className="h-full bg-[image:var(--gradient-sunset)]"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      <main className="flex-1 px-5 py-8">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {step === 0 && (
                <StepShell
                  title="¿Qué tipo de experiencias disfrutas más?"
                  subtitle="Elige todas las que quieras."
                >
                  <div className="grid grid-cols-2 gap-2 mt-6">
                    {experienciaOpts.map((o) => {
                      const selected = answers.experiencias?.includes(o.id) ?? false;
                      const toggle = () => {
                        const current = answers.experiencias ?? [];
                        update(
                          "experiencias",
                          selected ? current.filter((x) => x !== o.id) : [...current, o.id],
                        );
                      };
                      return (
                        <motion.button
                          key={o.id}
                          whileTap={{ scale: 0.96 }}
                          onClick={toggle}
                          className={`glass rounded-xl px-4 py-3 flex items-center gap-3 text-left transition ${
                            selected
                              ? "ring-2 ring-[var(--sunset)] glow-orange bg-white/5"
                              : "hover:bg-white/5"
                          }`}
                        >
                          <span className="text-xl">{o.emoji}</span>
                          <span className="text-sm font-medium leading-tight">{o.label}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </StepShell>
              )}

              {step === 1 && (
                <StepShell
                  title="¿Cuál es tu presupuesto aproximado para salir?"
                  subtitle="Elige el rango que mejor te describe."
                >
                  <div className="grid gap-3 mt-6">
                    {(
                      [
                        { id: "bajo", label: "Menos de $30.000", emoji: "💸" },
                        { id: "medio", label: "$30.000 – $70.000", emoji: "💵" },
                        { id: "alto", label: "$70.000 – $150.000", emoji: "💰" },
                        { id: "premium", label: "Más de $150.000", emoji: "✨" },
                      ] as { id: string; label: string; emoji: string }[]
                    ).map((o) => {
                      const active = answers.budget === o.id;
                      return (
                        <button
                          key={o.id}
                          onClick={() => update("budget", o.id)}
                          className={`glass rounded-2xl p-5 flex items-center gap-4 text-left transition ${
                            active ? "ring-2 ring-[var(--sunset)] glow-orange" : "hover:bg-white/5"
                          }`}
                        >
                          <span className="text-3xl">{o.emoji}</span>
                          <div className="font-semibold">{o.label}</div>
                        </button>
                      );
                    })}
                  </div>
                </StepShell>
              )}

              {step === 2 && (
                <StepShell
                  title="¿Qué tan lejos quieres moverte?"
                  subtitle="Ubicación importa para tu plan."
                >
                  <div className="grid gap-3 mt-6">
                    {(
                      [
                        { id: "cerca", label: "Cerca", desc: "A 10 min de mí", emoji: "🏠" },
                        { id: "medio", label: "Medio", desc: "Por la ciudad", emoji: "🚖" },
                        { id: "lejos", label: "Donde sea", desc: "Sorpréndeme", emoji: "🚀" },
                      ] as { id: Distancia; label: string; desc: string; emoji: string }[]
                    ).map((o) => {
                      const active = answers.distancia === o.id;
                      return (
                        <button
                          key={o.id}
                          onClick={() => update("distancia", o.id)}
                          className={`glass rounded-2xl p-5 flex items-center gap-4 text-left transition ${
                            active ? "ring-2 ring-[var(--sunset)] glow-orange" : "hover:bg-white/5"
                          }`}
                        >
                          <span className="text-3xl">{o.emoji}</span>
                          <div>
                            <div className="font-bold">{o.label}</div>
                            <div className="text-xs text-muted-foreground">{o.desc}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </StepShell>
              )}

              {step === 3 && (
                <StepShell title="¿Qué ambiente buscas?" subtitle="Elige todos los que quieras.">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
                    {ambientes.map((a) => {
                      const selected = answers.ambiente?.includes(a.id) ?? false;
                      const toggle = () => {
                        const current = answers.ambiente ?? [];
                        update(
                          "ambiente",
                          selected ? current.filter((x) => x !== a.id) : [...current, a.id],
                        );
                      };
                      return (
                        <motion.button
                          key={a.id}
                          whileTap={{ scale: 0.97 }}
                          onClick={toggle}
                          className={`glass rounded-2xl p-5 text-center transition ${
                            selected
                              ? "ring-2 ring-[var(--sunset)] glow-orange bg-white/5"
                              : "hover:bg-white/5"
                          }`}
                        >
                          <div className="text-3xl">{a.emoji}</div>
                          <div className="mt-2 text-sm font-semibold">{a.label}</div>
                        </motion.button>
                      );
                    })}
                  </div>
                </StepShell>
              )}

              {step === 4 && (
                <StepShell
                  title="¿A qué hora sueles salir?"
                  subtitle="El horario marca todo el plan."
                >
                  <div className="grid grid-cols-3 gap-3 mt-6">
                    {(
                      [
                        { id: "tarde", label: "Tarde", emoji: "🌤️", time: "3pm - 7pm" },
                        { id: "noche", label: "Noche", emoji: "🌙", time: "8pm - 12am" },
                        { id: "madrugada", label: "Madrugada", emoji: "🌌", time: "12am - 5am" },
                      ] as { id: Horario; label: string; emoji: string; time: string }[]
                    ).map((o) => {
                      const active = answers.horario === o.id;
                      return (
                        <motion.button
                          key={o.id}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => update("horario", o.id)}
                          className={`glass rounded-2xl p-5 text-center transition ${
                            active ? "ring-2 ring-[var(--sunset)] glow-orange" : "hover:bg-white/5"
                          }`}
                        >
                          <div className="text-4xl">{o.emoji}</div>
                          <div className="mt-2 font-bold">{o.label}</div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">{o.time}</div>
                        </motion.button>
                      );
                    })}
                  </div>
                </StepShell>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-between gap-3">
            <button
              onClick={prev}
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
              {step === totalSteps - 1 ? "Finalizar" : "Siguiente"}{" "}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

function StepShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">{title}</h1>
      {subtitle && <p className="mt-2 text-muted-foreground text-sm">{subtitle}</p>}
      {children}
    </div>
  );
}

function LoadingFinal() {
  return (
    <div className="min-h-screen grid place-items-center px-5">
      <GlowBg />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="relative h-32 w-32 mx-auto">
          <div className="absolute inset-0 rounded-full bg-[image:var(--gradient-sunset)] blur-2xl opacity-60 animate-pulse" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-[var(--sunset)] border-r-[var(--pink-glow)]"
          />
          <div className="absolute inset-0 grid place-items-center">
            <Sparkles className="h-10 w-10 text-[var(--sunset)]" />
          </div>
        </div>
        <h2 className="mt-8 text-2xl font-bold">
          Estamos encontrando el plan perfecto
          <br />
          <span className="text-gradient-sunset">para tu parche...</span>
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Combinando vibras, presupuestos y horarios.
        </p>
      </motion.div>
    </div>
  );
}
