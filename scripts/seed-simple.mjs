import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"

const connectionString = "postgresql://neondb_owner:npg_z8N0rfBFgUSV@ep-divine-base-ad1b2pp2-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"

const sql = neon(connectionString)

async function main() {
  console.log("Connecting to database...")

  const rickPassword = await bcrypt.hash("rick2024", 12)
  const michellePassword = await bcrypt.hash("michelle2024", 12)

  // Vérifier si Rick existe déjà
  const existingRick = await sql`SELECT id FROM "User" WHERE email = 'rick@bilan.com'`
  let rickId
  if (existingRick.length > 0) {
    rickId = existingRick[0].id
    console.log("Rick existe déjà:", rickId)
  } else {
    const rick = await sql`INSERT INTO "User" (id, email, password, "firstName", "lastName", "createdAt", "updatedAt")
                           VALUES (gen_random_uuid()::text, 'rick@bilan.com', ${rickPassword}, 'Rick', 'Dylan', NOW(), NOW())
                           RETURNING id`
    rickId = rick[0].id
    console.log("Rick créé:", rickId)
  }

  // Vérifier si Michelle existe déjà
  const existingMichelle = await sql`SELECT id FROM "User" WHERE email = 'michelle@bilan.com'`
  let michelleId
  if (existingMichelle.length > 0) {
    michelleId = existingMichelle[0].id
    console.log("Michelle existe déjà:", michelleId)
  } else {
    const michelle = await sql`INSERT INTO "User" (id, email, password, "firstName", "lastName", "createdAt", "updatedAt")
                               VALUES (gen_random_uuid()::text, 'michelle@bilan.com', ${michellePassword}, 'Michelle', 'Kendem', NOW(), NOW())
                               RETURNING id`
    michelleId = michelle[0].id
    console.log("Michelle créée:", michelleId)
  }

  console.log("")
  console.log("=== COMPTES ===")
  console.log("Rick: rick@bilan.com / rick2024 - ID:", rickId)
  console.log("Michelle: michelle@bilan.com / michelle2024 - ID:", michelleId)
}

main().catch(console.error)
