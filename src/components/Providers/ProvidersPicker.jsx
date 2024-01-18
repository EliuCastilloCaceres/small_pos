import usePetition from "../../hooks/usePetition"
function ProvidersPicker({ required, selectedProvider, name, isSaved, selectProvider }) {
    const [data, isloading, error] = usePetition('providers')
    return (
        <>
            {
                isloading ? (<span>Cargando..</span>)
                    : error ? (<span>Error: {error}</span>)
                        : data &&
                        (<select {...( required ? {required:true} : {})} className="form-select" onChange={(e)=>{
                           selectProvider(e.target.value)
                           isSaved(false)
                        }} value={selectedProvider}  name={name}>
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