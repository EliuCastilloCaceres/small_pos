
import axios from "axios";
import { useState } from "react";
import MessageCard from "../MessageCard.jsx";
import '../Products/newProduct.css'
import BackButton from "../BackButton.jsx";
import StatesPicker from "../StatesPicker.jsx";
import CitiesPicker from "../CitiesPicker.jsx";
import toast,{ Toaster } from "react-hot-toast";
function NewCustomer() {
    const URL_BASE = import.meta.env.VITE_URL_BASE
    const token = localStorage.getItem("token")
    const [updateMessage, setUpdateMessage] = useState(null)
    const [showAlert, setShowAlert] = useState(false)
    const [alertType, setalertType] = useState('')
    const [loading, setLoading] = useState(false)
    const [saved, setSaved] = useState(true)
    const [fields, setFields] = useState({
        firstName: '',
        lastName: '',
        adress: '',
        zipCode: '',
        phoneNumber: '',
        rfc: '',
        city:'',
        state:''
    })
    const handleChange = (e, fieldName) => {
        setFields({
            ...fields,
            [fieldName]: e.target.value
        })
        setSaved(false)
    }
    const unSaved = () => {
        setSaved(false)
    }
    const selectState = (state) => {
        setFields({
            ...fields,
            state: state
        })
    }
    const selectCity = (city) => {
        setFields({
            ...fields,
            city: city
        })
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true)
        axios.post(`${URL_BASE}customers/create`, fields, {
            headers: {
                'Authorization': `Bearer ${token}`,

            }
        })
            .then(response => {
                toast.success('Cliente creado')
                setLoading(false)
                console.log(response)
                setSaved(true)
                setFields({
                    firstName: '',
                    lastName: '',
                    adress: '',
                    zipCode: '',
                    phoneNumber: '',
                    rfc: '',
                    state: '',
                    city: '',
                });
            })
            .catch(error => {
                setLoading(false)
                console.log(error.message)
                toast.error(`Algo salió mal: ${error.message}`)

            })
    }
    return (
        <div>
            <BackButton saved={saved} />
            <div className={`new-product-container ${loading && 'loading'} `}>
                <div className={`spinner-border spinner ${!loading && 'hide'}`} role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <h2 className='fw-bold text-center my-3'>Nuevo Cliente</h2>

                <form onSubmit={handleSubmit} className="row g-3 align-items-center fw-bold" >
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="name">Nombre(s)</label>
                        <input onChange={(e) => { handleChange(e, 'firstName') }} required value={fields.firstName} type="text" name="firstName" className="form-control" />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="rfc">Apellido(s)</label>
                        <input onChange={(e) => { handleChange(e, 'lastName') }} value={fields.lastName} type="text" name="lastName" className="form-control" />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="adress">Dirección</label>
                        <input onChange={(e) => { handleChange(e, 'adress') }} value={fields.adress} type="text" name="adress" className="form-control" />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="zipCode">Código Postal</label>
                        <input onChange={(e) => { handleChange(e, 'zipCode') }} value={fields.zipCode} type="text" name="zipCode" className="form-control" />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="phoneNumber">Teléfono</label>
                        <input onChange={(e) => { handleChange(e, 'phoneNumber') }} value={fields.phoneNumber} type="text" name="phoneNumber" className="form-control" />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="phoneNumber">RFC</label>
                        <input onChange={(e) => { handleChange(e, 'rfc') }} value={fields.rfc} type="text" name="rfc" className="form-control" />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="state">Estado</label>
                        <StatesPicker
                            unSaved={unSaved}
                            selectState={selectState}
                            name={"state"}
                            selectedState={fields.state ?? ''}
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="city">Ciudad</label>
                        <CitiesPicker
                            unSaved={unSaved}
                            name={"city"}
                            state={fields.state}
                            selectedCity={fields.city ?? ''}
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

export default NewCustomer