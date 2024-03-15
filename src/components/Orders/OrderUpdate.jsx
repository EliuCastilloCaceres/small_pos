import { Navigate, useParams } from "react-router-dom"
import usePetition from "../../hooks/usePetition";
import CustomersPicker from "../Customers/CustomersPicker";
import UsersPicker from "../Users/UsersPicker";
import { useContext, useEffect, useState } from "react";
import './orderUpdate.css'
import BackButton from "../BackButton";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import UserContext from "../../Context/UserContext";

function OrderUpdate() {
    const { user } = useContext(UserContext)
    if(user.permissions.orders !==1){
        return <Navigate to={'/dashboard'} />
    }
    const token = localStorage.getItem("token")
    const URL_BASE = import.meta.env.VITE_URL_BASE
    const { orderId } = useParams();
    const [data, isLoading, error] = usePetition(`orders/${orderId}`);
    const [order, setOrder] = useState()
    const [loading, setLoading] = useState(false)
    const [saved, setSaved] = useState(true)
    useEffect(() => {
        if (data && data.length > 0) {
            setOrder({
                subTotal: data[0].sub_total,
                discount: data[0].discount,
                total: data[0].total,
                paymentMethod: data[0].payment_method,
                information: data[0].information ? data[0].information : '',
                status: data[0].status,
                customerId: data[0].customer_id,
                userId: data[0].user_id
            })
        }
    }, [data])
    // useEffect(() => {
    //     console.log('Orden: ', order)
    //     console.log(orderId)
    // }, [order])
    const handleChange = (e, fieldName) => {
        setOrder({
            ...order,
            [fieldName]: e.target.value
        })
        setSaved(false)
    }
    const selectCustomer = (customer) => {
        setOrder({
            ...order,
            customerId: customer
        })
        setSaved(false)
    }
    const selectUser = (user) => {
        setOrder({
            ...order,
            userId: user
        })
        setSaved(false)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const updatingOrderToast = toast.loading('Actualizando Orden...')
        axios.put(`${URL_BASE}orders/update/${orderId}`, order, {
            headers: {
                'Authorization': `Bearer ${token}`,

            }
        })
            .then(response => {
                setSaved(true)
                // console.log(response)
                toast.success('Orden actualizada',{
                    id:updatingOrderToast
                })
                              
            })
            .catch(error => {
                setSaved(false)
                console.log(error)
                toast.error(`Ocurrio el sig error: ${error.message}`,{
                    id:updatingOrderToast
                })
            })
       
    }

    return (
        <>
            <div className="order-details-container">
                <BackButton saved={saved} />
                <div className="order-details-header">
                    <h2>DETALLES DE LA VENTA {orderId}</h2>
                </div>
                {
                    order && (
                        <form onSubmit={handleSubmit} className="row g-3 align-items-center fw-bold" >

                            <div className="col-md-6">
                                <label className="form-label" htmlFor="name">Cliente</label>
                                <CustomersPicker
                                    name="customerId"
                                    selectedCustomer={order.customerId}
                                    selectCustomer={selectCustomer}
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label" htmlFor="rfc">Información</label>
                                <input onChange={(e) => { handleChange(e, 'information') }} value={order.information} type="text" name="information" className="form-control" />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label" htmlFor="adress">Atendió</label>
                                <UsersPicker
                                    name='userId'
                                    selectedUser={order.userId}
                                    selectUser={selectUser}
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label" htmlFor="zipCode">Modo Pago</label>
                                <select onChange={(e) => { handleChange(e, 'paymentMethod') }} value={order.paymentMethod} className="form-select" name="paymentMethod" >
                                    <option value="efectivo">efectivo</option>
                                    <option value="tarjeta">tarjeta</option>
                                </select>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label" htmlFor="status">Estado</label>
                                <select onChange={(e) => { handleChange(e, 'status') }} value={order.status} className="form-select" name="status" >
                                    <option value="completado">completado</option>
                                    <option value="cancelado">cancelado</option>
                                </select>
                            </div>
                            <div className="col-12 text-center my-5">
                                <button type="submit" className={`btn btn-primary ${loading || saved && 'disabled'}`}>Guardar</button>
                            </div>

                        </form>
                    )
                }

            </div>
            <Toaster
                position="bottom-right"
            />
        </>

    )
}

export default OrderUpdate