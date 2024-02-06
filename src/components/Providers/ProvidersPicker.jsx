import { useEffect, useState } from "react"
import usePetition from "../../hooks/usePetition"
function ProvidersPicker({ required, selectedProvider, name, isSaved, selectProvider }) {
    const [data, isloading, error] = usePetition('providers')
    const [noProvider,setNoProvider] = useState()
    useEffect(()=>{
        if(data && data.length>0){
            const noProvider = data.filter(provider => provider.name === '-')
            setNoProvider(noProvider[0].provider_id)
            console.log(noProvider[0].provider_id)
           if(selectedProvider=='' || !selectProvider){
            selectProvider(noProvider[0].provider_id)
           }
        }
    },[data])
    return (
        <>
            {
                isloading ? (<span>Cargando..</span>)
                    : error ? (<span>Error: {error}</span>)
                        : data &&
                        (<select {...( required ? {required:true} : {})} className="form-select" onChange={(e)=>{
                           selectProvider(e.target.value)
                           isSaved(false)
                        }} value={selectedProvider??noProvider}  name={name}>
                            <option  value={noProvider}>-</option>
                            
                            {
                                data.filter(providers =>{return providers.name!='-'}).map(({name,provider_id})=>{
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