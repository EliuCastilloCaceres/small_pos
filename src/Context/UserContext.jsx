import React, { createContext, useEffect, useState } from 'react';

const UserContext = createContext();

export const UserContextProvider = ({children})=>{
    const [user,setUser] = useState(null)
    useEffect(()=>{
        console.log('user Logged',user)
    },[user])

    const login = (userData) => {
        // Lógica de inicio de sesión...
        setUser(userData);
    };

    const logout = () => {
        // Lógica de cierre de sesión...
        setUser(null);
    };

    return(
        <UserContext.Provider value={{user,login,logout}}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContext