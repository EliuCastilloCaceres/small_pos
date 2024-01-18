import { useParams } from "react-router-dom"
import usePetition from "../../hooks/usePetition";
import CustomersPicker from "../Customers/CustomersPicker";
import UsersPicker from "../Users/UsersPicker";

function OrderUpdate() {
    const { orderId } = useParams();
    const [order, isLoading, error] = usePetition(`orders/${orderId}`);
    return (
        <div className="container">
            <h2 className='fw-bold text-center my-3'>Detalles Venta {orderId}</h2>
            {isLoading ?
                (<span>Cargando datos...</span>)
                : error ?
                    (<span>Error: {error}</span>)
                    : order ? (
                        <form className="row g-3 align-items-center fw-bold">
                            <div className="col-md-1">
                                <label htmlFor="orderID" className="form-label">Id</label>
                                <input disabled readOnly type="text" className="form-control-plaintext" defaultValue={order[0].order_id} />
                            </div>
                            <div className="col-md-2">
                            <label htmlFor="paymentMethod" className="form-label">Modo Pago</label>
                                <select className="form-select" defaultValue={order[0].payment_method}>
                                    <option value="efectivo">efectivo</option>
                                    <option value="tarjeta">tarjeta</option>
                                </select>
                            </div>
                            <div className="col-md-7">
                                <label htmlFor="orderID" className="form-label">Información</label>
                                <textarea className="form-control" id="exampleFormControlTextarea1" defaultValue={order[0].information} ></textarea>
                            </div>
                            <div className="col-md-5">
                            <label className="form-label">Cliente</label>
                                <CustomersPicker selectedCustomer={order[0].customer_id} />
                            </div>
                            <div className="col-md-5">
                            <label className="form-label">Usuario</label>
                                <UsersPicker selectedUser={order[0].user_id} />
                            </div>
                            <div className="col-12">
                                <button type="submit" className="btn btn-primary">Sign in</button>
                            </div>
                        </form>) : (<span>No hay datos para mostrar</span>
                    )}
        </div>
    )
}

export default OrderUpdate