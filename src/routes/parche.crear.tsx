import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Copy, Share2, Send, Check } from "lucide-react";
import { GlowBg } from "@/components/GlowBg";
import { Logo } from "@/components/Logo";
import { saveParche, genCode, mockMembers, getProfile, type Vibe } from "@/lib/parche-store";

export const Route = createFileRoute("/parche/crear")({
  head: () => ({ meta: [{ title: "Arma tu parche — CaliGuide" }] }),
  component: CrearParche,
});

const tipos: { id: Vibe; label: string; emoji: string }[] = [
  { id: "salsa", label: "Salsa", emoji: "💃" },
  { id: "rooftop", label: "Rooftop", emoji: "🌇" },
  { id: "brunch", label: "Brunch", emoji: "🥐" },
  { id: "cafe", label: "Café", emoji: "☕" },
  { id: "cultura", label: "Cultura", emoji: "🎨" },
  { id: "perreo", label: "Rumba", emoji: "🔥" },
];

function CrearParche() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [size, setSize] = useState(4);
  const [type, setType] = useState<Vibe | null>(null);
  const [created, setCreated] = useState<{ code: string; link: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !type) return;
    const code = genCode();
    const profile = getProfile();
    saveParche({
      code,
      name: name.trim(),
      size,
      type,
      members: mockMembers(size, profile?.name),
    });
    const link = `${window.location.origin}/parche/${code}`;
    setCreated({ code, link });
  };

  const copy = async () => {
    if (!created) return;
    await navigator.clipboard.writeText(created.link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (created) {
    return (
      <div className="min-h-screen flex flex-col">
        <GlowBg />
        <header className="px-5 py-5 flex items-center justify-between">
          <Logo />
          <Link to="/" className="text-sm text-muted-foreground inline-flex items-center gap-1"><ArrowLeft className="h-4 w-4" /> Inicio</Link>
        </header>
        <main className="flex-1 grid place-items-center px-5 py-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Parche creado
              </div>
              <h1 className="mt-4 text-3xl md:text-4xl font-extrabold">
                Tu parche <span className="text-gradient-sunset">está listo 🔥</span>
              </h1>
              <p className="mt-2 text-muted-foreground text-sm">Comparte el link con tu grupo para que cada quien arme su perfil.</p>
            </div>

            <div className="mt-7 glass rounded-3xl p-6 relative">
              <div className="absolute -inset-6 bg-[image:var(--gradient-glow)] blur-3xl -z-10 opacity-60" />
              <p className="text-xs text-muted-foreground">Código del parche</p>
              <p className="text-3xl font-extrabold tracking-[0.3em] text-gradient-sunset">{created.code}</p>

              <div className="mt-5 glass rounded-2xl p-3 flex items-center gap-2">
                <input readOnly value={created.link} className="flex-1 bg-transparent text-xs text-muted-foreground outline-none truncate" />
                <button onClick={copy} className="rounded-xl btn-sunset px-3 py-2 text-xs inline-flex items-center gap-1">
                  {copied ? <><Check className="h-3 w-3" /> Copiado</> : <><Copy className="h-3 w-3" /> Copiar</>}
                </button>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`Únete a mi parche en CaliGuide: ${created.link}`)}`}
                  target="_blank" rel="noreferrer"
                  className="glass rounded-2xl py-3 text-sm inline-flex items-center justify-center gap-2 hover:bg-white/5 transition"
                >
                  <Share2 className="h-4 w-4" /> WhatsApp
                </a>
                <a
                  href={`https://t.me/share/url?url=${encodeURIComponent(created.link)}&text=${encodeURIComponent("Únete a mi parche en CaliGuide")}`}
                  target="_blank" rel="noreferrer"
                  className="glass rounded-2xl py-3 text-sm inline-flex items-center justify-center gap-2 hover:bg-white/5 transition"
                >
                  <Send className="h-4 w-4" /> Telegram
                </a>
              </div>
            </div>

            <button
              onClick={() => navigate({ to: "/parche/$code/quiz", params: { code: created.code } })}
              className="mt-5 btn-sunset w-full rounded-2xl py-3.5 inline-flex items-center justify-center gap-2"
            >
              Responder tu quiz <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <GlowBg />
      <header className="px-5 py-5 flex items-center justify-between">
        <Logo />
        <Link to="/onboarding" className="text-sm text-muted-foreground inline-flex items-center gap-1"><ArrowLeft className="h-4 w-4" /> Atrás</Link>
      </header>

      <main className="flex-1 grid place-items-center px-5 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="text-center mb-7">
            <p className="text-xs tracking-[0.2em] text-[var(--sunset)] font-semibold">PASO 3 DE 3</p>
            <h1 className="mt-3 text-3xl md:text-4xl font-extrabold leading-tight">
              Arma tu parche en <span className="text-gradient-sunset">segundos.</span>
            </h1>
            <p className="mt-2 text-muted-foreground text-sm">Invita a tus amigos y armen el plan perfecto en Cali.</p>
          </div>

          <form onSubmit={submit} className="glass rounded-3xl p-6 space-y-5 relative">
            <div className="absolute -inset-6 bg-[image:var(--gradient-glow)] blur-3xl -z-10 opacity-60" />

            <div>
              <label className="text-xs text-muted-foreground">Nombre del parche</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Los Salseros, Brunch crew..."
                className="cg-input mt-1.5"
                autoFocus
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground">¿Cuántas personas?</label>
              <div className="mt-2 flex items-center justify-between glass rounded-2xl p-2">
                <button type="button" onClick={() => setSize(Math.max(2, size - 1))} className="h-10 w-10 rounded-xl bg-white/5 hover:bg-white/10">−</button>
                <div className="text-2xl font-bold">{size} <span className="text-sm text-muted-foreground font-normal">personas</span></div>
                <button type="button" onClick={() => setSize(Math.min(12, size + 1))} className="h-10 w-10 rounded-xl bg-white/5 hover:bg-white/10">+</button>
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground">Tipo de salida</label>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {tipos.map((t) => {
                  const active = type === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setType(t.id)}
                      className={`glass rounded-2xl py-3 text-xs font-semibold transition ${active ? "ring-2 ring-[var(--sunset)] glow-orange" : "hover:bg-white/5"}`}
                    >
                      <div className="text-xl mb-0.5">{t.emoji}</div>
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={!name.trim() || !type}
              className="btn-sunset w-full rounded-2xl py-3.5 inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Crear parche <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </motion.div>
      </main>

      <style>{`
        .cg-input {
          width: 100%;
          background: oklch(1 0 0 / 0.04);
          border: 1px solid oklch(1 0 0 / 0.08);
          border-radius: 0.9rem;
          padding: 0.75rem 1rem;
          color: var(--foreground);
        }
        .cg-input::placeholder { color: oklch(0.6 0.02 280); }
        .cg-input:focus { outline: none; border-color: var(--sunset); box-shadow: 0 0 0 4px oklch(0.7 0.21 35 / 0.15); }
      `}</style>
    </div>
  );
}
