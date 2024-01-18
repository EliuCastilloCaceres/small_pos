import usePetition from "../../hooks/usePetition"

function UsersPicker({selectedUser}) {
    const [data, isloading, error] = usePetition('users')
    return (
        <>
            {
                isloading ? (<span>Cargando..</span>)
                    : error ? (<span>Error: {error}</span>)
                        : data &&
                        (<select className="form-select" defaultValue={selectedUser}>
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