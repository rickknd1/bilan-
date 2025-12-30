"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Users, Copy, Check, Sparkles } from "lucide-react"
import { useState } from "react"

export default function CouplePage() {
  const [copied, setCopied] = useState(false)
  const inviteCode = "LOVE2024" // TODO: fetch from API

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
          Notre Couple
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Gérez votre espace couple et partagez vos bilans
        </p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Partner card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="h-full bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20 border-pink-200 dark:border-pink-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-pink-500" />
                Partenaire
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 p-4 bg-white dark:bg-zinc-900 rounded-xl">
                <div className="h-16 w-16 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center text-white text-2xl font-bold">
                  M
                </div>
                <div>
                  <p className="font-semibold text-lg">Michelle</p>
                  <p className="text-sm text-muted-foreground">michelle@bilan.com</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                    <span className="text-xs text-green-600">Connectée</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Invite card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-violet-500" />
                Code d&apos;invitation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Partagez ce code avec votre partenaire pour qu&apos;il/elle rejoigne votre espace couple.
              </p>

              <div className="flex items-center gap-2">
                <div className="flex-1 px-4 py-3 bg-muted rounded-lg font-mono text-lg text-center tracking-widest">
                  {inviteCode}
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCopy}
                    className="h-12 w-12"
                  >
                    {copied ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <Copy className="h-5 w-5" />
                    )}
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Stats card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-gradient-to-r from-violet-500 to-purple-600 text-white border-0">
          <CardContent className="py-8">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Sparkles className="h-6 w-6" />
              <h3 className="text-xl font-bold">Votre progression ensemble</h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { label: "Mois ensemble", value: "12" },
                { label: "Bilans complétés", value: "8" },
                { label: "Objectifs atteints", value: "15" },
                { label: "Points forts", value: "24" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="p-4 bg-white/10 rounded-xl backdrop-blur-sm"
                >
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-sm text-white/80">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
