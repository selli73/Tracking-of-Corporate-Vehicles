import { LoginForm } from "@/features/auth"

export const LoginPage = () => {
    return (
        <div style={{ maxWidth: 360, margin: '80px auto' }}>
            <h1>Вход в Tracking-Vehicle</h1>
            <LoginForm />
        </div>
    )
}