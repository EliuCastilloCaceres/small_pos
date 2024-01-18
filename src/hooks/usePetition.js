import axios from "axios"
import { useState, useEffect } from "react"


const usePetition = (endpoint)=>{

    const API_URL = import.meta.env.VITE_URL_BASE

    const [data, setData] = useState()
    const [isLoading, setisLoading] = useState(false)
    const [error, setError] = useState()
    const token = localStorage.getItem('token');
    useEffect(() => {
        setisLoading(true)
        const fetchData = async ()=>{
            try{

                const data = await axios.get(`${API_URL}${endpoint}`,{
                    headers:{
                        'Authorization': `Bearer ${token}`
                    }
                })
                setData(data.data.data)
                 setisLoading(false)
                
            }catch(e){
                console.log(e);
                setisLoading(false)
                setError(e.message)
            }

        }
        fetchData()
       
            
    }, [])

    return [data, isLoading, error, setData]
}

export default usePetition