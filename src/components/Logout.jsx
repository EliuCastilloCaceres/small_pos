import { useLocation, useNavigate } from "react-router-dom"
import { useContext, useEffect } from "react";
import UserContext from "../Context/UserContext";


function Logout() {
  const navigation = useNavigate();
  const location = useLocation();
  const { logout } = useContext(UserContext)
  useEffect(() => {
    logout()
    localStorage.removeItem('token');
    navigation('/login');
  })

  return (
    <span>Cerrando Sesión...</span>
  )
}

export default Logout