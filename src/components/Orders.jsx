import { Link } from 'react-router-dom';
import usePetition from '../hooks/usePetition.js';
import { format } from 'date-fns';
function Orders() {

    const [data, IsLoading, error] = usePetition('orders');
    let i = 1;
    return (
        <div>
            <h2 className='fw-bold text-center my-3'>VENTAS</h2>
            {
                IsLoading ?
                    (<div className="d-flex justify-content-center">
                        <div className="spinner-border m-5" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>)
                    : error ?
                        (<span>Error: {error}</span>)
                        : data ? (
                            <table className="table table-hover table-striped text-center">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">IdVenta</th>
                                        <th scope="col">Cliente</th>
                                        <th scope="col">Total</th>
                                        <th scope="col">ModoPago</th>
                                        <th scope="col">Fecha</th>
                                        <th scope="col">Atendio</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        data.map(order => (
                                            <tr key={order.order_id}>
                                                <td>{i++}</td>
                                                <td>{order.order_id}</td>
                                                <td>{order.customer_firstname} {order.customer_lastname}</td>
                                                <td>${order.total}</td>
                                                <td>{order.payment_method}</td>
                                                <td>{format(new Date(order.order_date), 'dd-MM-yyyy HH:mm:ss')}</td>
                                                <td>{order.user_firstname} {order.user_lastname}</td>
                                                <td>
                                                    {order.status === 'completado' ? (<i className=" fs-4 bi bi-check-circle-fill text-success"></i>) : (<i className=" fs-4 bi bi-x-circle-fill text-danger"></i>)}
                                                </td>
                                                <td className='d-flex justify-content-center gap-2'>
                                                    <Link to={`${order.order_id}/update`} className='btn btn-warning'>Editar</Link>
                                                    {
                                                        order.status === 'cancelado' ? (<Link className='btn btn-info'>Reanudar</Link>) :
                                                            (<button className='btn btn-danger'>Cancelar</button>)
                                                    }

                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        ) : (<span>No hay Ventas para mostrar</span>)}
        </div>
    )


}
export default Orders