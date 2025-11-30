import { Metadata } from 'next'
import LoginForm from '@/components/auth/LoginForm'

export const metadata: Metadata = {
  title: 'Login | Devisio',
  description: 'Login to your Devisio account',
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Devisio
          </h1>
          <p className="mt-2 text-sm text-foreground/60">
            Sign in to your account
          </p>
        </div>

        <LoginForm />

        <p className="text-center text-sm text-foreground/60">
          Don&apos;t have an account?{' '}
          <a
            href="/register"
            className="font-medium text-foreground hover:underline"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  )
}
