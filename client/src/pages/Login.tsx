import { useLogin } from "@/api/auth/use-login"
import { loginSchema, type LoginFormData } from "@/schema/login-schema"

import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft } from "lucide-react"
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import Field from "@/components/field"

export default function Login() {
  const { handleLogin, loginIsPending, loginError } = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center p-4">
      <Link
        to="/"
        className="absolute top-4 left-4 flex w-max items-center gap-1"
      >
        <ArrowLeft size={16} />
        Back
      </Link>

      <form
        onSubmit={handleSubmit(handleLogin)}
        className="w-full max-w-sm space-y-6 bg-background"
      >
        <div className="space-y-4 text-center">
          <div className="flex justify-center">
            <Logo size="lg" />
          </div>

          <div className="space-y-1">
            <h1 className="text-xl font-bold tracking-tight">
              Log in to your account
            </h1>

            <p className="text-sm text-muted-foreground">
              Enter your email and password below
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Field
            id="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            register={register("email")}
            error={errors.email?.message}
          />

          <Field
            id="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            register={register("password")}
            error={errors.password?.message}
          />
        </div>

        {loginError && (
          <div className="border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
            {loginError.message}
          </div>
        )}

        <Button type="submit" className="w-full" disabled={loginIsPending}>
          {loginIsPending && <Spinner />}
          Login
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            to="/auth/register"
            className="font-medium text-primary hover:underline"
          >
            Sign up
          </Link>
        </p>
      </form>
    </div>
  )
}
