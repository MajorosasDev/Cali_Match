import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { ArrowLeft, Check, Clock, Minus, Plus, Sparkles, UserPlus, Users } from "lucide-react";
import { GlowBg } from "@/components/GlowBg";
import { Logo } from "@/components/Logo";
import { getParche, saveParche, mockMembers, getProfile, type Parche } from "@/lib/parche-store";

export const Route = createFileRoute("/parche/$code")({
  head: () => ({ meta: [{ title: "Estado del parche — CaliGuide" }] }),
  component: EstadoParche,
});

function EstadoParche() {
  const navigate = useNavigate();
  const { code } = Route.useParams();
  const [parche, setParche] = useState<Parche | null>(null);
  const [allReady, setAllReady] = useState(false);

  useEffect(() => {
    const p = getParche(code);
    if (p && !p.adminAnswered) {
      navigate({ to: "/parche/$code/quiz", params: { code } });
      return;
    }
    setParche(p);
  }, [code, navigate]);

  const updateSize = (delta: number) => {
    if (!parche) return;
    const newSize = Math.max(2, Math.min(20, parche.size + delta));
    if (newSize === parche.size) return;
    let members = parche.members;
    if (newSize > parche.size) {
      const profile = getProfile();
      const fresh = mockMembers(newSize, profile?.name);
      // keep existing answered/pending statuses for current members, append new pending
      const extras = fresh.slice(parche.members.length).map((m) => ({ ...m, status: "pending" as const }));
      members = [...parche.members, ...extras];
    } else {
      members = parche.members.slice(0, newSize);
    }
    const updated = { ...parche, size: newSize, members };
    saveParche(updated);
    setParche(updated);
  };

  // Simulate members answering over time
  useEffect(() => {
    if (!parche) return;
    const pending = parche.members.filter((m) => m.status === "pending");
    if (pending.length === 0) {
      setAllReady(true);
      return;
    }
    const t = setTimeout(() => {
      const idx = parche.members.findIndex((m) => m.status === "pending");
      if (idx === -1) return;
      const updated = { ...parche, members: parche.members.map((m, i) => i === idx ? { ...m, status: "answered" as const } : m) };
      saveParche(updated);
      setParche(updated);
    }, 2500);
    return () => clearTimeout(t);
  }, [parche]);

  if (!parche) {
    return (
      <div className="min-h-screen grid place-items-center px-5">
        <GlowBg />
        <div className="text-center">
          <p className="text-muted-foreground">No encontramos ese parche.</p>
          <Link to="/parche/crear" className="mt-4 inline-block btn-sunset rounded-full px-5 py-2.5 text-sm">Crear parche</Link>
        </div>
      </div>
    );
  }

  const answered = parche.members.filter((m) => m.status === "answered").length;
  const total = parche.members.length;
  const progress = (answered / total) * 100;

  return (
    <div className="min-h-screen flex flex-col">
      <GlowBg />
      <header className="px-5 py-5 flex items-center justify-between">
        <Logo size="sm" />
        <Link to="/" className="text-sm text-muted-foreground inline-flex items-center gap-1"><ArrowLeft className="h-4 w-4" /> Salir</Link>
      </header>

      <main className="flex-1 px-5 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-end justify-between flex-wrap gap-2">
            <div>
              <p className="text-xs tracking-[0.2em] text-[var(--sunset)] font-semibold">PARCHE</p>
              <h1 className="mt-1 text-3xl md:text-4xl font-extrabold">{parche.name}</h1>
              <p className="text-xs text-muted-foreground mt-1">Código: <span className="font-mono tracking-widest">{code}</span></p>
            </div>
            <span className="glass rounded-full px-3 py-1.5 text-xs inline-flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" /> {total} personas
            </span>
          </div>

          {/* Progress */}
          <div className="mt-6 glass rounded-3xl p-5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progreso del parche</span>
              <span className="font-bold">{answered}/{total} listos</span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-white/5 overflow-hidden">
              <motion.div className="h-full bg-[image:var(--gradient-sunset)]" animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
            </div>

            <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm">
                <UserPlus className="h-4 w-4 text-[var(--sunset)]" />
                <span className="text-muted-foreground">Admitir más personas</span>
              </div>
              <div className="flex items-center gap-2 glass rounded-xl p-1">
                <button
                  onClick={() => updateSize(-1)}
                  disabled={parche.size <= 2}
                  className="h-8 w-8 rounded-lg bg-white/5 hover:bg-white/10 inline-flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Reducir cupo"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <div className="min-w-10 text-center text-sm font-bold">{parche.size}</div>
                <button
                  onClick={() => updateSize(1)}
                  disabled={parche.size >= 20}
                  className="h-8 w-8 rounded-lg bg-[image:var(--gradient-sunset)] inline-flex items-center justify-center text-black disabled:opacity-30"
                  aria-label="Aumentar cupo"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Members */}
          <div className="mt-5 grid sm:grid-cols-2 gap-3">
            {parche.members.map((m) => (
              <motion.div
                key={m.id}
                layout
                className={`glass rounded-2xl p-4 flex items-center gap-3 transition ${m.status === "answered" ? "ring-1 ring-emerald-400/30" : ""}`}
              >
                <div className="relative h-11 w-11 grid place-items-center rounded-full bg-[image:var(--gradient-rumba)] text-lg">
                  {m.emoji}
                  {m.status === "answered" && (
                    <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-400 grid place-items-center border-2 border-background">
                      <Check className="h-3 w-3 text-emerald-950" />
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{m.name}</div>
                  <div className="text-xs text-muted-foreground inline-flex items-center gap-1">
                    {m.status === "answered" ? (<><Check className="h-3 w-3 text-emerald-400" /> Respondió</>) : (<><Clock className="h-3 w-3" /> Pendiente</>)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <AnimatePresence>
            {allReady && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="mt-7 glass rounded-3xl p-6 text-center relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-[image:var(--gradient-glow)] opacity-70 -z-10" />
                <div className="text-4xl">🔥</div>
                <h2 className="mt-2 text-2xl font-extrabold">Parche listo</h2>
                <p className="text-sm text-muted-foreground mt-1">Todos respondieron. Veamos la compatibilidad.</p>
                <button
                  onClick={() => navigate({ to: "/parche/$code/match", params: { code } })}
                  className="mt-5 btn-sunset rounded-full px-6 py-3 inline-flex items-center gap-2"
                >
                  <Sparkles className="h-4 w-4" /> Generar recomendación
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {!allReady && (
            <p className="mt-6 text-center text-xs text-muted-foreground">
              Esperando a que el resto del grupo complete su perfil...
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
