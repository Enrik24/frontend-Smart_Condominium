import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Smart Condominium</h1>
          <p className="text-muted-foreground mt-2">Sistema de Gestión de Condominios</p>
        </div>
        <LoginForm />
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            ¿No tienes cuenta?{" "}
            <a href="/register" className="text-primary hover:underline">
              Regístrate aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
