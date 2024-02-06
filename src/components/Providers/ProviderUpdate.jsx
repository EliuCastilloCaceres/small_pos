import { useParams } from "react-router-dom";
import usePetition from "../../hooks/usePetition.js";
import axios from "axios";
import {  useEffect, useState } from "react";
import { hasOnlyNumbers } from '../../helpers/formFieldValidators.js';
import MessageCard from "../MessageCard.jsx";
import '../Products/productUpdate.css'
import BackButton from "../BackButton.jsx";
import StatesPicker from "../StatesPicker.jsx";
import CitiesPicker from "../CitiesPicker.jsx";
import toast, { Toaster } from "react-hot-toast";

function ProviderUpdate() {
    const token = localStorage.getItem("token")
    const URL_BASE = import.meta.env.VITE_URL_BASE
    const { providerId } = useParams();
    const [data, isLoading, error] = usePetition(`providers/${providerId}`);
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
 
    useEffect(()=>{
        if(data && data.length>0){
            setFields({
                name:data[0].name,
                rfc:data[0].rfc,
                adress:data[0].adress,
                zipCode:data[0].zip_code,
                phoneNumber:data[0].phone_number,
                state:data[0].state,
                city:data[0].city
            })
        }
    },[data])
    const handleChange = (e,fieldName)=>{
        setFields({
            ...fields,
            [fieldName]:e.target.value
        })
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

    const unSaved =()=>{
        setSaved(false)
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        
        setLoading(true)
            axios.put(`${URL_BASE}providers/update/${providerId}`, fields, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(response => {
                    setLoading(false)
                    console.log(response)
                    toast.success('Proveedor actualizado')
                    setSaved(true)

                })
                .catch(error => {
                    setLoading(false)
                    console.log(error)
                    toast.error(`Algo salió mal: ${error.message}`)
                    setSaved(false)
                })

    }

    if (isLoading) {
        return <>
            <BackButton saved={saved} />
            <span>Cargando datos...</span>
        </>
    }
    if (error) {
        return <>
            <BackButton saved={saved} />
            <span>Error: {error}</span>
        </>
    }
    if (!data || data.length === 0) {
        return <>
            <BackButton saved={saved} />
            <span>No hay datos para mostrar =C</span>
        </>
    }

    return <div>
        <BackButton 
        saved={saved}
         />
        <div className={`product-update-container ${loading && 'loading'}`}>
            <h2 className='fw-bold text-center my-3'>Detalles Proveedor {providerId}</h2>
            <div className={`spinner-border spinner ${!loading && 'hide'}`} role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            <form onSubmit={handleSubmit} className="row g-3 align-items-center fw-bold" >
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="name">Nombre</label>
                        <input onChange={(e)=>{handleChange(e,'name')}} required type="text" name="name" className="form-control" defaultValue={data[0].name} />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="rfc">RFC</label>
                        <input onChange={(e)=>{handleChange(e,'rfc')}} type="text" name="rfc" className="form-control" defaultValue={data[0].rfc} />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="adress">Dirección</label>
                        <input onChange={(e)=>{handleChange(e,'adress')}} type="text" name="adress" className="form-control" defaultValue={data[0].adress} />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="zipCode">Código Postal</label>
                        <input onChange={(e)=>{handleChange(e,'zipCode')}} type="text" name="zipCode" className="form-control" defaultValue={data[0].zip_code} />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="phoneNumber">Teléfono</label>
                        <input  onChange={(e)=>{handleChange(e,'phoneNumber')}} type="text" name="phoneNumber" className="form-control" defaultValue={data[0].phone_number} />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="state">Estado</label>
                        <StatesPicker
                            unSaved = {unSaved}
                            selectState={selectState}
                            name={"state"}
                            selectedState = {fields.state??''}
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="city">Ciudad</label>
                        <CitiesPicker 
                        unSaved = {unSaved} 
                        name={"city"} 
                        state={fields.state} 
                        selectCity={selectCity}
                        selectedCity={fields.city??''}/>
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




}

export default ProviderUpdate