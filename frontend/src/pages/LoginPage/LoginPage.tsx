import { LoginForm } from "@/features/auth"
import { Link } from "react-router"

export const LoginPage = () => {
    return (
        <div style={{ maxWidth: 360, margin: '80px auto' }}>
            <h1>Вход в Tracking-Vehicle</h1>
            <LoginForm />
            <p>
                Нет аккаунта? <Link to="/register">Зарегистрировать компанию</Link>
            </p>
        </div>
    )
}