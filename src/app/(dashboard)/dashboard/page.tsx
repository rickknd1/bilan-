"use client"

import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Target, Star, TrendingUp, Plus, Heart, FileText, Users, Calendar } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const firstName = session?.user?.name?.split(" ")[0] || "vous"
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().toLocaleDateString("fr-FR", { month: "long" })

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 lg:space-y-8"
    >
      {/* Welcome */}
      <motion.div variants={item} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
            Bonjour, {firstName} !
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Voici un apercu de vos objectifs et progression.
          </p>
        </div>
        <Link href="/objectifs">
          <Button className="gap-2 bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Nouvel objectif</span>
            <span className="sm:hidden">Objectif</span>
          </Button>
        </Link>
      </motion.div>

      {/* Stats */}
      <motion.div variants={item} className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-md bg-gradient-to-br from-background to-emerald-50/30 dark:to-emerald-950/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Objectifs</CardTitle>
            <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <Target className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold">0</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground">Personnels et communs</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-background to-amber-50/30 dark:to-amber-950/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs sm:text-sm font-medium">Atteints</CardTitle>
            <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Star className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold">0</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground">Cette annee</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-background to-blue-50/30 dark:to-blue-950/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs sm:text-sm font-medium">En Cours</CardTitle>
            <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold">0</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground">En progression</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-background to-pink-50/30 dark:to-pink-950/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs sm:text-sm font-medium">Couple</CardTitle>
            <div className="h-8 w-8 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
              <Heart className="h-4 w-4 text-pink-600 dark:text-pink-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold">-</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              Non configure
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={item} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow group">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-pink-500 to-violet-500 flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-base sm:text-lg">Bilan {currentMonth}</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Faites votre bilan mensuel
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Link href="/bilan">
              <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                Commencer mon bilan
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow group">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Target className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-base sm:text-lg">Objectifs {currentYear}</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Definissez vos objectifs
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Link href="/objectifs">
              <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                Gerer mes objectifs
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow group sm:col-span-2 lg:col-span-1">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-base sm:text-lg">Espace Couple</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Partagez vos objectifs
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Link href="/couple">
              <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                Configurer
              </Button>
            </Link>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Activity */}
      <motion.div variants={item}>
        <Card className="border-0 shadow-md">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle>Activite Recente</CardTitle>
                <CardDescription>
                  Vos derniers objectifs et jalons
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 sm:py-12 text-muted-foreground">
              <div className="h-16 w-16 sm:h-20 sm:w-20 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
                <Target className="h-8 w-8 sm:h-10 sm:w-10 opacity-50" />
              </div>
              <p className="font-medium">Aucune activite pour le moment</p>
              <p className="text-xs sm:text-sm mt-1">Creez votre premier objectif pour commencer !</p>
              <Link href="/objectifs" className="inline-block mt-4">
                <Button variant="outline" size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Creer un objectif
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
