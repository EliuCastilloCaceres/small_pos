import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import usePetition from "../../hooks/usePetition";
import './userPermissions.css'
import axios from "axios";
import MessageCard from "../MessageCard";
import BackButton from "../BackButton";
import toast,{ Toaster } from "react-hot-toast";

function UserPermissions() {
    const token = localStorage.getItem("token")
    const URL_BASE = import.meta.env.VITE_URL_BASE
    const { userId } = useParams()
    const [data, IsLoading, error, setData] = usePetition(`users/${userId}/permissions`);
    const [saved, setSaved] = useState(true)
    const [updateMessage, setUpdateMessage] = useState(null)
    const [alertType, setalertType] = useState('')
    const [showAlert, setShowAlert] = useState(false)
    const [loading, setLoading] = useState(false)
    const [fields, setFields] = useState({
        pos: false,
        dashboard: false,
        orders: false,
        products: false,
        providers: false,
        users: false,
        customers: false,
        settings: false,
    })

    const handleChange = (e, fieldName) => {
        setFields({
            ...fields,
            [fieldName]: !fields[fieldName]
        })
        setSaved(false)
    }

    useEffect(() => {
        if (data) {
            if (data.length > 0) {
                setFields({
                    pos: data[0].pos == 1 ? true : false,
                    dashboard: data[0].dashboard == 1 ? true : false,
                    orders: data[0].orders == 1 ? true : false,
                    products: data[0].products == 1 ? true : false,
                    providers: data[0].providers == 1 ? true : false,
                    users: data[0].users == 1 ? true : false,
                    customers: data[0].customers == 1 ? true : false,
                    settings: data[0].settings == 1 ? true : false,
                })
            }
        }
    }, [data])

    const addPermissions = (e) => {
        e.preventDefault()
        console.log('Adding', fields)
        setLoading(true)
        // return
        axios.post(`${URL_BASE}users/${userId}/create/permissions`, fields, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        }).then(response => {
            console.log(response)
            setData(fields)
            setLoading(false)
            toast.success('Permisos actualizados')
            setSaved(true)


        }).catch(error => {
            console.log(error)
            setLoading(false)
            toast.error(`Algo salió mal: ${error.message}`)
            setSaved(false)
        })
    }
    const updatePermissions = (e) => {
        e.preventDefault()
        setLoading(true)
        console.log('Updating', fields)
        axios.post(`${URL_BASE}users/${userId}/update/permissions`, fields, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        }).then(response => {
            console.log(response)
            setLoading(false)
            toast.success('Permisos actualizados')
            setSaved(true)


        }).catch(error => {
            console.log(error)
            setLoading(false)
            toast.error(`Algo salió mal: ${error.message}`)
            setSaved(false)
        })
    }
    const permissionsFields = (handlePermissions) => {
        return <div className={`permissions-wrapper ${loading && 'loading'}`}>
            <h1 className="text-center">PERMISOS DEL USUARIO {userId}</h1>
             <div className={`spinner-border spinner ${!loading && 'hide'}`} role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            <form onSubmit={handlePermissions} className=" permissions-form" >
                <div className=" my-5 col-md-4 d-flex flex-column align-items-center ">
                    <label className="form-check-label module-permission-label" htmlFor="pos">Pos</label>
                    <input onChange={(e) => { handleChange(e, 'pos') }} checked={fields.pos} className="form-check-input permission-check" name="pos" type="checkbox" id="flexCheckDefault" />
                </div>
                <div className=" my-5 col-md-4 d-flex flex-column align-items-center ">
                    <label className="form-check-label module-permission-label" htmlFor="dashboard">Dashboard</label>
                    <input onChange={(e) => { handleChange(e, 'dashboard') }} checked={fields.dashboard} className="form-check-input permission-check" name="dashboard" type="checkbox" id="flexCheckDefault" />
                </div>
                <div className=" my-5 col-md-4 d-flex flex-column align-items-center ">
                    <label className="form-check-label module-permission-label" htmlFor="orders">Ventas</label>
                    <input onChange={(e) => { handleChange(e, 'orders') }} checked={fields.orders} className="form-check-input permission-check" name="orders" type="checkbox" id="flexCheckDefault" />
                </div>
                <div className=" my-5 col-md-4 d-flex flex-column align-items-center ">
                    <label className="form-check-label module-permission-label" htmlFor="products">Productos</label>
                    <input onChange={(e) => { handleChange(e, 'products') }} checked={fields.products} className="form-check-input permission-check" name="products" type="checkbox" id="flexCheckDefault" />
                </div>
                <div className="my-5 col-md-4 d-flex flex-column align-items-center ">
                    <label className="form-check-label module-permission-label" htmlFor="providers">Proveedores</label>
                    <input onChange={(e) => { handleChange(e, 'providers') }} checked={fields.providers} className="form-check-input permission-check" name="providers" type="checkbox" id="flexCheckDefault" />
                </div>
                <div className="my-5 col-md-4 d-flex flex-column align-items-center ">
                    <label className="form-check-label module-permission-label" htmlFor="users">Usuarios</label>
                    <input onChange={(e) => { handleChange(e, 'users') }} checked={fields.users} className="form-check-input permission-check" name="users" type="checkbox" id="flexCheckDefault" />
                </div>
                <div className=" my-5 col-md-4 d-flex flex-column align-items-center ">
                    <label className="form-check-label module-permission-label" htmlFor="customers">Clientes</label>
                    <input onChange={(e) => { handleChange(e, 'customers') }} checked={fields.customers} className="form-check-input permission-check" name="customers" type="checkbox" id="flexCheckDefault" />
                </div>
                <div className=" my-5 col-md-4 d-flex flex-column align-items-center ">
                    <label className="form-check-label module-permission-label" htmlFor="customers">Ajustes</label>
                    <input onChange={(e) => { handleChange(e, 'settings') }} checked={fields.settings} className="form-check-input permission-check" name="settings" type="checkbox" id="flexCheckDefault" />
                </div>
                <div className="col-12 text-center my-5">
                    <button type="submit" className={`btn btn-primary ${loading || saved && 'disabled'}`}>Guardar</button>
                </div>
            </form>
        </div>

    }
    const renderPermissions = () => {
        if (IsLoading) {
            return <span>Cargando permisos...</span>
        }

        if (error) {
            return <span>Ha ocurrido el sigueinte error: {error}</span>
        }
        if (!data || data.length === 0) {
            return permissionsFields(addPermissions)
        }
        return permissionsFields(updatePermissions)

    }

    return (
        <>
            <div className="permissions-container">
                <BackButton saved={saved} />
                {renderPermissions()}
            </div>
            <Toaster
                 position="bottom-right"
            />
        </>
    )

}

export default UserPermissions