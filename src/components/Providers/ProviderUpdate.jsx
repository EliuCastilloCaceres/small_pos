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

function ProviderUpdate() {
    const { providerId } = useParams();
    const [data, isLoading, error] = usePetition(`providers/${providerId}`);
    const [updateMessage, setUpdateMessage] = useState(null)
    const [alertType, setalertType] = useState('')
    const [selectedState, setSelectedState] = useState(null)
    const [selectedCity, setSelectedCity] = useState(null)
    const [loading, setLoading] = useState(false)
    const [showAlert, setShowAlert] = useState(false)
    const [saved, setSaved] = useState(true)
    const token = localStorage.getItem("token")
    const URL_BASE = import.meta.env.VITE_URL_BASE

    useEffect(()=>{
        if(data){
            setSelectedState(data[0].state)
            setSelectedCity(data[0].city)
        }
    },[data])

    const selectState = (state)=>{
        setSelectedState(state)
    }
    const selectCity = (city)=>{
        setSelectedCity(city)
    }

    const unSaved =()=>{
        setSaved(false)
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        
        setLoading(true)
            const formData = new FormData(e.target);
            axios.put(`${URL_BASE}providers/update/${providerId}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(response => {
                    setLoading(false)
                    console.log(response)
                    setUpdateMessage('Cambios guardados correctamente')
                    setShowAlert(true)
                    setalertType('success')
                    setSaved(true)

                })
                .catch(error => {
                    setLoading(false)
                    console.log(error)
                    setUpdateMessage('Algo salio mal: ' + error.message)
                    setShowAlert(true)
                    setalertType('danger')
                    setSaved(false)
                    return
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
                        <input onChange={unSaved} required type="text" name="name" className="form-control" defaultValue={data[0].name} />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="rfc">RFC</label>
                        <input onChange={unSaved} type="text" name="rfc" className="form-control" defaultValue={data[0].rfc} />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="adress">Dirección</label>
                        <input onChange={unSaved} type="text" name="adress" className="form-control" defaultValue={data[0].adress} />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="zipCode">Código Postal</label>
                        <input onChange={unSaved} type="text" name="zipCode" className="form-control" defaultValue={data[0].zip_code} />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="phoneNumber">Teléfono</label>
                        <input onChange={unSaved} type="text" name="phoneNumber" className="form-control" defaultValue={data[0].phone_number} />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="state">Estado</label>
                        <StatesPicker
                            unSaved = {unSaved}
                            selectState={selectState}
                            name={"state"}
                            selectedState = {selectedState??''}
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="city">Ciudad</label>
                        <CitiesPicker 
                        unSaved = {unSaved} 
                        name={"city"} 
                        state={selectedState} 
                        selectCity={selectCity}
                        selectedCity={selectedCity??''}/>
                    </div>
                    <div className="col-12 text-center my-5">
                        <button type="submit" className={`btn btn-primary ${loading || saved && 'disabled'}`}>Guardar</button>
                    </div>

                </form>



            {
                showAlert && (
                    <div className="m-3 alert-container">
                        <MessageCard
                            message={updateMessage}
                            onClose={() => setShowAlert(false)}
                            type={alertType}
                        />
                    </div>

                )
            }

        </div>
    </div>




}

export default ProviderUpdate