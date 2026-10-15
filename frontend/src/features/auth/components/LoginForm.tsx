import { isApiError } from "@/shared/api/ApiError";
import { useState, type FormEvent } from "react"
import { authStore } from "../store";

const getErrorMessage = (error: unknown) => {
    if (!isApiError(error)) {
        return 'Что-то пошло не так. Попробуйте ещё раз';
    }

    switch (error.code) {
        case 'UNAUTHORIZED': 
            return 'Неверный email или пароль';
        case 'VALIDATION_ERROR':
        case 'FORBIDDEN':
        case 'NOT_FOUND':
        default:
            return error.message
    }
}

export const LoginForm = () => {
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            await authStore.login({ email, password });
        } catch(error: unknown) {
            setError(getErrorMessage(error));
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="email">Email</label>
                <input 
                    id='email' 
                    type='email' 
                    autoComplete='email' 
                    required value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                />
            </div>

            <div>
                <label htmlFor="password">Пароль</label>
                <input 
                    id='password' 
                    type='password' 
                    autoComplete='current-password' 
                    required value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                />
            </div>

            { error && <p role='alert' style={{ color: 'crimson' }}>{error}</p> }

            <button type='submit' disabled={isSubmitting}>
                { isSubmitting? 'Входим...' : 'Войти' }
            </button>
        </form>
    )
}