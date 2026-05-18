import { z } from "zod"

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Minimum 2 characters")
      .max(100, "Maximum 100 characters"),

    email: z.email("Invalid email"),

    password: z.string().min(6, "Minimum 6 characters"),

    confirmPassword: z.string().min(6, "Minimum 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export type RegisterFormData = z.infer<typeof registerSchema>
