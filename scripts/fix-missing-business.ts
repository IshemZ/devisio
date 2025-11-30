/**
 * Script to fix users without Business records
 *
 * This script finds all users without an associated Business record
 * and creates a default Business for them.
 *
 * Run with: npx tsx scripts/fix-missing-business.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL
    }
  }
})

async function fixMissingBusiness() {
  console.log('🔍 Checking for users without Business records...\n')

  // Find all users without a business
  const usersWithoutBusiness = await prisma.user.findMany({
    where: {
      business: null
    },
    select: {
      id: true,
      name: true,
      email: true,
    }
  })

  if (usersWithoutBusiness.length === 0) {
    console.log('✅ All users have Business records. Nothing to fix.')
    return
  }

  console.log(`Found ${usersWithoutBusiness.length} user(s) without Business records:\n`)

  for (const user of usersWithoutBusiness) {
    console.log(`📝 User: ${user.name || 'Unknown'} (${user.email})`)
  }

  console.log('\n🔧 Creating Business records...\n')

  // Create Business records for each user
  for (const user of usersWithoutBusiness) {
    try {
      const business = await prisma.business.create({
        data: {
          name: `Institut de ${user.name || 'beauté'}`,
          userId: user.id,
          email: user.email || undefined,
        }
      })

      console.log(`✅ Created Business "${business.name}" for ${user.email}`)
    } catch (error) {
      console.error(`❌ Failed to create Business for ${user.email}:`, error)
    }
  }

  console.log('\n✨ Done!')
}

fixMissingBusiness()
  .catch((error) => {
    console.error('Error:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
