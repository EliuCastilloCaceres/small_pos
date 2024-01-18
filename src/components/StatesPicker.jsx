import states from "../helpers/estados.json"
function StatesPicker({selectedState, name, selectState, unSaved}) {
    //console.log(states)
    return (
        <>
          
            <select onChange={(e)=>{
                unSaved()
                selectState(e.target.value)
            }} className="form-select" value={selectedState} name={name} >
                <option disabled value="">Seleccionar</option>
                {
                    states.map((state) => {
                        return (
                            <option key={state.clave} value={state.nombre}>{state.nombre}</option>
                        )
                    })
                }
            </select>


        </>
    )
}

export default StatesPicker