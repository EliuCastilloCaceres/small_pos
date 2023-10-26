import { Link, useLocation, useNavigate } from "react-router-dom"
import './header.css'


function Header() {
    const navigation = useNavigate();
    const accesToken = localStorage.getItem('token');
    const location = useLocation();
    const isLoginPath = location.pathname === '/login';
    const handleClick = () => {
        localStorage.removeItem('token');
        navigation('/login');
    }


    return (
        <header className=' container-fluid'>
            <Link className='logo' to={accesToken ? '/pos' : '/login'}>SMALL POS V1.0</Link>
            <div>
                {!isLoginPath && (
                    <div>
                        <button
                            type='button'
                            className='fw-bold btn btn-danger btn-lg'
                            onClick={handleClick}
                        >Cerrar sesión
                        </button>
                    </div>
                )}
            </div>
        </header>
    )
}

export default Header