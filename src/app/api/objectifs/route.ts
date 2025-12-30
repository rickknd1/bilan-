import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET - Récupérer les objectifs annuels
export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const year = parseInt(searchParams.get("year") || new Date().getFullYear().toString())
  const type = searchParams.get("type") || "moi" // moi, couple

  try {
    if (type === "couple") {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { coupleId: true }
      })

      if (!user?.coupleId) {
        return NextResponse.json({ objectifs: [] })
      }

      const objectifs = await prisma.objectifAnnuelCouple.findMany({
        where: {
          coupleId: user.coupleId,
          year
        },
        orderBy: [
          { priority: "desc" },
          { createdAt: "desc" }
        ]
      })

      return NextResponse.json({ objectifs })
    } else {
      const objectifs = await prisma.objectifAnnuel.findMany({
        where: {
          userId: session.user.id,
          year
        },
        orderBy: [
          { priority: "desc" },
          { createdAt: "desc" }
        ]
      })

      return NextResponse.json({ objectifs })
    }
  } catch (error) {
    console.error("Erreur GET objectifs:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

// POST - Créer un objectif annuel
export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  try {
    const { year, title, description, category, priority, type } = await request.json()

    if (!title || !category) {
      return NextResponse.json({ error: "Titre et catégorie requis" }, { status: 400 })
    }

    if (type === "couple") {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { coupleId: true }
      })

      if (!user?.coupleId) {
        return NextResponse.json({ error: "Pas de couple" }, { status: 400 })
      }

      const objectif = await prisma.objectifAnnuelCouple.create({
        data: {
          year: year || new Date().getFullYear(),
          title,
          description: description || "",
          category,
          priority: priority || "MEDIUM",
          coupleId: user.coupleId
        }
      })

      return NextResponse.json({ objectif })
    } else {
      const objectif = await prisma.objectifAnnuel.create({
        data: {
          year: year || new Date().getFullYear(),
          title,
          description: description || "",
          category,
          priority: priority || "MEDIUM",
          userId: session.user.id
        }
      })

      return NextResponse.json({ objectif })
    }
  } catch (error) {
    console.error("Erreur POST objectif:", error)
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue"
    return NextResponse.json({ error: "Erreur serveur", details: errorMessage }, { status: 500 })
  }
}

// PUT - Mettre à jour un objectif
export async function PUT(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  try {
    const { id, title, description, category, status, progress, priority, type } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "ID requis" }, { status: 400 })
    }

    if (type === "couple") {
      const objectif = await prisma.objectifAnnuelCouple.update({
        where: { id },
        data: {
          ...(title && { title }),
          ...(description !== undefined && { description }),
          ...(category && { category }),
          ...(status && { status }),
          ...(progress !== undefined && { progress }),
          ...(priority && { priority })
        }
      })

      return NextResponse.json({ objectif })
    } else {
      // Vérifier que l'objectif appartient à l'utilisateur
      const existing = await prisma.objectifAnnuel.findFirst({
        where: { id, userId: session.user.id }
      })

      if (!existing) {
        return NextResponse.json({ error: "Objectif non trouvé" }, { status: 404 })
      }

      const objectif = await prisma.objectifAnnuel.update({
        where: { id },
        data: {
          ...(title && { title }),
          ...(description !== undefined && { description }),
          ...(category && { category }),
          ...(status && { status }),
          ...(progress !== undefined && { progress }),
          ...(priority && { priority })
        }
      })

      return NextResponse.json({ objectif })
    }
  } catch (error) {
    console.error("Erreur PUT objectif:", error)
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue"
    return NextResponse.json({ error: "Erreur serveur", details: errorMessage }, { status: 500 })
  }
}

// DELETE - Supprimer un objectif
export async function DELETE(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const type = searchParams.get("type") || "moi"

    if (!id) {
      return NextResponse.json({ error: "ID requis" }, { status: 400 })
    }

    if (type === "couple") {
      await prisma.objectifAnnuelCouple.delete({
        where: { id }
      })
    } else {
      // Vérifier que l'objectif appartient à l'utilisateur
      const existing = await prisma.objectifAnnuel.findFirst({
        where: { id, userId: session.user.id }
      })

      if (!existing) {
        return NextResponse.json({ error: "Objectif non trouvé" }, { status: 404 })
      }

      await prisma.objectifAnnuel.delete({
        where: { id }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erreur DELETE objectif:", error)
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue"
    return NextResponse.json({ error: "Erreur serveur", details: errorMessage }, { status: 500 })
  }
}
