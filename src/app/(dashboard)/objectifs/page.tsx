"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Target, Plus, Rocket } from "lucide-react"
import Link from "next/link"

export default function ObjectifsPage() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
            Objectifs
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Définissez et suivez vos objectifs personnels et de couple
          </p>
        </div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button className="gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
            <Plus className="h-4 w-4" />
            Nouvel objectif
          </Button>
        </motion.div>
      </motion.div>

      {/* Coming soon card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-dashed border-2 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="h-20 w-20 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center mb-6">
                <Rocket className="h-10 w-10 text-white" />
              </div>
            </motion.div>

            <h2 className="text-2xl font-bold mb-2">Bientôt disponible !</h2>
            <p className="text-muted-foreground max-w-md mb-6">
              La gestion des objectifs arrive bientôt. En attendant, utilisez le
              <Link href="/bilan" className="text-amber-600 hover:underline mx-1">
                Bilan Mensuel
              </Link>
              pour définir vos objectifs mois par mois.
            </p>

            <div className="flex flex-wrap gap-3 justify-center">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-zinc-800 shadow-sm">
                <Target className="h-4 w-4 text-amber-500" />
                <span className="text-sm">Objectifs personnels</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-zinc-800 shadow-sm">
                <Target className="h-4 w-4 text-pink-500" />
                <span className="text-sm">Objectifs couple</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-zinc-800 shadow-sm">
                <Target className="h-4 w-4 text-violet-500" />
                <span className="text-sm">Suivi de progression</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
