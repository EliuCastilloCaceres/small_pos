import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import usePetition from "../../hooks/usePetition";
import './userPermissions.css'

function UserPermissions() {
    const token = localStorage.getItem("token")
    const { userId } = useParams()
    const [data, IsLoading, error, setData] = usePetition(`users/${userId}/permissions`);
    const[saved, setSaved]=useState(true)
    const [fields, setFields] = useState({
        pos:'',
        dashboard:'',
        orders:'',
        products:'',
        providers:'',
        users:'',
        customers:'',
    })
   
    const handleChange = (e,fieldName)=>{
        setFields({
            ...fields,
            [fieldName]:e.target.value
        })
        setSaved(false)
    }

    useEffect(()=>{
        if(data){

        }
    },[data])

    const addPermissions = (e) => {
        e.preventDefault()
        console.log(fields)
    }
    const renderPermissions = () => {
        if (IsLoading) {
            return <span>Cargando permisos...</span>
        }

        if (error) {
            return <span>Ha ocurrido el sigueinte error: {error}</span>
        }

        if (!data || data.length === 0) {
            
        }
        return <>
                <form onSubmit={addPermissions} className="row g-3 align-items-center fw-bold" >
                    <div className="col-md-2 gap-1">
                        <label className="form-check-label" htmlFor="isVariable">Pos</label>
                        <input onChange={(e) => { handleChange(e,'pos')}} className="form-check-input" name="pos" type="checkbox" id="flexCheckDefault" />
                    </div>
                </form>
            </>
    }

    return (
        <>
            <div className="hello">
                <h1>PERMISOS DEL USUARIO {userId}</h1>
                {renderPermissions()}
            </div>
        </>
    )

}

export default UserPermissions