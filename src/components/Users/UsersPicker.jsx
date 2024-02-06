import { useEffect } from "react"
import usePetition from "../../hooks/usePetition"

function UsersPicker({selectedUser, selectUser, name}) {
    const [data, isloading, error] = usePetition('users')
    useEffect(()=>{
        if(data && data.length>0){
            console.log(data)
        }
    },[data])
    return (
        <>
            {
                isloading ? (<span>Cargando..</span>)
                    : error ? (<span>Error: {error}</span>)
                        : data &&
                        (<select name={name} className="form-select" value={selectedUser} onChange={(e)=>{
                            selectUser(e.target.value)
                        }} >
                            {
                                data.map(({first_name,last_name,user_id})=>{
                                    return(
                                        <option key={user_id} value={user_id}>{first_name} {last_name}</option>
                                    )
                                })
                            }
                        </select>
                        )
            }
        </>
    )
}

export default UsersPicker