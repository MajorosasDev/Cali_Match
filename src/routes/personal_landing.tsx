import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { ArrowRight, Sparkles, Users, Plus, LogOut, Check, Clock, Send } from "lucide-react";
import { GlowBg } from "@/components/GlowBg";
import { Logo } from "@/components/Logo";
import { getProfile, getParches, clearProfile, type Profile, type Parche } from "@/lib/parche-store";

export const Route = createFileRoute("/personal_landing")({
  head: () => ({ meta: [{ title: "Tu CaliGuide — Mis parches" }] }),
  component: PersonalLanding,
});

const tipoEmoji: Record<string, string> = {
  salsa: "💃", rooftop: "🌇", brunch: "🥐", cafe: "☕", cultura: "🎨", perreo: "🔥",
};

function PersonalLanding() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [parches, setParches] = useState<Parche[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const p = getProfile();
    setProfile(p);
    setParches(getParches());
    setReady(true);
    if (!p) navigate({ to: "/registro" });
  }, [navigate]);

  const logout = () => {
    clearProfile();
    navigate({ to: "/" });
  };

  if (!ready || !profile) {
    return (
      <div className="min-h-screen grid place-items-center">
        <GlowBg />
        <p className="text-sm text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  const firstName = profile.name?.split(" ")[0];

  return (
    <div className="min-h-screen">
      <GlowBg />

      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-background/40 border-b border-white/5">
        <div className="mx-auto max-w-7xl px-5 h-16 flex items-center justify-between">
          <Logo />
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#mis-grupos" className="hover:text-foreground transition">Mis grupos</a>
            <Link to="/parche/crear" className="hover:text-foreground transition">Crear parche</Link>
            <Link to="/" className="hover:text-foreground transition">Explorar</Link>
          </nav>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 text-xs">
              <span className="h-6 w-6 rounded-full bg-[image:var(--gradient-sunset)] grid place-items-center text-[10px] font-bold text-[oklch(0.16_0.02_280)]">
                {firstName?.[0]?.toUpperCase() ?? "U"}
              </span>
              {firstName}
            </span>
            <button onClick={logout} title="Cerrar sesión" className="glass rounded-full h-9 w-9 grid place-items-center hover:bg-white/10 transition">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Greeting hero */}
      <section className="relative mx-auto max-w-7xl px-5 pt-12 md:pt-16 pb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Sesión activa · Bienvenido de vuelta
          </div>
          <h1 className="mt-5 text-4xl md:text-6xl font-extrabold leading-[1.05] tracking-tight">
            Hola, <span className="text-gradient-sunset">{firstName} 👋</span><br />
            ¿listo pa' otro parche?
          </h1>
          <p className="mt-4 text-muted-foreground text-lg max-w-md">
            Tienes {parches.length} {parches.length === 1 ? "grupo activo" : "grupos activos"}. Arma uno nuevo o continúa donde quedaste.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/parche/crear" className="btn-sunset rounded-full px-6 py-3.5 inline-flex items-center gap-2">
              <Plus className="h-4 w-4" /> Crear nuevo parche
            </Link>
            <a href="#mis-grupos" className="rounded-full px-6 py-3.5 glass hover:bg-white/10 transition inline-flex items-center gap-2">
              Ver mis grupos <ArrowRight className="h-4 w-4" />
            </a>
            <Link to="/telegram" className="rounded-full px-6 py-3.5 glass hover:bg-white/10 transition inline-flex items-center gap-2">
              <Send className="h-4 w-4" /> Ir al bot
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Mis grupos activos */}
      <section id="mis-grupos" className="mx-auto max-w-7xl px-5 py-10">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs tracking-[0.2em] text-[var(--sunset)] font-semibold">TUS GRUPOS</p>
            <h2 className="mt-2 text-3xl md:text-4xl font-extrabold">
              Tus parches <span className="text-gradient-rumba">activos.</span>
            </h2>
          </div>
          <Link to="/parche/crear" className="btn-sunset rounded-full px-5 py-2.5 text-sm inline-flex items-center gap-2">
            <Plus className="h-4 w-4" /> Nuevo parche
          </Link>
        </div>

        {parches.length === 0 ? (
          <div className="mt-8 glass rounded-3xl p-10 text-center">
            <div className="text-5xl">🎉</div>
            <h3 className="mt-3 text-xl font-bold">Aún no tienes grupos</h3>
            <p className="mt-1 text-sm text-muted-foreground">Crea tu primer parche y arma tu plan en Cali.</p>
            <Link to="/parche/crear" className="mt-5 inline-flex btn-sunset rounded-full px-5 py-2.5 text-sm items-center gap-2">
              <Plus className="h-4 w-4" /> Crear mi primer parche
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {parches.map((p) => {
              const answered = p.members.filter((m) => m.status === "answered").length;
              const total = p.members.length;
              const ready = answered === total;
              const pct = (answered / total) * 100;
              return (
                <motion.div
                  key={p.code}
                  whileHover={{ y: -4 }}
                  className="glass rounded-3xl p-5 relative overflow-hidden group"
                >
                  <div className="absolute -inset-10 bg-[image:var(--gradient-glow)] opacity-0 group-hover:opacity-40 blur-3xl -z-10 transition" />
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{tipoEmoji[p.type] ?? "✨"}</span>
                        <h3 className="text-lg font-bold truncate">{p.name}</h3>
                      </div>
                      <p className="text-[10px] tracking-[0.25em] text-muted-foreground mt-1 font-mono">{p.code}</p>
                    </div>
                    <span className={`text-[10px] rounded-full px-2 py-1 border ${ready ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/30" : "bg-amber-500/15 text-amber-300 border-amber-400/30"}`}>
                      {ready ? "Listo" : "En progreso"}
                    </span>
                  </div>

                  <div className="mt-4 flex -space-x-2">
                    {p.members.slice(0, 5).map((m, i) => (
                      <span key={i} className="h-8 w-8 rounded-full border-2 border-background grid place-items-center text-sm bg-[image:var(--gradient-rumba)]">
                        {m.emoji}
                      </span>
                    ))}
                    {p.members.length > 5 && (
                      <span className="h-8 w-8 rounded-full border-2 border-background grid place-items-center text-[10px] font-bold bg-white/10">
                        +{p.members.length - 5}
                      </span>
                    )}
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                      <span className="inline-flex items-center gap-1">
                        {ready ? <Check className="h-3 w-3 text-emerald-400" /> : <Clock className="h-3 w-3" />}
                        {answered}/{total} respondieron
                      </span>
                      <span>{Math.round(pct)}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full bg-[image:var(--gradient-sunset)]" style={{ width: `${pct}%` }} />
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Link
                      to="/parche/$code"
                      params={{ code: p.code }}
                      className="glass rounded-xl py-2 text-xs text-center hover:bg-white/10 transition inline-flex items-center justify-center gap-1"
                    >
                      <Users className="h-3 w-3" /> Estado
                    </Link>
                    {ready ? (
                      <Link
                        to="/parche/$code/match"
                        params={{ code: p.code }}
                        className="btn-sunset rounded-xl py-2 text-xs inline-flex items-center justify-center gap-1"
                      >
                        <Sparkles className="h-3 w-3" /> Plan
                      </Link>
                    ) : (
                      <Link
                        to="/parche/$code"
                        params={{ code: p.code }}
                        className="btn-sunset rounded-xl py-2 text-xs inline-flex items-center justify-center gap-1"
                      >
                        <ArrowRight className="h-3 w-3" /> Abrir
                      </Link>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      <footer className="border-t border-white/5 py-8 mt-10">
        <div className="mx-auto max-w-7xl px-5 flex flex-wrap justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-3"><Logo size="sm" /> · Tu espacio personal</div>
          <Link to="/" className="hover:text-foreground transition">Ver landing pública</Link>
        </div>
      </footer>
    </div>
  );
}
