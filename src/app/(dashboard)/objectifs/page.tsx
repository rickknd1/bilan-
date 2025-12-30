"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/toast"
import {
  Target, Plus, ChevronLeft, ChevronRight, User, Users,
  Wallet, Briefcase, Sparkles, Dumbbell, GraduationCap,
  CheckCircle, Clock, XCircle, Trash2, Edit, Loader2
} from "lucide-react"

const CATEGORIES = [
  { id: "FINANCES", label: "Finances", icon: Wallet, color: "bg-emerald-500" },
  { id: "CARRIERE_BUSINESS", label: "Carrière / Business", icon: Briefcase, color: "bg-blue-500" },
  { id: "SPIRITUALITE", label: "Spiritualité", icon: Sparkles, color: "bg-purple-500" },
  { id: "SANTE_SPORT", label: "Santé / Sport", icon: Dumbbell, color: "bg-red-500" },
  { id: "ECOLE", label: "École / Études", icon: GraduationCap, color: "bg-amber-500" },
]

const STATUS_OPTIONS = [
  { id: "EN_COURS", label: "En cours", icon: Clock, color: "bg-blue-500" },
  { id: "ATTEINT", label: "Atteint", icon: CheckCircle, color: "bg-emerald-500" },
  { id: "ABANDONNE", label: "Abandonné", icon: XCircle, color: "bg-gray-500" },
]

const PRIORITY_OPTIONS = [
  { id: "LOW", label: "Basse", color: "bg-gray-400" },
  { id: "MEDIUM", label: "Moyenne", color: "bg-amber-500" },
  { id: "HIGH", label: "Haute", color: "bg-red-500" },
]

type Objectif = {
  id: string
  year: number
  title: string
  description?: string
  category: string
  status: string
  progress: number
  priority: string
  createdAt: string
}

export default function ObjectifsPage() {
  const currentYear = new Date().getFullYear()
  const { toast } = useToast()

  const [year, setYear] = useState(currentYear)
  const [viewMode, setViewMode] = useState<"moi" | "couple">("moi")
  const [objectifs, setObjectifs] = useState<Objectif[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingObjectif, setEditingObjectif] = useState<Objectif | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "FINANCES",
    priority: "MEDIUM"
  })

  const loadObjectifs = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/objectifs?year=${year}&type=${viewMode}`)
      const data = await res.json()
      setObjectifs(data.objectifs || [])
    } catch (error) {
      console.error("Erreur chargement:", error)
      toast("Erreur lors du chargement", "error")
    } finally {
      setIsLoading(false)
    }
  }, [year, viewMode, toast])

  useEffect(() => {
    loadObjectifs()
  }, [loadObjectifs])

  const handleCreate = async () => {
    if (!formData.title.trim()) {
      toast("Le titre est requis", "error")
      return
    }

    setIsSaving(true)
    try {
      const res = await fetch("/api/objectifs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          year,
          type: viewMode,
          ...formData
        })
      })

      if (res.ok) {
        toast("Objectif créé avec succès !")
        setIsDialogOpen(false)
        setFormData({ title: "", description: "", category: "FINANCES", priority: "MEDIUM" })
        loadObjectifs()
      } else {
        const data = await res.json()
        toast(data.details || "Erreur lors de la création", "error")
      }
    } catch (error) {
      console.error("Erreur création:", error)
      toast("Erreur lors de la création", "error")
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdate = async () => {
    if (!editingObjectif) return

    setIsSaving(true)
    try {
      const res = await fetch("/api/objectifs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingObjectif.id,
          type: viewMode,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          priority: formData.priority
        })
      })

      if (res.ok) {
        toast("Objectif mis à jour !")
        setIsDialogOpen(false)
        setEditingObjectif(null)
        setFormData({ title: "", description: "", category: "FINANCES", priority: "MEDIUM" })
        loadObjectifs()
      } else {
        const data = await res.json()
        toast(data.details || "Erreur lors de la mise à jour", "error")
      }
    } catch (error) {
      console.error("Erreur mise à jour:", error)
      toast("Erreur lors de la mise à jour", "error")
    } finally {
      setIsSaving(false)
    }
  }

  const handleStatusChange = async (objectif: Objectif, newStatus: string) => {
    try {
      const res = await fetch("/api/objectifs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: objectif.id,
          type: viewMode,
          status: newStatus,
          progress: newStatus === "ATTEINT" ? 100 : objectif.progress
        })
      })

      if (res.ok) {
        toast("Statut mis à jour !")
        loadObjectifs()
      }
    } catch (error) {
      console.error("Erreur:", error)
    }
  }

  const handleProgressChange = async (objectif: Objectif, newProgress: number) => {
    try {
      await fetch("/api/objectifs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: objectif.id,
          type: viewMode,
          progress: newProgress,
          status: newProgress >= 100 ? "ATTEINT" : "EN_COURS"
        })
      })
      loadObjectifs()
    } catch (error) {
      console.error("Erreur:", error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cet objectif ?")) return

    try {
      const res = await fetch(`/api/objectifs?id=${id}&type=${viewMode}`, {
        method: "DELETE"
      })

      if (res.ok) {
        toast("Objectif supprimé !")
        loadObjectifs()
      }
    } catch (error) {
      console.error("Erreur suppression:", error)
      toast("Erreur lors de la suppression", "error")
    }
  }

  const openEditDialog = (objectif: Objectif) => {
    setEditingObjectif(objectif)
    setFormData({
      title: objectif.title,
      description: objectif.description || "",
      category: objectif.category,
      priority: objectif.priority
    })
    setIsDialogOpen(true)
  }

  const openCreateDialog = () => {
    setEditingObjectif(null)
    setFormData({ title: "", description: "", category: "FINANCES", priority: "MEDIUM" })
    setIsDialogOpen(true)
  }

  const getCategoryInfo = (categoryId: string) => {
    return CATEGORIES.find(c => c.id === categoryId) || CATEGORIES[0]
  }

  const getStatusInfo = (statusId: string) => {
    return STATUS_OPTIONS.find(s => s.id === statusId) || STATUS_OPTIONS[0]
  }

  const getPriorityInfo = (priorityId: string) => {
    return PRIORITY_OPTIONS.find(p => p.id === priorityId) || PRIORITY_OPTIONS[1]
  }

  // Statistiques
  const stats = {
    total: objectifs.length,
    atteints: objectifs.filter(o => o.status === "ATTEINT").length,
    enCours: objectifs.filter(o => o.status === "EN_COURS").length,
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
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
            Objectifs {year}
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Définissez vos objectifs annuels et suivez leur progression
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Year selector */}
          <div className="flex items-center gap-1 bg-muted/50 rounded-full p-1">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-8 w-8"
              onClick={() => setYear(y => y - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-bold w-12 text-center">{year}</span>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-8 w-8"
              onClick={() => setYear(y => y + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <Button
            onClick={openCreateDialog}
            className="gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Nouvel objectif</span>
          </Button>
        </div>
      </motion.div>

      {/* View mode selector */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-1 bg-muted/50 p-1 rounded-full w-fit"
      >
        {[
          { id: "moi", icon: User, label: "Mes objectifs" },
          { id: "couple", icon: Users, label: "Objectifs couple" },
        ].map(mode => (
          <button
            key={mode.id}
            onClick={() => setViewMode(mode.id as typeof viewMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              viewMode === mode.id
                ? "bg-white dark:bg-card shadow-md text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <mode.icon className="h-4 w-4" />
            <span className="hidden sm:inline">{mode.label}</span>
          </button>
        ))}
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-3 gap-3"
      >
        <Card className="border-0 shadow-sm bg-gradient-to-br from-background to-blue-50/30 dark:to-blue-950/20">
          <CardContent className="pt-4 pb-4 px-4 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Total</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-gradient-to-br from-background to-emerald-50/30 dark:to-emerald-950/20">
          <CardContent className="pt-4 pb-4 px-4 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-emerald-600">{stats.atteints}</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Atteints</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-gradient-to-br from-background to-amber-50/30 dark:to-amber-950/20">
          <CardContent className="pt-4 pb-4 px-4 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-amber-600">{stats.enCours}</div>
            <div className="text-xs sm:text-sm text-muted-foreground">En cours</div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Objectifs list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        </div>
      ) : objectifs.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-dashed border-2 bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/10 dark:to-orange-950/10">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center mb-4">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-xl font-bold mb-2">Aucun objectif pour {year}</h2>
              <p className="text-muted-foreground max-w-md mb-4">
                Commencez par définir vos objectifs annuels pour cette année
              </p>
              <Button onClick={openCreateDialog} className="gap-2">
                <Plus className="h-4 w-4" />
                Créer mon premier objectif
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <AnimatePresence>
            {objectifs.map((objectif, index) => {
              const category = getCategoryInfo(objectif.category)
              const status = getStatusInfo(objectif.status)
              const priority = getPriorityInfo(objectif.priority)
              const CategoryIcon = category.icon
              const StatusIcon = status.icon

              return (
                <motion.div
                  key={objectif.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="border-0 shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                    <div className={`h-1 ${category.color}`} />
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        {/* Icon & Title */}
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className={`h-10 w-10 rounded-lg ${category.color} flex items-center justify-center flex-shrink-0`}>
                            <CategoryIcon className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold truncate">{objectif.title}</h3>
                              <Badge variant="outline" className="text-xs">
                                {category.label}
                              </Badge>
                              <div className={`h-2 w-2 rounded-full ${priority.color}`} title={priority.label} />
                            </div>
                            {objectif.description && (
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                                {objectif.description}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Progress & Status */}
                        <div className="flex items-center gap-3 sm:gap-4">
                          {/* Progress bar */}
                          <div className="flex items-center gap-2 min-w-[120px]">
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${objectif.progress}%` }}
                                className={`h-full ${objectif.status === "ATTEINT" ? "bg-emerald-500" : "bg-amber-500"}`}
                              />
                            </div>
                            <span className="text-xs font-medium w-8">{objectif.progress}%</span>
                          </div>

                          {/* Status badge */}
                          <Select
                            value={objectif.status}
                            onValueChange={(value) => handleStatusChange(objectif, value)}
                          >
                            <SelectTrigger className="w-[130px] h-8 text-xs">
                              <div className="flex items-center gap-1.5">
                                <StatusIcon className="h-3 w-3" />
                                <SelectValue />
                              </div>
                            </SelectTrigger>
                            <SelectContent>
                              {STATUS_OPTIONS.map(s => (
                                <SelectItem key={s.id} value={s.id}>
                                  <div className="flex items-center gap-2">
                                    <s.icon className="h-3 w-3" />
                                    {s.label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          {/* Actions */}
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => openEditDialog(objectif)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => handleDelete(objectif.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Progress slider */}
                      {objectif.status === "EN_COURS" && (
                        <div className="mt-3 pt-3 border-t">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={objectif.progress}
                            onChange={(e) => handleProgressChange(objectif, parseInt(e.target.value))}
                            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-amber-500"
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingObjectif ? "Modifier l'objectif" : "Nouvel objectif"}
            </DialogTitle>
            <DialogDescription>
              {editingObjectif
                ? "Modifiez les détails de votre objectif"
                : `Définissez un nouvel objectif pour ${year}`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Ex: Économiser 10 000€"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Décrivez votre objectif en détail..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Catégorie</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>
                        <div className="flex items-center gap-2">
                          <div className={`h-3 w-3 rounded ${cat.color}`} />
                          {cat.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Priorité</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITY_OPTIONS.map(p => (
                      <SelectItem key={p.id} value={p.id}>
                        <div className="flex items-center gap-2">
                          <div className={`h-3 w-3 rounded-full ${p.color}`} />
                          {p.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button
              onClick={editingObjectif ? handleUpdate : handleCreate}
              disabled={isSaving}
              className="gap-2"
            >
              {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
              {editingObjectif ? "Enregistrer" : "Créer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
