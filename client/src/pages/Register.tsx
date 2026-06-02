import { useRegister } from "@/api/auth/use-register"
import { registerSchema, type RegisterFormData } from "@/schema/register-schema"

import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import Field from "@/components/field"

import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft } from "lucide-react"
import { useForm } from "react-hook-form"
import { Link, useLocation } from "react-router-dom"

export default function Register() {
  const { handleRegister, registerIsPending, registerError } = useRegister()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const location = useLocation()
  const from = location.state || "/"

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center p-4">
      <Link
        to={from}
        className="absolute top-4 left-4 flex w-max items-center gap-1"
      >
        <ArrowLeft size={16} />
        Back
      </Link>

      <form
        onSubmit={handleSubmit(handleRegister)}
        className="w-full max-w-sm space-y-6 bg-background"
      >
        <div className="space-y-4 text-center">
          <div className="flex justify-center">
            <Logo size="lg" />
          </div>

          <div className="space-y-1">
            <h1 className="text-xl font-bold tracking-tight">
              Create an account
            </h1>

            <p className="text-sm text-muted-foreground">
              Enter your information below
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Field
            id="name"
            label="Name"
            type="text"
            placeholder="John Doe"
            register={register("name")}
            error={errors.name?.message}
          />

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
            placeholder="Create a password"
            register={register("password")}
            error={errors.password?.message}
          />

          <Field
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            register={register("confirmPassword")}
            error={errors.confirmPassword?.message}
          />
        </div>

        {registerError && (
          <div className="border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
            {registerError.message}
          </div>
        )}

        <Button type="submit" className="w-full" disabled={registerIsPending}>
          {registerIsPending && <Spinner />}
          Register
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            to="/auth/login"
            className="font-medium text-primary hover:underline"
            state={from}
          >
            Log in
          </Link>
        </p>
      </form>
    </div>
  )
}
