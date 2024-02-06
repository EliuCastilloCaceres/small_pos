import usePetition from "../../hooks/usePetition"

function CustomersPicker({selectedCustomer,selectCustomer,name}) {
    const [data, isloading, error] = usePetition('customers')
    return (
        <>
            {
                isloading ? (<span>Cargando..</span>)
                    : error ? (<span>Error: {error}</span>)
                        : data &&
                        (<select name={name} className="form-select" value={selectedCustomer} onChange={(e)=>{
                            selectCustomer(e.target.value)
                        }} >
                            {
                                data.map(({first_name,last_name,customer_id})=>{
                                    return(
                                        <option key={customer_id} value={customer_id}>{first_name} {last_name}</option>
                                    )
                                })
                            }
                        </select>
                        )
            }
        </>
    )
}

export default CustomersPicker