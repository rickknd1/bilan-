import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"

const connectionString = "postgresql://neondb_owner:npg_z8N0rfBFgUSV@ep-divine-base-ad1b2pp2-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"

const sql = neon(connectionString)

async function main() {
  console.log("Création des utilisateurs...")

  const rickPassword = await bcrypt.hash("rick2024", 12)
  const michellePassword = await bcrypt.hash("michelle2024", 12)

  // Créer le couple d'abord
  const couple = await sql`
    INSERT INTO "Couple" (id, "inviteCode", name, "createdAt", "updatedAt")
    VALUES ('couple001', 'LOVE2024', 'Rick & Michelle', NOW(), NOW())
    RETURNING id
  `
  console.log("Couple créé:", couple[0].id)

  // Créer Rick
  await sql`
    INSERT INTO "User" (id, email, password, "firstName", "lastName", "coupleId", "createdAt", "updatedAt")
    VALUES ('rick001', 'rick@bilan.com', ${rickPassword}, 'Rick', 'Dylan', 'couple001', NOW(), NOW())
  `
  console.log("Rick créé: rick001")

  // Créer Michelle
  await sql`
    INSERT INTO "User" (id, email, password, "firstName", "lastName", "coupleId", "createdAt", "updatedAt")
    VALUES ('michelle001', 'michelle@bilan.com', ${michellePassword}, 'Michelle', 'Kendem', 'couple001', NOW(), NOW())
  `
  console.log("Michelle créée: michelle001")

  console.log("")
  console.log("=== COMPTES ===")
  console.log("Rick: rick@bilan.com / rick2024")
  console.log("Michelle: michelle@bilan.com / michelle2024")
  console.log("Couple ID: couple001")
}

main().catch(console.error)
