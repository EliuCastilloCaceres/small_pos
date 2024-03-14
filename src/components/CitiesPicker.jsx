import { useEffect } from "react"
import statesWithCities from "../helpers/estados-municipios.json"
function citiesPicker({selectedCity, state, name, unSaved,selectCity}) {
    useEffect(()=>{
        selectedCity = ""
    },[state])
    const renderOptions = ()=>{
        if(!state || state ===''){
            return <option  value="">Seleccione un estado</option>
        }
        const cities = statesWithCities[state]
        return(
            <>
                <option  value="">Seleccionar</option>
                {
                    cities.map((city) => {
                        return (
                            <option key={city} value={city}>{city}</option>
                        )
                    })
                }
            </>
        )
    }
    return (
        <>
          
            <select required onChange={(e)=>{
                selectCity(e.target.value)
                unSaved()
            }} className="form-select" value={selectedCity} name={name} >
                {renderOptions()}
            </select>


        </>
    )
}

export default citiesPicker