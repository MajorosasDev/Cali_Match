// Lightweight client-side store using localStorage for demo flow.
export type Vibe = "salsa" | "rooftop" | "brunch" | "perreo" | "cafe" | "cultura";
export type Ambiente = "elegante" | "casual" | "alternativo" | "tropical" | "romantico" | "fiesta";
export type Horario = "tarde" | "noche" | "madrugada";
export type Distancia = "cerca" | "medio" | "lejos";

export interface Profile {
  name: string;
  email?: string;
  phone?: string;
  instagram?: string;
  age?: string;
}

export interface OnboardingAnswers {
  vibe?: Vibe;
  budget?: number; // 0-100
  distance?: Distancia;
  ambiente?: Ambiente;
  horario?: Horario;
}

export interface Member {
  id: string;
  name: string;
  emoji: string;
  status: "answered" | "pending";
  answers?: OnboardingAnswers;
}

export interface Parche {
  code: string;
  name: string;
  size: number;
  type: Vibe;
  members: Member[];
}

const PROFILE_KEY = "cg.profile";
const ONB_KEY = "cg.onboarding";
const PARCHE_KEY = "cg.parche";

const safeWindow = () => typeof window !== "undefined";

export const saveProfile = (p: Profile) => safeWindow() && localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
export const getProfile = (): Profile | null => {
  if (!safeWindow()) return null;
  const raw = localStorage.getItem(PROFILE_KEY);
  return raw ? JSON.parse(raw) : null;
};

export const saveOnboarding = (a: OnboardingAnswers) =>
  safeWindow() && localStorage.setItem(ONB_KEY, JSON.stringify(a));
export const getOnboarding = (): OnboardingAnswers => {
  if (!safeWindow()) return {};
  const raw = localStorage.getItem(ONB_KEY);
  return raw ? JSON.parse(raw) : {};
};

export const saveParche = (p: Parche) =>
  safeWindow() && localStorage.setItem(PARCHE_KEY, JSON.stringify(p));
export const getParche = (): Parche | null => {
  if (!safeWindow()) return null;
  const raw = localStorage.getItem(PARCHE_KEY);
  return raw ? JSON.parse(raw) : null;
};

export const genCode = () =>
  Math.random().toString(36).slice(2, 8).toUpperCase();

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
