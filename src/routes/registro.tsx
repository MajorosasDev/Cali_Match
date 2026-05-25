import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { GlowBg } from "@/components/GlowBg";
import { Logo } from "@/components/Logo";
import { saveProfile } from "@/lib/parche-store";

export const Route = createFileRoute("/registro")({
  head: () => ({ meta: [{ title: "Crea tu perfil — CaliGuide" }] }),
  component: Registro,
});

function Registro() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    birthdate: "",
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    saveProfile(form);
    navigate({ to: "/onboarding" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <GlowBg />
      <header className="px-5 py-5 flex items-center justify-between">
        <Logo />
        <Link
          to="/"
          className="text-sm text-muted-foreground inline-flex items-center gap-1 hover:text-foreground transition"
        >
          <ArrowLeft className="h-4 w-4" /> Volver
        </Link>
      </header>

      <main className="flex-1 grid place-items-center px-5 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-7">
            <p className="text-xs tracking-[0.2em] text-[var(--sunset)] font-semibold">
              PASO 1 DE 3
            </p>
            <h1 className="mt-3 text-3xl md:text-4xl font-extrabold">
              Primero, creemos <span className="text-gradient-sunset">tu perfil ✨</span>
            </h1>
            <p className="mt-2 text-muted-foreground text-sm">
              Solo toma unos segundos para personalizar tu experiencia.
            </p>
          </div>

          <form onSubmit={submit} className="glass rounded-3xl p-6 space-y-4 relative">
            <div className="absolute -inset-6 bg-[image:var(--gradient-glow)] blur-3xl -z-10 opacity-60" />

            <Field label="Nombre" required>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="¿Cómo te llamas?"
                className="cg-input"
                autoFocus
              />
            </Field>

            <Field label="Correo electrónico">
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="tu@correo.com"
                className="cg-input"
              />
            </Field>

            <Field label="Contraseña">
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Mínimo 6 caracteres"
                className="cg-input"
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Celular">
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+57 300 000 0000"
                  className="cg-input"
                />
              </Field>

              <Field label="Fecha de nacimiento">
                <input
                  type="date"
                  value={form.birthdate}
                  onChange={(e) => setForm({ ...form, birthdate: e.target.value })}
                  className="cg-input"
                />
              </Field>
            </div>

            <button
              type="submit"
              disabled={!form.name.trim()}
              className="btn-sunset w-full rounded-2xl py-3.5 inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continuar <ArrowRight className="h-4 w-4" />
            </button>
            <p className="text-center text-xs text-muted-foreground">
              Tu info se guarda solo para personalizar tus planes.
            </p>
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
          font-size: 0.95rem;
          transition: all 0.2s;
        }
        .cg-input::placeholder { color: oklch(0.6 0.02 280); }
        .cg-input:focus {
          outline: none;
          border-color: var(--sunset);
          box-shadow: 0 0 0 4px oklch(0.7 0.21 35 / 0.15);
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-muted-foreground mb-1.5">
        {label} {required && <span className="text-[var(--sunset)]">*</span>}
      </span>
      {children}
    </label>
  );
}
