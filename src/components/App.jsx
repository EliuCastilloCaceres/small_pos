import { NavLink, Outlet, Navigate } from 'react-router-dom';
import './app.css';

function App() {
  if(!localStorage.getItem("token")) return <Navigate to="/login" />
  return (
    <>
      <div className="main-container border border-primary">
        <aside className='side-menu'>
          <NavLink to='/dashboard' className='menu-element'>
          <i className="bi bi-pie-chart"></i>
            DASHBOARD
          </NavLink>
          <NavLink to='/orders' className={({isActive})=> isActive?"active menu-element":"menu-element"}>
          <i className="bi bi-clipboard2-data"></i>
            VENTAS
          </NavLink>
          <NavLink to='products' className='menu-element'>
          <i className="bi bi-boxes"></i>
            PRODUCTOS
          </NavLink>
          <NavLink to='providers' className='menu-element'>
          <i className="bi bi-truck"></i>
            PROVEEDORES
          </NavLink>
          <NavLink to='users' className='menu-element'>
          <i className="bi bi-person"></i>
            USUARIOS
          </NavLink >
          <NavLink to='customers' className='menu-element'>
          <i className="bi bi-person-badge"></i>
            CLIENTES
          </NavLink>
        </aside>
        <main className='main-content'>
            <Outlet/>
        </main>
      </div>
    </>
  )
}

export default App
