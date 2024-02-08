import axios from "axios";
import { useContext, useState } from "react";
import MessageCard from "../MessageCard.jsx";
import '../Products/newProduct.css'
import BackButton from "../BackButton.jsx";
import StatesPicker from "../StatesPicker.jsx";
import CitiesPicker from "../CitiesPicker.jsx";
import toast,{ Toaster } from "react-hot-toast";
import UserContext from "../../Context/UserContext.jsx";
import { Navigate } from "react-router-dom";
function NewUser() {
    const { user:contextUser } = useContext(UserContext)
    if(contextUser.permissions.users !==1){
        return <Navigate to={'/dashboard'} />
    }
    const token = localStorage.getItem("token")
    const URL_BASE = import.meta.env.VITE_URL_BASE
    const [loading, setLoading] = useState(false)
    const [saved, setSaved] = useState(true)
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
        city: '',
        state: ''
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

        //console.log('FormData:', formData)
        setLoading(true)
        axios.post(`${URL_BASE}users/create`, fields, {
            headers: {
                'Authorization': `Bearer ${token}`,

            }
        })
            .then(response => {
                setLoading(false)
                console.log(response)
                toast.success('Usuario Creado')
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
                    city: '',
                    state: ''
                });

            })
            .catch(error => {
                setLoading(false)
                console.log(error)
                if (error.response && error.response.status != 500) {
                    toast.error(`Algo salió mal: ${error.response.data.message}`)
                } else {
                    toast.error(`Algo salió mal: ${error.message}`)
                }
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
                        <input onChange={(e) => { handleChange(e, 'userName') }} required value={fields.userName} type="text" name="userName" className="form-control" />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="password">Contraseña</label>
                        <input onChange={(e) => { handleChange(e, 'password') }} required value={fields.password} type="password" name="password" className="form-control" />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="profile">Perfil</label>
                        <select onChange={(e) => { handleChange(e, 'profile') }} value={fields.profile} name="profile" className="form-control" >
                            <option value="">Seleccionar Perfil</option>
                            <option value="Administrador">Administrador</option>
                            <option value="Empleado">Empleado</option>
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="profile">Puesto</label>
                        <select onChange={(e) => { handleChange(e, 'position') }} value={fields.position} name="position" className="form-control" >
                            <option value="">Seleccionar Puesto</option>
                            <option value="Gerente">Gerente</option>
                            <option value="Cajero">Cajero</option>
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="password">Dirección</label>
                        <input onChange={(e) => { handleChange(e, 'adress') }} value={fields.adress} name="adress" className="form-control" />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="password">Código Postal</label>
                        <input onChange={(e) => { handleChange(e, 'zipCode') }} value={fields.zipCode} name="zipCode" className="form-control" />
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

export default NewUser