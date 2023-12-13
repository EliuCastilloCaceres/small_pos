import { useNavigate } from 'react-router-dom'

function BackButton() {
    const navigation = useNavigate();
    const handleClick=()=>{
        if(confirm('¿Desea Salir? Los cambios se perderán')){
            navigation(-1)
        }
    }

    return (
        <button onClick={handleClick} type="button" className="btn btn-lg btn-secondary  mt-3">
            <i className="bi bi-arrow-left-square"></i>
        </button>
    )
}
export default BackButton