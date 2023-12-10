import usePetition from "../hooks/usePetition"
function ProvidersPicker({ selectedProvider, name }) {
    const [data, isloading, error] = usePetition('providers')
    return (
        <>
            {
                isloading ? (<span>Cargando..</span>)
                    : error ? (<span>Error: {error}</span>)
                        : data &&
                        (<select className="form-select" defaultValue={selectedProvider?selectedProvider:''}  name={name}>
                            <option disabled value="">Seleccionar</option>
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