import { Link } from "react-router"

export const NotFoundPage = () => {
    return (
        <div>
            <h1>Страница не найдена</h1>
            <Link to='/' ></Link>
        </div>
    )
}