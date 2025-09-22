import { RegisterForm } from "@/components/auth/register-form"

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Smart Condominium</h1>
          <p className="text-muted-foreground mt-2">Sistema de Gestión de Condominios</p>
        </div>
        <RegisterForm />
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            ¿Ya tienes cuenta?{" "}
            <a href="/login" className="text-primary hover:underline">
              Inicia sesión aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
