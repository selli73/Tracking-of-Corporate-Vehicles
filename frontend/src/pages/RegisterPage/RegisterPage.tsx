import { RegisterCompanyForm } from "@/features/auth"
import { Link } from "react-router"

export const RegisterPage = () => {
    return (
        <div style={{ maxWidth: 480, margin: '40px auto' }}>
            <h1>Регистрация компании</h1>
            <RegisterCompanyForm />
            <p>
                Уже есть аккаунт? <Link to="/login">Войти</Link>
            </p>
        </div>
    )
}