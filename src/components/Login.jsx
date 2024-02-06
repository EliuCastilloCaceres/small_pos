import axios from "axios"
import { useState } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import "./login.css"
const Login = () => {
    const navigation = useNavigate()
    const [user, setUser] = useState({
        username: "",
        password: ""
    })
    const [cargando, setCargando] = useState(false)
    const [error, setError] = useState()
    const submit = (e) => {
        e.preventDefault()
        setCargando(true)
        setError(null)
        //console.log(user)
        axios.post(`${import.meta.env.VITE_URL_BASE}login`, user)
            .then(data => {
                setCargando(false)
                console.log(data)
                localStorage.setItem("token", data.data.token)
                navigation("/")
            })
            .catch(e => {
                setCargando(false)
                console.log('Ha ocurrido el sig error: ' + e)
                console.log(e)
                setError( e.response?e.response.data.errorMessage:e.message)
            })
    }

    if (localStorage.getItem("token")) return <Navigate to="/" />

    return (
        <div className="container login-container">
            <div className="login-content">
                <h1 className="text-center">Login</h1>
                <form onSubmit={submit}>
                    <div className="field">
                        <label htmlFor="username">Usuario</label>
                        <input className="form-control" required onChange={(e) => {
                            setUser({
                                ...user,
                                username: e.target.value
                            })
                        }} type="text" name="username" />
                    </div>
                    <div className="field">
                        <label htmlFor="password">Contraseña</label>
                        <input className="form-control" required onChange={(e) => {
                            setUser({
                                ...user,
                                password: e.target.value
                            })
                        }} type="password" name="password" />
                    </div>
                    <div className="submit d-grid mt-3">
                        <input className="btn btn-primary btn-lg"
                            type="submit"
                            value={
                                cargando ? "Cargando..." : "Ingresar"
                            }
                        />
                    </div>
                </form>
                {
                    error && <span className="error">Error: {error}</span>
                }
            </div>

        </div>

    )
}
export default Login