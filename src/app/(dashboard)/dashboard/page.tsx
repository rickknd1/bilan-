import { auth } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Target, Star, TrendingUp, Plus, Heart } from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const session = await auth()
  const firstName = session?.user?.name?.split(" ")[0] || "vous"

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bonjour, {firstName} !</h1>
          <p className="text-muted-foreground">
            Voici un apercu de vos objectifs et progression.
          </p>
        </div>
        <Link href="/objectifs/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nouvel objectif
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Objectifs</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Personnels et communs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Objectifs Atteints</CardTitle>
            <Star className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Cette annee</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">En Cours</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">En progression</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Couple</CardTitle>
            <Heart className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">
              {session?.user?.coupleId ? "Connecte" : "Non configure"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Bilan 2024</CardTitle>
            <CardDescription>
              Faites le point sur votre annee dans chaque domaine de vie.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/bilan/2024">
              <Button variant="outline" className="w-full">
                Commencer mon bilan
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Espace Couple</CardTitle>
            <CardDescription>
              {session?.user?.coupleId
                ? "Accedez a votre espace partage"
                : "Creez ou rejoignez un espace couple pour partager vos objectifs."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/couple">
              <Button variant="outline" className="w-full">
                {session?.user?.coupleId ? "Voir notre espace" : "Configurer"}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Activite Recente</CardTitle>
          <CardDescription>
            Vos derniers objectifs et jalons.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucune activite pour le moment.</p>
            <p className="text-sm">Creez votre premier objectif pour commencer !</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
