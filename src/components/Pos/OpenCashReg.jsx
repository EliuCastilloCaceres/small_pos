import { useContext } from "react"
import UserContext from "../../Context/UserContext"
import CashRegStatus from "./CashRegStatus"
import { Navigate } from "react-router-dom"

function OpenCashReg (){
    const {user} = useContext(UserContext)
    if(user.permissions.pos !==1){
        return <Navigate to={'/dashboard'} />
    }
    return(
        <CashRegStatus/>
    )
}

export default OpenCashReg