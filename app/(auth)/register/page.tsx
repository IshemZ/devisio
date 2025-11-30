import { Metadata } from 'next'
import RegisterForm from '@/components/auth/RegisterForm'

export const metadata: Metadata = {
  title: 'Register | Devisio',
  description: 'Create your Devisio account',
}

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Devisio
          </h1>
          <p className="mt-2 text-sm text-foreground/60">
            Create your account
          </p>
        </div>

        <RegisterForm />

        <p className="text-center text-sm text-foreground/60">
          Already have an account?{' '}
          <a
            href="/login"
            className="font-medium text-foreground hover:underline"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  )
}
