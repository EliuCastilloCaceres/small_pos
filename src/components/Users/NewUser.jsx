import axios from "axios";
import { useState } from "react";
import MessageCard from "../MessageCard.jsx";
import '../Products/newProduct.css'
import BackButton from "../BackButton.jsx";
import StatesPicker from "../StatesPicker.jsx";
import CitiesPicker from "../CitiesPicker.jsx";
function NewUser() {
    const [updateMessage, setUpdateMessage] = useState(null)
    const [showAlert, setShowAlert] = useState(false)
    const [alertType, setalertType] = useState('')
    const [loading, setLoading] = useState(false)
    const [saved, setSaved] = useState(true)
    const [selectedState, setSelectedState] = useState('')
    const [selectedCity, setSelectedCity] = useState('')
    const [fields, setFields] = useState({
        firstName: '',
        lastName: '',
        userName: '',
        password: '',
        profile: '',
        position: '',
        adress: '',
        zipCode: '',
        phoneNumber: '',
    })
    const token = localStorage.getItem("token")
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
        setSelectedState(state)
    }
    const selectCity = (city) => {
        setSelectedCity(city)
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const URL_BASE = import.meta.env.VITE_URL_BASE
        //console.log('FormData:', formData)
        setLoading(true)
        axios.post(`${URL_BASE}users/create`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`,

            }
        })
            .then(response => {
                setLoading(false)
                console.log(response)
                setUpdateMessage('Usuario creado exitosamente')
                setShowAlert(true)
                setalertType('success')
                setSaved(true)
                setFields({
                    firstName: '',
                    lastName: '',
                    userName: '',
                    password: '',
                    profile: '',
                    position: '',
                    adress: '',
                    zipCode: '',
                    phoneNumber: '',
                });
                setSelectedState('');
                setSelectedCity('');


            })
            .catch(error => {
                setLoading(false)
                console.log(error.message)
                setUpdateMessage('Algo salió mal: ' + error.message)
                setShowAlert(true)
                setalertType('danger')

            })
    }
    return (
        <div>
            <BackButton saved={saved} />
            <div className={`new-product-container ${loading && 'loading'} `}>
                <div className={`spinner-border spinner ${!loading && 'hide'}`} role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <h2 className='fw-bold text-center my-3'>Nuevo Usuario</h2>

                <form onSubmit={handleSubmit} className="row g-3 align-items-center fw-bold" >
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="firstName">Nombre(s)</label>
                        <input onChange={(e) => { handleChange(e, 'firstName') }} required value={fields.firstName} type="text" name="firstName" className="form-control" />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="lastName">Apellido(s)</label>
                        <input onChange={(e) => { handleChange(e, 'lastName') }} value={fields.lastName} type="text" name="lastName" className="form-control" />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="userName">Usuario</label>
                        <input onChange={(e) => { handleChange(e, 'userName') }} value={fields.userName} type="text" name="userName" className="form-control" />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="password">Contraseña</label>
                        <input onChange={(e) => { handleChange(e, 'password') }} value={fields.password} type="password" name="password" className="form-control" />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="profile">Perfil</label>
                        <select onChange={(e) => { handleChange(e, 'profile') }} value={fields.profile}  name="profile" className="form-control" >
                            <option value="">Seleccionar Perfil</option>
                            <option value="Administrador">Administrador</option>
                            <option value="Empleado">Empleado</option>
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="profile">Puesto</label>
                        <select onChange={(e) => { handleChange(e, 'position') }} value={fields.position}  name="position" className="form-control" >
                            <option value="">Seleccionar Puesto</option>
                            <option value="Gerente">Gerente</option>
                            <option value="Cajero">Cajero</option>
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="password">Dirección</label>
                        <input onChange={(e) => { handleChange(e, 'adress') }} value={fields.adress}  name="adress" className="form-control" />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="password">Código Postal</label>
                        <input onChange={(e) => { handleChange(e, 'zipCode') }} value={fields.zipCode}  name="zipCode" className="form-control" />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="phoneNumber">Teléfono</label>
                        <input onChange={(e) => { handleChange(e, 'phoneNumber') }} value={fields.phoneNumber} type="text" name="phoneNumber" className="form-control" />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="state">Estado</label>
                        <StatesPicker
                            unSaved={unSaved}
                            selectState={selectState}
                            name={"state"}
                            selectedState={selectedState ?? ''}
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="city">Ciudad</label>
                        <CitiesPicker
                            unSaved={unSaved}
                            name={"city"}
                            state={selectedState}
                            selectedCity={selectedCity ?? ''}
                            selectCity={selectCity}
                        />

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
    )
}

export default NewUser