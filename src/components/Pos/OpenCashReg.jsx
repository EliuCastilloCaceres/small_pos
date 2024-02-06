import { useContext } from "react"
import UserContext from "../../Context/UserContext"
import CashRegStatus from "./CashRegStatus"

function OpenCashReg (){
    const {user} = useContext(UserContext)
    return(
        <CashRegStatus/>
    )
}

export default OpenCashReg