import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { neon } from "@neondatabase/serverless"
import { PrismaNeon } from "@prisma/adapter-neon"
import bcrypt from "bcryptjs"

async function main() {
  // Direct connection for seed script
  const connectionString = "postgresql://neondb_owner:npg_z8N0rfBFgUSV@ep-divine-base-ad1b2pp2-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"

  console.log("Connecting to database...")
  const sql = neon(connectionString)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const adapter = new PrismaNeon(sql as any)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const prisma = new PrismaClient({ adapter } as any)

  // Créer Rick
  const rickPassword = await bcrypt.hash("rick2024", 12)
  const rick = await prisma.user.create({
    data: {
      email: "rick@bilan.com",
      password: rickPassword,
      firstName: "Rick",
      lastName: "Dylan",
    },
  })
  console.log("Rick créé:", rick.id)

  // Créer Michelle
  const michellePassword = await bcrypt.hash("michelle2024", 12)
  const michelle = await prisma.user.create({
    data: {
      email: "michelle@bilan.com",
      password: michellePassword,
      firstName: "Michelle",
      lastName: "Kendem",
    },
  })
  console.log("Michelle créée:", michelle.id)

  // Créer le couple
  const couple = await prisma.couple.create({
    data: {
      inviteCode: "LOVE2024",
      name: "Rick & Michelle",
    },
  })

  // Lier les deux au couple
  await prisma.user.update({
    where: { id: rick.id },
    data: { coupleId: couple.id },
  })
  await prisma.user.update({
    where: { id: michelle.id },
    data: { coupleId: couple.id },
  })

  console.log("Couple créé:", couple.id)
  console.log("")
  console.log("=== COMPTES CRÉÉS ===")
  console.log("Rick: rick@bilan.com / rick2024 - ID:", rick.id)
  console.log("Michelle: michelle@bilan.com / michelle2024 - ID:", michelle.id)
  console.log("Couple ID:", couple.id)

  await prisma.$disconnect()
}

main().catch(console.error)
