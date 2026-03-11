import { PrismaClient } from "@prisma/client"

declare global {
  var prisma: PrismaClient | undefined
}

export const prisma = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  // Added connection pooling configuration for better performance on Vercel serverless functions
  pool: {
    min: 2,
    max: 10,
  },
})

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma
}