import { neon } from "@neondatabase/serverless"

const connectionString = "postgresql://neondb_owner:npg_z8N0rfBFgUSV@ep-divine-base-ad1b2pp2-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"

const sql = neon(connectionString)

async function main() {
  console.log("Suppression des anciennes tables...")

  // Supprimer toutes les tables existantes
  await sql`DROP TABLE IF EXISTS "Milestone" CASCADE`
  await sql`DROP TABLE IF EXISTS "Objectif" CASCADE`
  await sql`DROP TABLE IF EXISTS "BilanCategory" CASCADE`
  await sql`DROP TABLE IF EXISTS "Bilan" CASCADE`
  await sql`DROP TABLE IF EXISTS "BilanEntry" CASCADE`
  await sql`DROP TABLE IF EXISTS "BilanMensuel" CASCADE`
  await sql`DROP TABLE IF EXISTS "BilanCoupleEntry" CASCADE`
  await sql`DROP TABLE IF EXISTS "BilanCouple" CASCADE`
  await sql`DROP TABLE IF EXISTS "User" CASCADE`
  await sql`DROP TABLE IF EXISTS "Couple" CASCADE`
  await sql`DROP TYPE IF EXISTS "CategoryType" CASCADE`
  await sql`DROP TYPE IF EXISTS "ObjectifType" CASCADE`
  await sql`DROP TYPE IF EXISTS "TermType" CASCADE`

  console.log("Tables supprimées !")
}

main().catch(console.error)
