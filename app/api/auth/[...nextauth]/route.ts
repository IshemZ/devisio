import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

/**
 * NextAuth API Route Handler
 *
 * This route handles all NextAuth authentication requests:
 * - /api/auth/signin
 * - /api/auth/signout
 * - /api/auth/callback/[provider]
 * - /api/auth/session
 * - etc.
 *
 * Configuration is imported from lib/auth.ts
 */

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
