import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"

const connectionString = "postgresql://neondb_owner:npg_z8N0rfBFgUSV@ep-divine-base-ad1b2pp2-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"

const sql = neon(connectionString)

async function main() {
  // Récupérer les utilisateurs
  const users = await sql`SELECT id, email, password, "firstName" FROM "User"`

  console.log("=== UTILISATEURS EN BASE ===")
  for (const user of users) {
    console.log(`\nID: ${user.id}`)
    console.log(`Email: ${user.email}`)
    console.log(`Prénom: ${user.firstName}`)
    console.log(`Password hash: ${user.password.substring(0, 20)}...`)

    // Tester le mot de passe
    const testPassword = user.email === "rick@bilan.com" ? "rick2024" : "michelle2024"
    const isValid = await bcrypt.compare(testPassword, user.password)
    console.log(`Test "${testPassword}": ${isValid ? "✓ VALIDE" : "✗ INVALIDE"}`)
  }
}

main().catch(console.error)
