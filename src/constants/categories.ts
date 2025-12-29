import {
  Wallet,
  Heart,
  Home,
  Briefcase,
  Cross,
  BookOpen,
  Plane,
  LucideIcon,
} from "lucide-react"

export type CategoryType =
  | "FINANCES"
  | "SANTE_SPORT"
  | "PROJETS_VIE"
  | "CARRIERE"
  | "SPIRITUALITE"
  | "DEVELOPPEMENT_PERSONNEL"
  | "LOISIRS_VOYAGES"

export interface CategoryConfig {
  label: string
  description: string
  icon: LucideIcon
  color: string
  bgColor: string
}

export const CATEGORIES: Record<CategoryType, CategoryConfig> = {
  FINANCES: {
    label: "Finances",
    description: "Epargne, investissements, budget",
    icon: Wallet,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  SANTE_SPORT: {
    label: "Sante & Sport",
    description: "Forme physique, alimentation, bien-etre",
    icon: Heart,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  PROJETS_VIE: {
    label: "Projets de Vie",
    description: "Maison, voyage, famille",
    icon: Home,
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
  },
  CARRIERE: {
    label: "Carriere",
    description: "Travail, competences, evolution",
    icon: Briefcase,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  SPIRITUALITE: {
    label: "Spiritualite",
    description: "Foi, priere, croissance spirituelle",
    icon: Cross,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  DEVELOPPEMENT_PERSONNEL: {
    label: "Developpement Personnel",
    description: "Lectures, formations, habitudes",
    icon: BookOpen,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  LOISIRS_VOYAGES: {
    label: "Loisirs & Voyages",
    description: "Detente, decouvertes, aventures",
    icon: Plane,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
  },
}

export const CATEGORY_LIST = Object.entries(CATEGORIES).map(([key, value]) => ({
  value: key as CategoryType,
  ...value,
}))
