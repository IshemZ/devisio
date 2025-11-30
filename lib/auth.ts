import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import prisma from './prisma'
import bcrypt from 'bcryptjs'

/**
 * NextAuth configuration
 *
 * This file contains all NextAuth settings including:
 * - Authentication providers (Credentials, Google OAuth)
 * - Session strategy
 * - Callbacks for JWT and session handling
 */

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    // Email/Password authentication
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required')
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user || !user.password) {
          throw new Error('Invalid credentials')
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          throw new Error('Invalid credentials')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        }
      }
    }),

    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],

  // Use JWT strategy for sessions
  session: {
    strategy: 'jwt',
  },

  // Custom pages
  pages: {
    signIn: '/login',
    error: '/login', // Error code passed in query string as ?error=
  },

  // Callbacks
  callbacks: {
    async signIn({ user, account }) {
      // For Google OAuth, check if Business exists, create if not
      if (account?.provider === 'google' && user.id) {
        const existingBusiness = await prisma.business.findUnique({
          where: { userId: user.id }
        })

        if (!existingBusiness) {
          await prisma.business.create({
            data: {
              name: `Institut de ${user.name || 'beauté'}`,
              userId: user.id,
              email: user.email || undefined,
            }
          })
        }
      }

      return true
    },

    async jwt({ token, user, account }) {
      // Initial sign in
      if (user) {
        token.id = user.id
      }

      // OAuth sign in
      if (account?.provider === 'google') {
        token.provider = 'google'
      }

      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },

  // Enable debug messages in development
  debug: process.env.NODE_ENV === 'development',

  // Secret for JWT encryption
  secret: process.env.NEXTAUTH_SECRET,
}
