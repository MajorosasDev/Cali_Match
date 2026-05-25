import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { ArrowRight, Sparkles, Users, Plus, LogOut, Check, Clock, Heart, Star } from "lucide-react";
import { GlowBg } from "@/components/GlowBg";
import { Logo } from "@/components/Logo";
import {
  getProfile,
  getParches,
  clearProfile,
  type Profile,
  type Parche,
} from "@/lib/parche-store";

export const Route = createFileRoute("/landing")({
  head: () => ({ meta: [{ title: "CaliGuide — Planes para tu parche en Cali" }] }),
  component: LandingSwitch,
});

// ─── Switch: detecta si hay sesión ───────────────────────────────────────────
function LandingSwitch() {
  const [profile, setProfile] = useState<Profile | null | undefined>(undefined);
  const [parches, setParches] = useState<Parche[]>([]);

  useEffect(() => {
    const p = getProfile();
    setProfile(p ?? null);
    if (p) setParches(getParches());
  }, []);

  if (profile === undefined) {
    return (
      <div className="min-h-screen grid place-items-center">
        <GlowBg />
        <p className="text-sm text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  return profile ? <PersonalLanding profile={profile} parches={parches} /> : <PublicLanding />;
}

// ─── Landing pública (sin sesión) ─────────────────────────────────────────────
const categorias = [
  "SALSA",
  "ROOFTOPS",
  "BRUNCH",
  "MIRADOR",
  "RUMBA",
  "CULTURA",
  "CAFÉ",
  "LIVE BAND",
];

function PublicLanding() {
  return (
    <div className="min-h-screen">
      <GlowBg />

      <header className="sticky top-0 z-30 backdrop-blur-md bg-background/40 border-b border-white/5">
        <div className="mx-auto max-w-7xl px-5 h-16 flex items-center justify-between">
          <Logo />
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#como" className="hover:text-foreground transition">
              Cómo funciona
            </a>
            <a href="#grupos" className="hover:text-foreground transition">
              Grupos
            </a>
          </nav>
          <Link
            to="/registro"
            className="btn-sunset rounded-full px-4 py-2 text-sm inline-flex items-center gap-2"
          >
            <Sparkles className="h-4 w-4" /> Empezar
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative mx-auto max-w-7xl px-5 pt-12 md:pt-20 pb-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-[var(--sunset)] animate-pulse" />
              Hecho en Cali · Para los parches caleños
            </div>
            <h1 className="mt-5 text-5xl md:text-7xl font-extrabold leading-[1.05] tracking-tight">
              Cali, para
              <br />
              <span className="text-gradient-sunset">tu parche.</span>
            </h1>
            <p className="mt-5 text-muted-foreground text-lg max-w-md">
              Planes y lugares personalizados para tu grupo — salsa, rooftops, brunch y rumba —
              recomendados por un asistente conversacional.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/registro"
                className="btn-sunset rounded-full px-6 py-3.5 inline-flex items-center gap-2"
              >
                <Sparkles className="h-4 w-4" /> Crear mi parche
              </Link>
              <a
                href="#como"
                className="rounded-full px-6 py-3.5 glass hover:bg-white/10 transition inline-flex items-center gap-2"
              >
                Ver cómo funciona <ArrowRight className="h-4 w-4" />
              </a>
            </div>
            <div className="mt-10 flex items-center gap-3">
              <div className="flex -space-x-2">
                {["#f59e0b", "#ec4899", "#a78bfa", "#22d3ee"].map((c) => (
                  <span
                    key={c}
                    className="h-7 w-7 rounded-full border-2 border-background"
                    style={{ background: c }}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="text-foreground font-semibold">+2.300 parches</span> ya
                descubrieron Cali con nosotros
              </p>
            </div>
          </motion.div>

          {/* Mockup tarjetas */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative"
          >
            <div className="absolute -inset-10 bg-[image:var(--gradient-glow)] blur-2xl opacity-70 -z-10" />
            <div className="glass rounded-3xl p-6 max-w-sm mx-auto space-y-3">
              <p className="text-xs text-muted-foreground tracking-widest">PLAN DE HOY 🔥</p>
              {[
                {
                  emoji: "💃",
                  place: "Son de Luz",
                  desc: "Salsa en vivo · San Antonio",
                  tag: "Hoy 9pm",
                },
                {
                  emoji: "🌇",
                  place: "Rooftop La Flora",
                  desc: "Vista panorámica · Norte",
                  tag: "Hoy 7pm",
                },
                {
                  emoji: "🥐",
                  place: "Brunch Factory",
                  desc: "Brunch & cocktails · Granada",
                  tag: "Mañana 11am",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.12 }}
                  className="flex items-center gap-3 glass rounded-2xl px-4 py-3"
                >
                  <span className="text-2xl">{item.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate">{item.place}</div>
                    <div className="text-[11px] text-muted-foreground truncate">{item.desc}</div>
                  </div>
                  <span className="text-[10px] bg-white/10 rounded-full px-2 py-0.5 shrink-0">
                    {item.tag}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Ticker */}
      <div className="border-y border-white/5 overflow-hidden py-3">
        <motion.div
          animate={{ x: [0, -1200] }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          className="flex gap-8 whitespace-nowrap"
        >
          {[...categorias, ...categorias, ...categorias].map((c, i) => (
            <span
              key={i}
              className="text-[10px] tracking-[0.25em] font-semibold text-muted-foreground flex items-center gap-2"
            >
              <Star className="h-2.5 w-2.5 text-[var(--sunset)]" /> {c}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Cómo funciona */}
      <section id="como" className="mx-auto max-w-7xl px-5 py-20">
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.2em] text-[var(--sunset)] font-semibold">
            CÓMO FUNCIONA
          </p>
          <h2 className="mt-3 text-3xl md:text-5xl font-extrabold">3 pasos, un plan perfecto.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              n: "01",
              emoji: "✨",
              title: "Regístrate",
              desc: "Crea tu perfil en segundos y cuéntanos qué tipo de salidas disfrutas.",
            },
            {
              n: "02",
              emoji: "👥",
              title: "Arma tu parche",
              desc: "Invita a tus amigos, cada quien responde qué quiere hacer hoy.",
            },
            {
              n: "03",
              emoji: "🎯",
              title: "Recibe tu plan",
              desc: "CaliGuide combina los gustos de todos y recomienda el plan perfecto.",
            },
          ].map((s) => (
            <div key={s.n} className="glass rounded-3xl p-7 relative overflow-hidden">
              <span className="absolute top-4 right-5 text-[3.5rem] font-extrabold text-white/5 leading-none">
                {s.n}
              </span>
              <div className="text-4xl">{s.emoji}</div>
              <h3 className="mt-4 text-xl font-bold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="grupos" className="mx-auto max-w-7xl px-5 py-16">
        <div className="glass rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[image:var(--gradient-glow)] opacity-30 -z-10" />
          <div className="text-5xl">🔥</div>
          <h2 className="mt-5 text-3xl md:text-5xl font-extrabold">¿Y tu parche qué?</h2>
          <p className="mt-3 text-muted-foreground max-w-md mx-auto">
            Únete a miles de caleños que ya arman sus planes con CaliGuide.
          </p>
          <Link
            to="/registro"
            className="mt-8 btn-sunset rounded-full px-8 py-4 inline-flex items-center gap-2 text-lg"
          >
            <Sparkles className="h-5 w-5" /> Crear mi parche gratis
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/5 py-8">
        <div className="mx-auto max-w-7xl px-5 flex flex-wrap justify-between gap-4 text-xs text-muted-foreground">
          <Logo size="sm" />
          <span>
            Hecho con <Heart className="h-3 w-3 inline text-[var(--sunset)]" /> en Cali
          </span>
        </div>
      </footer>
    </div>
  );
}

// ─── Landing personalizada (con sesión) ──────────────────────────────────────
const tipoEmoji: Record<string, string> = {
  salsa: "💃",
  rooftop: "🌇",
  brunch: "🥐",
  cafe: "☕",
  cultura: "🎨",
  perreo: "🔥",
};

function PersonalLanding({ profile, parches }: { profile: Profile; parches: Parche[] }) {
  const navigate = useNavigate();
  const firstName = profile.name?.split(" ")[0];

  const logout = () => {
    clearProfile();
    navigate({ to: "/landing" });
  };

  return (
    <div className="min-h-screen">
      <GlowBg />

      <header className="sticky top-0 z-30 backdrop-blur-md bg-background/40 border-b border-white/5">
        <div className="mx-auto max-w-7xl px-5 h-16 flex items-center justify-between">
          <Logo />
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#mis-grupos" className="hover:text-foreground transition">
              Mis grupos
            </a>
            <Link to="/parche/crear" className="hover:text-foreground transition">
              Crear parche
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 text-xs">
              <span className="h-6 w-6 rounded-full bg-[image:var(--gradient-sunset)] grid place-items-center text-[10px] font-bold text-[oklch(0.16_0.02_280)]">
                {firstName?.[0]?.toUpperCase() ?? "U"}
              </span>
              {firstName}
            </span>
            <button
              onClick={logout}
              title="Cerrar sesión"
              className="glass rounded-full h-9 w-9 grid place-items-center hover:bg-white/10 transition"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero personalizado */}
      <section className="relative mx-auto max-w-7xl px-5 pt-12 md:pt-16 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Sesión activa · Bienvenido de vuelta
          </div>
          <h1 className="mt-5 text-4xl md:text-6xl font-extrabold leading-[1.05] tracking-tight">
            Hola, <span className="text-gradient-sunset">{firstName} 👋</span>
            <br />
            ¿listo pa' otro parche?
          </h1>
          <p className="mt-4 text-muted-foreground text-lg max-w-md">
            Tienes {parches.length} {parches.length === 1 ? "grupo activo" : "grupos activos"}. Arma
            uno nuevo o continúa donde quedaste.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/parche/crear"
              className="btn-sunset rounded-full px-6 py-3.5 inline-flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> Crear nuevo parche
            </Link>
            <a
              href="#mis-grupos"
              className="rounded-full px-6 py-3.5 glass hover:bg-white/10 transition inline-flex items-center gap-2"
            >
              Ver mis grupos <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </motion.div>
      </section>

      {/* Grupos activos */}
      <section id="mis-grupos" className="mx-auto max-w-7xl px-5 py-10">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
          <div>
            <p className="text-xs tracking-[0.2em] text-[var(--sunset)] font-semibold">
              TUS GRUPOS
            </p>
            <h2 className="mt-2 text-3xl md:text-4xl font-extrabold">
              Tus parches <span className="text-gradient-sunset">activos.</span>
            </h2>
          </div>
          <Link
            to="/parche/crear"
            className="btn-sunset rounded-full px-5 py-2.5 text-sm inline-flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> Nuevo parche
          </Link>
        </div>

        {parches.length === 0 ? (
          <div className="glass rounded-3xl p-10 text-center">
            <div className="text-5xl">🎉</div>
            <h3 className="mt-3 text-xl font-bold">Aún no tienes grupos</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Crea tu primer parche y arma tu plan en Cali.
            </p>
            <Link
              to="/parche/crear"
              className="mt-5 inline-flex btn-sunset rounded-full px-5 py-2.5 text-sm items-center gap-2"
            >
              <Plus className="h-4 w-4" /> Crear mi primer parche
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {parches.map((p) => {
              const answered = p.members.filter((m) => m.status === "answered").length;
              const total = p.members.length;
              const isReady = answered === total;
              const pct = Math.round((answered / total) * 100);
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
                      <p className="text-[10px] tracking-[0.25em] text-muted-foreground mt-1 font-mono">
                        {p.code}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] rounded-full px-2 py-1 border shrink-0 ${isReady ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/30" : "bg-amber-500/15 text-amber-300 border-amber-400/30"}`}
                    >
                      {isReady ? "Listo" : "En progreso"}
                    </span>
                  </div>

                  <div className="mt-4 flex -space-x-2">
                    {p.members.slice(0, 5).map((m, i) => (
                      <span
                        key={i}
                        className="h-8 w-8 rounded-full border-2 border-background grid place-items-center text-sm bg-[image:var(--gradient-rumba)]"
                      >
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
                        {isReady ? (
                          <Check className="h-3 w-3 text-emerald-400" />
                        ) : (
                          <Clock className="h-3 w-3" />
                        )}
                        {answered}/{total} respondieron
                      </span>
                      <span>{pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full bg-[image:var(--gradient-sunset)]"
                        style={{ width: `${pct}%` }}
                      />
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
                    {isReady ? (
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
          <Logo size="sm" />
          <span>
            Hecho con <Heart className="h-3 w-3 inline text-[var(--sunset)]" /> en Cali
          </span>
        </div>
      </footer>
    </div>
  );
}
