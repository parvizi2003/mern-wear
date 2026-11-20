import { Link } from "react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"

import { Logo } from "@/components/logo"
import { loginSchema, type LoginFormData } from "@/lib/validations/auth"
import { useLogin } from "@/api/auth/login"
import Container from "@/components/container"
import { ArrowLeft } from "lucide-react"

export const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const loginMutation = useLogin()

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data)
  }

  return (
    <Container>
      <div className="relative flex min-h-svh items-center justify-center">
        <Link
          to={"/"}
          className="absolute top-4 left-0 flex w-max items-center gap-1"
        >
          <ArrowLeft size={16} />
          Back
        </Link>
        <div className="w-full max-w-sm space-y-8">
          <div className="space-y-3 text-center">
            <Logo size="lg" />
            <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-sm text-muted-foreground">
              Sign in to your account
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="string"
                placeholder="you@example.com"
                autoComplete="email"
                aria-invalid={!!errors.email}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            {loginMutation.error && (
              <p className="text-sm text-destructive">
                {loginMutation.error.message}
              </p>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? <Spinner /> : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              to="/auth/register"
              className="font-medium text-foreground underline underline-offset-4"
            >
              Create account
            </Link>
          </p>
        </div>
      </div>
    </Container>
  )
}
