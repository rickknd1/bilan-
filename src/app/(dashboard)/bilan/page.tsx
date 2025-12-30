"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/toast"
import {
  ChevronLeft, ChevronRight, Save, User, Users, Heart, Loader2,
  Wallet, Briefcase, Sparkles, Dumbbell, GraduationCap
} from "lucide-react"

const MONTHS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
]

const CATEGORIES = [
  {
    id: "FINANCES",
    label: "Finances",
    icon: Wallet,
    gradient: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    border: "border-emerald-200 dark:border-emerald-800"
  },
  {
    id: "CARRIERE_BUSINESS",
    label: "Carrière / Business",
    icon: Briefcase,
    gradient: "from-blue-500 to-indigo-600",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    border: "border-blue-200 dark:border-blue-800"
  },
  {
    id: "SPIRITUALITE",
    label: "Spiritualité",
    icon: Sparkles,
    gradient: "from-purple-500 to-pink-600",
    bg: "bg-purple-50 dark:bg-purple-950/30",
    border: "border-purple-200 dark:border-purple-800"
  },
  {
    id: "SANTE_SPORT",
    label: "Santé / Sport",
    icon: Dumbbell,
    gradient: "from-red-500 to-orange-600",
    bg: "bg-red-50 dark:bg-red-950/30",
    border: "border-red-200 dark:border-red-800"
  },
  {
    id: "ECOLE",
    label: "École / Études",
    icon: GraduationCap,
    gradient: "from-amber-500 to-yellow-600",
    bg: "bg-amber-50 dark:bg-amber-950/30",
    border: "border-amber-200 dark:border-amber-800"
  },
]

type BilanEntry = {
  objectif: string
  realise: string
  pointsForts: string
  pointsAmeliorer: string
}

type BilanData = {
  [category: string]: BilanEntry
}

export default function BilanPage() {
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth()
  const { toast } = useToast()

  const [year, setYear] = useState(currentYear)
  const [selectedMonth, setSelectedMonth] = useState(currentMonth.toString())
  const [viewMode, setViewMode] = useState<"moi" | "partenaire" | "couple">("moi")
  const [bilanData, setBilanData] = useState<BilanData>({})
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const loadBilan = useCallback(async () => {
    setIsLoading(true)
    try {
      const month = parseInt(selectedMonth) + 1
      const res = await fetch(`/api/bilan?year=${year}&month=${month}&type=${viewMode}`)
      const data = await res.json()

      if (data.bilan?.entries) {
        const entries: BilanData = {}
        for (const entry of data.bilan.entries) {
          entries[entry.category] = {
            objectif: entry.objectif || "",
            realise: entry.realise || "",
            pointsForts: entry.pointsForts || "",
            pointsAmeliorer: entry.pointsAmeliorer || ""
          }
        }
        setBilanData(entries)
      } else {
        setBilanData({})
      }
    } catch (error) {
      console.error("Erreur chargement:", error)
      toast("Erreur lors du chargement", "error")
    } finally {
      setIsLoading(false)
    }
  }, [year, selectedMonth, viewMode, toast])

  useEffect(() => {
    loadBilan()
  }, [loadBilan])

  const handleChange = (category: string, field: keyof BilanEntry, value: string) => {
    setBilanData(prev => ({
      ...prev,
      [category]: {
        objectif: prev[category]?.objectif || "",
        realise: prev[category]?.realise || "",
        pointsForts: prev[category]?.pointsForts || "",
        pointsAmeliorer: prev[category]?.pointsAmeliorer || "",
        [field]: value
      }
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const month = parseInt(selectedMonth) + 1
      const entries = CATEGORIES.map(cat => ({
        category: cat.id,
        ...bilanData[cat.id]
      }))

      const res = await fetch("/api/bilan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year, month, type: viewMode, entries })
      })

      if (res.ok) {
        toast("Bilan sauvegardé avec succès !")
      } else {
        const data = await res.json()
        toast(data.details || "Erreur lors de la sauvegarde", "error")
      }
    } catch (error) {
      console.error("Erreur sauvegarde:", error)
      toast("Erreur lors de la sauvegarde", "error")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
            Bilan Mensuel
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Faites le point sur chaque domaine de votre vie
          </p>
        </div>

        {/* Year selector */}
        <motion.div
          className="flex items-center gap-2 bg-muted/50 rounded-full p-1"
          whileHover={{ scale: 1.02 }}
        >
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-8 w-8"
            onClick={() => setYear(y => y - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-lg font-bold w-14 text-center">{year}</span>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-8 w-8"
            onClick={() => setYear(y => y + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </motion.div>
      </motion.div>

      {/* Month tabs - Mobile scrollable */}
      <Tabs value={selectedMonth} onValueChange={setSelectedMonth}>
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <TabsList className="inline-flex w-max sm:w-full h-auto p-1.5 gap-1 bg-muted/50 backdrop-blur-sm">
            {MONTHS.map((month, index) => {
              const isCurrentMonth = index === currentMonth && year === currentYear
              return (
                <TabsTrigger
                  key={index}
                  value={index.toString()}
                  className={`relative px-3 py-2 text-xs sm:text-sm transition-all ${
                    isCurrentMonth ? "ring-2 ring-pink-500/50" : ""
                  }`}
                >
                  <span className="hidden sm:inline">{month.slice(0, 3)}</span>
                  <span className="sm:hidden">{month.slice(0, 1)}</span>
                  {isCurrentMonth && (
                    <span className="absolute -top-1 -right-1 h-2 w-2 bg-pink-500 rounded-full" />
                  )}
                </TabsTrigger>
              )
            })}
          </TabsList>
        </div>

        <AnimatePresence mode="wait">
          {MONTHS.map((month, monthIndex) => (
            <TabsContent key={monthIndex} value={monthIndex.toString()}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-muted/30">
                  <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <CardTitle className="text-xl flex items-center gap-2">
                        <span className="text-2xl">📅</span>
                        {month} {year}
                      </CardTitle>

                      {/* View mode selector */}
                      <div className="flex gap-1 bg-muted/70 p-1 rounded-full backdrop-blur-sm">
                        {[
                          { id: "moi", icon: User, label: "Moi" },
                          { id: "partenaire", icon: Heart, label: "Elle" },
                          { id: "couple", icon: Users, label: "Nous" },
                        ].map(mode => (
                          <motion.button
                            key={mode.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setViewMode(mode.id as typeof viewMode)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                              viewMode === mode.id
                                ? "bg-white dark:bg-zinc-800 shadow-md text-foreground"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            <mode.icon className="h-4 w-4" />
                            <span className="hidden sm:inline">{mode.label}</span>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {isLoading ? (
                      <div className="flex items-center justify-center py-16">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Loader2 className="h-8 w-8 text-pink-500" />
                        </motion.div>
                      </div>
                    ) : (
                      <>
                        {CATEGORIES.map((category, index) => {
                          const Icon = category.icon
                          return (
                            <motion.div
                              key={category.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className={`rounded-xl border ${category.border} ${category.bg} overflow-hidden`}
                            >
                              {/* Category header */}
                              <div className={`px-4 py-3 bg-gradient-to-r ${category.gradient}`}>
                                <div className="flex items-center gap-2 text-white">
                                  <Icon className="h-5 w-5" />
                                  <span className="font-semibold">{category.label}</span>
                                </div>
                              </div>

                              {/* Fields grid */}
                              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                  { key: "objectif", label: "🎯 Objectif", placeholder: "Quel était votre objectif ?" },
                                  { key: "realise", label: "✅ Réalisé", placeholder: "Qu'avez-vous accompli ?" },
                                  { key: "pointsForts", label: "💪 Points forts", placeholder: "Ce qui a bien marché..." },
                                  { key: "pointsAmeliorer", label: "📈 À améliorer", placeholder: "Axes d'amélioration..." },
                                ].map(field => (
                                  <div key={field.key} className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">
                                      {field.label}
                                    </label>
                                    <Textarea
                                      placeholder={field.placeholder}
                                      value={bilanData[category.id]?.[field.key as keyof BilanEntry] || ""}
                                      onChange={(e) => handleChange(category.id, field.key as keyof BilanEntry, e.target.value)}
                                      disabled={viewMode === "partenaire"}
                                      className="min-h-[80px] bg-white dark:bg-background border border-input resize-none focus:ring-2 focus:ring-primary/30 transition-all"
                                    />
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )
                        })}

                        {/* Save button */}
                        {viewMode !== "partenaire" && (
                          <motion.div
                            className="flex justify-end pt-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                          >
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                              <Button
                                onClick={handleSave}
                                disabled={isSaving}
                                size="lg"
                                className="gap-2 bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white shadow-lg shadow-pink-500/25"
                              >
                                {isSaving ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Save className="h-4 w-4" />
                                )}
                                {isSaving ? "Sauvegarde..." : "Sauvegarder"}
                              </Button>
                            </motion.div>
                          </motion.div>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          ))}
        </AnimatePresence>
      </Tabs>
    </div>
  )
}
