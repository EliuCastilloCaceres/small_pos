import usePetition from "../hooks/usePetition"
function ProvidersPicker({ selectedProvider, handleChange, name }) {
    const [data, isloading, error] = usePetition('providers')
    return (
        <>
            {
                isloading ? (<span>Cargando..</span>)
                    : error ? (<span>Error: {error}</span>)
                        : data &&
                        (<select className="form-select" defaultValue={selectedProvider} onChange={handleChange} name={name}>
                            {
                                data.map(({name,provider_id})=>{
                                    return(
                                        <option key={provider_id} value={provider_id}>{name}</option>
                                    )
                                })
                            }
                        </select>
                        )
            }
        </>
    )
}

export default ProvidersPicker