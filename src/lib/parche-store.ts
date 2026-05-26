// Lightweight client-side store using localStorage for demo flow.
export type Ambiente = "elegante" | "casual" | "alternativo" | "tropical" | "romantico" | "fiesta";
export type Horario = "tarde" | "noche" | "madrugada";
export type Distancia = "cerca" | "medio" | "lejos";

export interface Profile {
  name: string;
  email?: string;
  password?: string;
  phone?: string;
  birthdate?: string;
}

export interface OnboardingAnswers {
  budget?: string;
  distancia?: Distancia;
  ambiente?: string[];
  horario?: Horario;
  experiencias?: string[];
}

export interface Member {
  id: string;
  name: string;
  emoji: string;
  status: "answered" | "pending";
  answers?: OnboardingAnswers;
}

export interface AdminQuiz {
  disponibilidad?: string[]; // e.g. ["lun","mar"]
  lugares?: string[];
  mood?: string;
  franja?: "dia" | "tarde" | "noche";
}

export interface Parche {
  code: string;
  name: string;
  size: number;
  type: string;
  members: Member[];
  adminAnswered?: boolean;
  adminQuiz?: AdminQuiz;
}

const PROFILE_KEY = "cg.profile";
const ONB_KEY = "cg.onboarding";
const PARCHE_KEY = "cg.parche";
const PARCHES_KEY = "cg.parches";
const SESSION_KEY = "cg.session";
const LEGACY_SESSION_KEY = "cg.session.email";

const safeWindow = () => typeof window !== "undefined";

export const saveProfile = (p: Profile) =>
  safeWindow() && localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
export const getProfile = (): Profile | null => {
  if (!safeWindow()) return null;
  const raw = localStorage.getItem(PROFILE_KEY);
  return raw ? JSON.parse(raw) : null;
};
export const clearProfile = () => safeWindow() && localStorage.removeItem(PROFILE_KEY);

// Sesión ligera: guarda el id UUID y email del usuario activo
export const saveSession = (id: string, email: string) => {
  if (!safeWindow()) return;
  localStorage.setItem(SESSION_KEY, id);
  localStorage.setItem(SESSION_KEY + ".email", email);
};
export const getSessionId = (): string | null => {
  if (!safeWindow()) return null;
  return localStorage.getItem(SESSION_KEY) || localStorage.getItem(LEGACY_SESSION_KEY);
};
export const getSessionEmail = (): string | null => {
  if (!safeWindow()) return null;
  return (
    localStorage.getItem(SESSION_KEY + ".email") ||
    localStorage.getItem(LEGACY_SESSION_KEY + ".email")
  );
};
export const clearSession = () => {
  if (!safeWindow()) return;
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(SESSION_KEY + ".email");
  localStorage.removeItem(LEGACY_SESSION_KEY);
  localStorage.removeItem(LEGACY_SESSION_KEY + ".email");
  localStorage.removeItem(PROFILE_KEY);
};

export const saveOnboarding = (a: OnboardingAnswers) =>
  safeWindow() && localStorage.setItem(ONB_KEY, JSON.stringify(a));
export const getOnboarding = (): OnboardingAnswers => {
  if (!safeWindow()) return {};
  const raw = localStorage.getItem(ONB_KEY);
  return raw ? JSON.parse(raw) : {};
};

export const getParches = (): Parche[] => {
  if (!safeWindow()) return [];
  const raw = localStorage.getItem(PARCHES_KEY);
  return raw ? JSON.parse(raw) : [];
};

export const saveParche = (p: Parche) => {
  if (!safeWindow()) return;
  localStorage.setItem(PARCHE_KEY, JSON.stringify(p));
  const list = getParches();
  const idx = list.findIndex((x) => x.code === p.code);
  if (idx >= 0) list[idx] = p;
  else list.unshift(p);
  localStorage.setItem(PARCHES_KEY, JSON.stringify(list));
};

export const getParche = (code?: string): Parche | null => {
  if (!safeWindow()) return null;
  if (code) {
    const found = getParches().find((p) => p.code === code);
    if (found) return found;
  }
  const raw = localStorage.getItem(PARCHE_KEY);
  return raw ? JSON.parse(raw) : null;
};

export const removeParche = (code: string) => {
  if (!safeWindow()) return;
  const list = getParches().filter((p) => p.code !== code);
  localStorage.setItem(PARCHES_KEY, JSON.stringify(list));
  const current = localStorage.getItem(PARCHE_KEY);
  if (current) {
    const cur = JSON.parse(current) as Parche;
    if (cur.code === code) localStorage.removeItem(PARCHE_KEY);
  }
};

export const genCode = () => Math.random().toString(36).slice(2, 8).toUpperCase();

export const mockMembers = (count: number, currentName?: string): Member[] => {
  const pool = [
    { name: "Mariana", emoji: "💃" },
    { name: "Andrés", emoji: "🕺" },
    { name: "Camila", emoji: "🌺" },
    { name: "Sebas", emoji: "🍹" },
    { name: "Lucía", emoji: "✨" },
    { name: "Juanjo", emoji: "🎷" },
    { name: "Vale", emoji: "🌴" },
  ];
  const others = pool.slice(0, Math.max(0, count - 1)).map((m, i) => ({
    id: `m_${i}`,
    name: m.name,
    emoji: m.emoji,
    status: (i === 0 ? "answered" : "pending") as Member["status"],
  }));
  return [
    {
      id: "me",
      name: currentName ?? "Tú",
      emoji: "🔥",
      status: "answered",
    },
    ...others,
  ];
};
