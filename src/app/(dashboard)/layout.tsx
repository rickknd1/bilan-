import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Heart, LayoutDashboard, Target, FileText, Users, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BottomNavBar } from "@/components/ui/bottom-nav-bar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar - Hidden on mobile */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-card hidden lg:block">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center gap-2 border-b px-6 py-4">
            <Heart className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold">Bilan Couple</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            <Link href="/dashboard">
              <Button variant="ghost" className="w-full justify-start gap-3">
                <LayoutDashboard className="h-4 w-4" />
                Tableau de bord
              </Button>
            </Link>
            <Link href="/bilan">
              <Button variant="ghost" className="w-full justify-start gap-3">
                <FileText className="h-4 w-4" />
                Bilan Mensuel
              </Button>
            </Link>
            <Link href="/objectifs">
              <Button variant="ghost" className="w-full justify-start gap-3">
                <Target className="h-4 w-4" />
                Objectifs
              </Button>
            </Link>
            <Link href="/couple">
              <Button variant="ghost" className="w-full justify-start gap-3">
                <Users className="h-4 w-4" />
                Notre Couple
              </Button>
            </Link>
          </nav>

          {/* User */}
          <div className="border-t p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-medium text-primary">
                  {session.user.name?.[0] || "U"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{session.user.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {session.user.email}
                </p>
              </div>
            </div>
            <form action="/api/auth/signout" method="POST">
              <Button variant="outline" size="sm" className="w-full gap-2">
                <LogOut className="h-4 w-4" />
                Deconnexion
              </Button>
            </form>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 z-30 lg:hidden bg-card border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            <span className="font-bold">Bilan Couple</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xs font-medium text-primary">
                {session.user.name?.[0] || "U"}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="lg:pl-64 pt-14 lg:pt-0 pb-20 lg:pb-0">
        <div className="container py-6 lg:py-8">{children}</div>
      </main>

      {/* Bottom Navigation - Mobile only */}
      <div className="lg:hidden">
        <BottomNavBar />
      </div>
    </div>
  )
}
