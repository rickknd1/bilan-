import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET - Récupérer un bilan
export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const year = parseInt(searchParams.get("year") || "")
  const month = parseInt(searchParams.get("month") || "")
  const type = searchParams.get("type") || "moi" // moi, partenaire, couple

  if (isNaN(year) || isNaN(month)) {
    return NextResponse.json({ error: "Année et mois requis" }, { status: 400 })
  }

  try {
    if (type === "couple") {
      // Bilan couple
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { coupleId: true }
      })

      if (!user?.coupleId) {
        return NextResponse.json({ entries: [] })
      }

      const bilan = await prisma.bilanCouple.findUnique({
        where: {
          coupleId_year_month: {
            coupleId: user.coupleId,
            year,
            month
          }
        },
        include: { entries: true }
      })

      return NextResponse.json({ bilan })

    } else if (type === "partenaire") {
      // Bilan du partenaire
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
          couple: {
            include: {
              users: {
                where: { id: { not: session.user.id } }
              }
            }
          }
        }
      })

      const partnerId = user?.couple?.users[0]?.id
      if (!partnerId) {
        return NextResponse.json({ entries: [] })
      }

      const bilan = await prisma.bilanMensuel.findUnique({
        where: {
          userId_year_month: {
            userId: partnerId,
            year,
            month
          }
        },
        include: { entries: true }
      })

      return NextResponse.json({ bilan })

    } else {
      // Mon bilan
      const bilan = await prisma.bilanMensuel.findUnique({
        where: {
          userId_year_month: {
            userId: session.user.id,
            year,
            month
          }
        },
        include: { entries: true }
      })

      return NextResponse.json({ bilan })
    }

  } catch (error) {
    console.error("Erreur GET bilan:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

// POST - Sauvegarder un bilan
export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  try {
    const { year, month, type, entries } = await request.json()

    if (type === "couple") {
      // Sauvegarder bilan couple
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { coupleId: true }
      })

      if (!user?.coupleId) {
        return NextResponse.json({ error: "Pas de couple" }, { status: 400 })
      }

      // Upsert le bilan
      const bilan = await prisma.bilanCouple.upsert({
        where: {
          coupleId_year_month: {
            coupleId: user.coupleId,
            year,
            month
          }
        },
        create: {
          coupleId: user.coupleId,
          year,
          month
        },
        update: {}
      })

      // Upsert les entrées
      for (const entry of entries) {
        await prisma.bilanCoupleEntry.upsert({
          where: {
            bilanId_category: {
              bilanId: bilan.id,
              category: entry.category
            }
          },
          create: {
            bilanId: bilan.id,
            category: entry.category,
            objectif: entry.objectif || "",
            realise: entry.realise || "",
            pointsForts: entry.pointsForts || "",
            pointsAmeliorer: entry.pointsAmeliorer || ""
          },
          update: {
            objectif: entry.objectif || "",
            realise: entry.realise || "",
            pointsForts: entry.pointsForts || "",
            pointsAmeliorer: entry.pointsAmeliorer || ""
          }
        })
      }

      return NextResponse.json({ success: true })

    } else {
      // Sauvegarder mon bilan
      const bilan = await prisma.bilanMensuel.upsert({
        where: {
          userId_year_month: {
            userId: session.user.id,
            year,
            month
          }
        },
        create: {
          userId: session.user.id,
          year,
          month
        },
        update: {}
      })

      // Upsert les entrées
      for (const entry of entries) {
        await prisma.bilanEntry.upsert({
          where: {
            bilanId_category: {
              bilanId: bilan.id,
              category: entry.category
            }
          },
          create: {
            bilanId: bilan.id,
            category: entry.category,
            objectif: entry.objectif || "",
            realise: entry.realise || "",
            pointsForts: entry.pointsForts || "",
            pointsAmeliorer: entry.pointsAmeliorer || ""
          },
          update: {
            objectif: entry.objectif || "",
            realise: entry.realise || "",
            pointsForts: entry.pointsForts || "",
            pointsAmeliorer: entry.pointsAmeliorer || ""
          }
        })
      }

      return NextResponse.json({ success: true })
    }

  } catch (error) {
    console.error("Erreur POST bilan:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
