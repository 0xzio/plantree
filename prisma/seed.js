const { PrismaClient } = require('@prisma/client')

async function run() {
  const prisma = new PrismaClient()
  const post = await prisma.post.findMany({
    where: {
      publishedAt: {
        not: null,
      },
      status: {
        not: 'PUBLISHED',
      },
    },
  })
  console.log('=====sites:', post.length)
  for (const item of post) {
    await await prisma.post.update({
      where: { id: item.id },
      data: {
        status: 'PUBLISHED',
      },
    })
    console.log('id============:', item.id)
  }
}

async function applyDBPush() {
  console.log(execSync('prisma db push').toString())
}

run()
