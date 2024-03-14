
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import MessageCard from "../MessageCard.jsx";
import '../Products/newProduct.css'
import BackButton from "../BackButton.jsx";
import StatesPicker from "../StatesPicker.jsx";
import CitiesPicker from "../CitiesPicker.jsx";
import { Navigate, useParams } from "react-router-dom";
import usePetition from "../../hooks/usePetition.js";
import toast, { Toaster } from "react-hot-toast";
import UserContext from "../../Context/UserContext.jsx";
function CustomerUpdate() {
    const { user } = useContext(UserContext)
    if(user.permissions.customers !==1){
        return <Navigate to={'/dashboard'} />
    }
    const URL_BASE = import.meta.env.VITE_URL_BASE
    const { customerId } = useParams()
    const token = localStorage.getItem("token")
    const [data, isLoading, error] = usePetition(`customers/${customerId}`);
    const [loading, setLoading] = useState(false)
    const [saved, setSaved] = useState(true)
    const [fields, setFields] = useState({
        firstName: '',
        lastName: '',
        adress: '',
        zipCode: '',
        phoneNumber: '',
        rfc: '',
        city: '',
        state: ''
    })
    useEffect(() => {
        if (data && data.length > 0) {
            setFields({
                firstName: data[0].first_name,
                lastName: data[0].last_name,
                adress: data[0].adress,
                zipCode: data[0].zip_code,
                phoneNumber: data[0].phone_number,
                rfc: data[0].rfc,
                city: data[0].city,
                state: data[0].state
            })
        }
    }, [data])
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
        axios.put(`${URL_BASE}customers/${customerId}/update`, fields, {
            headers: {
                'Authorization': `Bearer ${token}`,

            }
        })
            .then(response => {
                setLoading(false)
                console.log(response)
                toast.success(`Cliente ${customerId} actualizado`)
                setSaved(true)

            })
            .catch(error => {
                setLoading(false)
                console.log(error)
                toast.error(`algo salió mal: ${error.message}`)

            })
    }
    return (
        <div>
            <BackButton saved={saved} />
            <div className={`new-product-container ${loading && 'loading'} `}>
                <div className={`spinner-border spinner ${!loading && 'hide'}`} role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <h2 className='fw-bold text-center my-3'>Detalles del cliente {customerId} </h2>

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

                <Toaster
                    position="bottom-right"
                />

            </div>


        </div>
    )
}

export default CustomerUpdate