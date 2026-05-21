import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { ArrowLeft, Check, Copy, Send } from "lucide-react";
import { GlowBg } from "@/components/GlowBg";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/telegram")({
  head: () => ({ meta: [{ title: "Abrir Telegram — CaliGuide" }] }),
  component: TelegramRedirect,
});

const BOT_URL = "https://t.me/CaliGuideBot";

function TelegramRedirect() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(BOT_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Faux QR pattern - decorative
  const qr = Array.from({ length: 21 * 21 }, (_, i) => {
    const x = i % 21, y = Math.floor(i / 21);
    const corner = (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13);
    if (corner) {
      const cx = x < 7 ? x : x - 14, cy = y < 7 ? y : y - 14;
      return (cx === 0 || cx === 6 || cy === 0 || cy === 6 || (cx >= 2 && cx <= 4 && cy >= 2 && cy <= 4));
    }
    return (x * 7 + y * 13 + (x ^ y) * 3) % 3 === 0;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <GlowBg />
      <header className="px-5 py-5 flex items-center justify-between">
        <Logo />
        <Link to="/personal_landing" className="text-sm text-muted-foreground inline-flex items-center gap-1"><ArrowLeft className="h-4 w-4" /> Mi espacio</Link>
      </header>

      <main className="flex-1 grid place-items-center px-5 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md text-center">
          <p className="text-xs tracking-[0.2em] text-[var(--sunset)] font-semibold">TELEGRAM</p>
          <h1 className="mt-3 text-3xl md:text-4xl font-extrabold leading-tight">
            Empieza ya.<br /><span className="text-gradient-sunset">Sin instalar nada.</span>
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Tu recomendación personalizada estará lista en Telegram en menos de 60 segundos.
          </p>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="mt-7 relative inline-block"
          >
            <div className="absolute -inset-8 bg-[image:var(--gradient-glow)] blur-3xl opacity-70 -z-10" />
            <div className="rounded-3xl bg-white p-4 shadow-[var(--shadow-glow-pink)]">
              <div className="grid grid-cols-[repeat(21,1fr)] gap-[2px] w-56">
                {qr.map((on, i) => (
                  <div key={i} className={`aspect-square ${on ? "bg-black" : "bg-white"}`} />
                ))}
              </div>
              <div className="mt-3 text-[10px] tracking-widest font-bold text-neutral-700 inline-flex items-center gap-1">
                <Send className="h-3 w-3" /> ESCANEA
              </div>
            </div>
          </motion.div>

          <div className="mt-7 flex flex-col gap-2">
            <a
              href={BOT_URL}
              target="_blank" rel="noreferrer"
              className="btn-sunset rounded-full px-6 py-3.5 inline-flex items-center justify-center gap-2"
            >
              <Send className="h-4 w-4" /> Abrir @CaliGuideBot
            </a>
            <button
              onClick={copy}
              className="glass rounded-full px-6 py-3 text-sm inline-flex items-center justify-center gap-2 hover:bg-white/10 transition"
            >
              {copied ? <><Check className="h-4 w-4" /> Link copiado</> : <><Copy className="h-4 w-4" /> Copiar link</>}
            </button>
            <Link
              to="/personal_landing"
              className="rounded-full px-6 py-3 text-sm inline-flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition"
            >
              <ArrowLeft className="h-4 w-4" /> Volver a mi espacio
            </Link>
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            Tu parche y respuestas ya están guardados — el bot los reconocerá automáticamente. Puedes volver al inicio para crear más grupos.
          </p>
        </motion.div>
      </main>
    </div>
  );
}
