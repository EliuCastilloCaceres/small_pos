import { createContext, useEffect, useState } from "react";

const CashRegContext = createContext()

export const CashRegContextProvider = ({ children }) => {
    const [cashRegSession, setCashRegSession] = useState(null)

    useEffect(()=>{
        console.log('ctxcrs: ',cashRegSession)
    },[cashRegSession])

    const openCashRegSession = (sessionInfo) => {
        setCashRegSession(sessionInfo)
    }
    const closeCashRegSession = () => {
        setCashRegSession(null)
    }

    return (
        <CashRegContext.Provider value={{ cashRegSession, openCashRegSession, closeCashRegSession }}>
            {children}
        </CashRegContext.Provider>
    )
}

export default CashRegContext