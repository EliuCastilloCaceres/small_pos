import { NavLink, Outlet, Navigate, useNavigate, Link, useLocation, } from 'react-router-dom';
import './app.css';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import UserContext from '../Context/UserContext';

function App() {
  const token = localStorage.getItem("token")
  const URL_BASE = import.meta.env.VITE_URL_BASE
  const navigation = useNavigate()
  const [user, setUser] = useState()
  const [permissions, setPermissions] = useState()
  const { user: userData, login } = useContext(UserContext)
  const location = useLocation()
  useEffect(() => {
    const fetchAuth = async () => {
      try {

        const response = await axios.get(`${URL_BASE}users/isauth`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        })
        //console.log('autenticado')
        //console.log(response.data)
        setUser(response.data.user[0])
        login(response.data.user[0])
        setPermissions(response.data.user[0].permissions)
      } catch (error) {
        console.log('no autenticado')
        console.log(error)
        localStorage.removeItem("token")
        navigation("/login")
      }
    }
    if (token) {
      fetchAuth();
      // const closeSession = ()=>{
      //   localStorage.removeItem('token')
      // }
      // window.addEventListener('beforeunload',closeSession)
    }
  }, [])
  useEffect(() => {
    if (user) {
      //console.log('Valor actual de user:', user);
      //console.log('Valor actual de userContext:', userData);
    }
    if (permissions) {
      //console.log('permisos: ', permissions)
    }
  }, [user, userData]);
  if (!localStorage.getItem("token")) return <Navigate to="/login" />

  return (
    <>

      {
        permissions ? (
          <div className="main-container">
            {
              location.pathname != '/pos' && (
                <div className='menu'>
                  <div className='app-modules'>
                    {
                      permissions.pos === 1 && (
                        <NavLink to='/open-cash-register' className='pos-btn'>
                          <i className="bi bi-pc-display-horizontal"></i>
                          POS
                        </NavLink>
                      )
                    }
                    {
                      permissions.dashboard === 1 && (
                        <NavLink to='/dashboard' className='menu-element'>
                          <i className="bi bi-graph-up-arrow"></i>
                          DASHBOARD
                        </NavLink>
                      )
                    }
                    {
                      permissions.orders === 1 && (
                        <NavLink to='/orders' className={({ isActive }) => isActive ? "active menu-element" : "menu-element"}>
                          <i className="bi bi-clipboard2-data"></i>
                          VENTAS
                        </NavLink>
                      )
                    }
                    {
                      permissions.products === 1 && (
                        <NavLink to='products' className='menu-element'>
                          <i className="bi bi-boxes"></i>
                          PRODUCTOS
                        </NavLink>
                      )
                    }
                    {
                      permissions.providers === 1 && (
                        <NavLink to='providers' className='menu-element'>
                          <i className="bi bi-truck"></i>
                          PROVEEDORES
                        </NavLink>
                      )
                    }

                    {
                      permissions.users === 1 && (
                        <NavLink to='users' className='menu-element'>
                          <i className="bi bi-person"></i>
                          USUARIOS
                        </NavLink >
                      )
                    }

                    {
                      permissions.customers === 1 && (
                        <NavLink to='customers' className='menu-element'>
                          <i className="bi bi-person-badge"></i>
                          CLIENTES
                        </NavLink>
                      )
                    }

                  </div>
                  <div className='d-flex gap-2'>
                    <div className="btn-group">
                      <button type="button" className="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                        {user.user_name}
                      </button>
                      <ul className="dropdown-menu">
                        <li><hr className="dropdown-divider" /></li>
                        <Link className='btn btn-danger w-100' to={'/logout'}>Cerrar Sesión</Link>
                      </ul>
                    </div>
                    {
                      permissions.settings === 1 && (
                        <Link to={'settings'} className='btn btn-dark d-flex align-items-center'>
                          <i className="bi bi-gear"></i>
                        </Link>
                      )
                    }
                  </div>
                </div>
              )
            }
            <main className='main-content'>
              <Outlet />
            </main>
          </div>
        ) : (<span>Cargando..</span>)
      }

    </>
  )
}

export default App
