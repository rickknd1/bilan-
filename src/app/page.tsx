import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart, Star, Target, Users } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-love/5">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Heart className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold">Bilan Couple</span>
        </div>
        <div className="flex gap-4">
          <Link href="/login">
            <Button variant="ghost">Connexion</Button>
          </Link>
          <Link href="/register">
            <Button>Commencer</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="container mx-auto px-4 py-20">
        <div className="text-center max-w-3xl mx-auto space-y-8">
          <h1 className="text-5xl font-bold tracking-tight">
            Planifiez votre avenir{" "}
            <span className="text-primary">ensemble</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Faites le bilan de votre annee, definissez vos objectifs communs et
            celebrez vos reussites. Une application pensee pour les couples qui
            veulent grandir ensemble.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="text-lg px-8">
                Creer notre espace
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Se connecter
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-24">
          <div className="text-center p-8 rounded-2xl bg-card shadow-lg">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Bilan Annuel</h3>
            <p className="text-muted-foreground">
              Analysez vos reussites et apprentissages dans chaque domaine de
              votre vie.
            </p>
          </div>

          <div className="text-center p-8 rounded-2xl bg-card shadow-lg">
            <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-amber-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Objectifs Partages</h3>
            <p className="text-muted-foreground">
              Definissez et suivez vos objectifs personnels et communs avec
              votre partenaire.
            </p>
          </div>

          <div className="text-center p-8 rounded-2xl bg-card shadow-lg">
            <div className="w-16 h-16 bg-pink-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-pink-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Espace Couple</h3>
            <p className="text-muted-foreground">
              Partagez tout avec votre partenaire dans un espace securise et
              prive.
            </p>
          </div>
        </div>

        {/* Categories */}
        <div className="mt-24 text-center">
          <h2 className="text-3xl font-bold mb-8">
            7 domaines de vie a explorer
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { label: "Finances", color: "bg-emerald-500" },
              { label: "Sante & Sport", color: "bg-red-500" },
              { label: "Projets de Vie", color: "bg-violet-500" },
              { label: "Carriere", color: "bg-blue-500" },
              { label: "Spiritualite", color: "bg-amber-500" },
              { label: "Developpement", color: "bg-pink-500" },
              { label: "Loisirs", color: "bg-cyan-500" },
            ].map((cat) => (
              <span
                key={cat.label}
                className={`${cat.color} text-white px-4 py-2 rounded-full text-sm font-medium`}
              >
                {cat.label}
              </span>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-20 border-t text-center text-muted-foreground">
        <p>Fait avec amour pour finir 2024 en beaute</p>
      </footer>
    </div>
  )
}
