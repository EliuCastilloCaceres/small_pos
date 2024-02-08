
import axios from "axios";
import { useContext, useState } from "react";
import '../Products/newProduct.css'
import BackButton from "../BackButton.jsx";
import StatesPicker from "../StatesPicker.jsx";
import CitiesPicker from "../CitiesPicker.jsx";
import toast, { Toaster } from "react-hot-toast";
import UserContext from "../../Context/UserContext.jsx";
import { Navigate } from "react-router-dom";
function NewProvider() {
    const { user } = useContext(UserContext)
    if(user.permissions.providers !==1){
        return <Navigate to={'/dashboard'} />
    }
    const URL_BASE = import.meta.env.VITE_URL_BASE
    const [loading, setLoading] = useState(false)
    const [saved, setSaved] = useState(true)
    const [fields, setFields] = useState({
        name:'',
        rfc:'',
        adress:'',
        zipCode:'',
        phoneNumber:'',
        state:'',
        city:''
    })
    const token = localStorage.getItem("token")
    const handleChange = (e,fieldName)=>{
        setFields({
            ...fields,
            [fieldName]:e.target.value
        })
        setSaved(false)
    }
    const unSaved = ()=>{
        setSaved(false)
    }
    const selectState = (state)=>{
        setFields({
            ...fields,
            state:state
        })
    }
    const selectCity = (city)=>{
        setFields({
            ...fields,
            city:city
        })
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true)
        axios.post(`${URL_BASE}providers/create`, fields, {
            headers: {
                'Authorization': `Bearer ${token}`,
                
            }
        })
            .then(response => {
                setLoading(false)
                console.log(response)
                toast.success('Proveedor Creado')
                setSaved(true)
                setFields({
                    name: '',
                    rfc: '',
                    adress: '',
                    zipCode: '',
                    phoneNumber: '',
                    state:'',
                    city:''
                });
               
            })
            .catch(error => {
                setLoading(false)
                toast.error(`Algo salió mal: ${error.message}`)

            })
    }
    return (
        <div>
            <BackButton saved={saved}/>
            <div className={`new-product-container ${loading && 'loading'} `}>
                <div className={`spinner-border spinner ${!loading && 'hide'}`} role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <h2 className='fw-bold text-center my-3'>Nuevo Proveedor</h2>

                <form onSubmit={handleSubmit} className="row g-3 align-items-center fw-bold" >
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="name">Nombre</label>
                        <input onChange={(e)=>{handleChange(e,'name')}} required value={fields.name} type="text" name="name" className="form-control" />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="rfc">RFC</label>
                        <input onChange={(e)=>{handleChange(e,'rfc')}} value={fields.rfc} type="text" name="rfc" className="form-control" />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="adress">Dirección</label>
                        <input onChange={(e)=>{handleChange(e,'adress')}} value={fields.adress} type="text" name="adress" className="form-control" />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="zipCode">Código Postal</label>
                        <input onChange={(e)=>{handleChange(e,'zipCode')}} value={fields.zipCode} type="text" name="zipCode" className="form-control" />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="phoneNumber">Teléfono</label>
                        <input onChange={(e)=>{handleChange(e,'phoneNumber')}} value={fields.phoneNumber} type="text" name="phoneNumber" className="form-control" />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="state">Estado</label>
                        <StatesPicker
                            unSaved = {unSaved}
                            selectState={selectState}
                            name={"state"}
                            selectedState={fields.state??''}
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="city">Ciudad</label>
                        <CitiesPicker 
                        unSaved = {unSaved} 
                        name={"city"} 
                        state={fields.state} 
                        selectedCity={fields.city??''}
                        selectCity={selectCity}
                        />
                        
                    </div>
                    <div className="col-12 text-center my-5">
                        <button type="submit" className={`btn btn-primary ${loading || saved && 'disabled'}`}>Guardar</button>
                    </div>

                </form>


            </div>

            <Toaster 
                position="bottom-right"
            />
        </div>
    )
}

export default NewProvider