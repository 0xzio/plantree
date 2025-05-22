const { PrismaClient } = require('@prisma/client')

async function run() {
  const prisma = new PrismaClient()
  const sites = await prisma.site.findMany()
  for (const item of sites) {
  }
}

async function applyDBPush() {
  console.log(execSync('prisma db push').toString())
}

run()
