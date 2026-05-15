import { useLogin } from "@/api/auth/use-login"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { loginSchema, type LoginFormData } from "@/schema/login-schema"
import { Spinner } from "@/components/ui/spinner"

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

  const onSubmit = (data: LoginFormData) => {
    handleLogin(data)
  }

  return (
    <div className="flex h-svh items-center justify-center p-4">
      <form
        className="flex w-full max-w-sm flex-col gap-4 border bg-card p-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex justify-center">
          <Logo size="lg" />
        </div>

        <h1 className="text-center text-xl font-bold">Login</h1>

        <div>
          <Input
            type="email"
            placeholder="Email"
            {...register("email", { required: true })}
          />

          {errors.email && (
            <p className="mt-1 text-sm text-destructive">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <Input
            type="password"
            placeholder="Password"
            {...register("password", { required: true })}
          />

          {errors.password && (
            <p className="mt-1 text-sm text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        {loginError && (
          <p className="text-sm text-destructive">{loginError.message}</p>
        )}

        <Button type="submit" disabled={loginIsPending}>
          {loginIsPending && <Spinner />} Login
        </Button>
      </form>
    </div>
  )
}
