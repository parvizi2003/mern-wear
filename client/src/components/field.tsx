import { Input } from "./ui/input"

type FieldProps = {
  id: string
  label: string
  type: string
  placeholder: string
  register: any
  error?: string
}

export default function Field({
  id,
  label,
  type,
  placeholder,
  register,
  error,
}: FieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>

      <Input id={id} type={type} placeholder={placeholder} {...register} />

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
