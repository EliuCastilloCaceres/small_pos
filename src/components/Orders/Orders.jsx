import { Link, Navigate } from 'react-router-dom';
import usePetition from '../../hooks/usePetition.js';
import { format, set } from 'date-fns';

import './orders.css'
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import toast, { Toaster } from "react-hot-toast";
import UserContext from '../../Context/UserContext.jsx';
function Orders() {
    const { user } = useContext(UserContext)
    if (user.permissions.orders !== 1) {
        return <Navigate to={'/dashboard'} />
    }
    const [newData, setNewData] = useState(null)
    const [newDataCopy, setNewDataCopy] = useState(null)
    const [search, setSearch] = useState('')
    const [startDate, setStartDate] = useState()
    const [endDate, setEndDate] = useState()
    const [order, setOrder] = useState('desc')
    const [information, setInformation] = useState()
    const today = format(new Date(), 'yyyy-MM-dd')
    const [loading, setLoading] = useState(false)
    const [data, IsLoading, error, setData] = usePetition(`orders/date/${today}`);
    const token = localStorage.getItem("token")
    const URL_BASE = import.meta.env.VITE_URL_BASE

    useEffect(() => {
        if (data && data.length > 0) {
            setNewData(data)
            setNewDataCopy(data)
        }
    }, [data])
    useEffect(() => {
        //console.log(search)
        if (newData) {
            const result = newDataCopy.filter(item => {
                return search.toLowerCase() === "" ? item : item.customer_firstname.toLowerCase().includes(search) || item.order_id.toString().includes(search) || item.status.toLowerCase().includes(search) || item.payment_method.toLowerCase().includes(search) || item.user_firstname.toLowerCase().includes(search) || item.name.toLowerCase().includes(search)
            })
            setNewData(result)
        }
    }, [search])
    useEffect(() => {
        if (newData && newData.length > 0) {
            let totalSales = 0
            let canceledSales = 0
            let cardSales = 0
            let cashSales = 0
            newData.forEach(element => {
                if (element.status != 'cancelado') {
                    totalSales = totalSales + element.total
                    if (element.payment_method === 'tarjeta') {
                        cardSales = cardSales + element.total
                    } else {
                        cashSales = cashSales + element.total
                    }
                } else {
                    canceledSales = canceledSales + element.total
                }
            });
            setInformation({
                totalSales: formatToMoney(totalSales),
                canceledSales: formatToMoney(canceledSales),
                cardSales: formatToMoney(cardSales),
                cashSales: formatToMoney(cashSales),
            })
        } else {
            setInformation({
                totalSales: formatToMoney(0),
                canceledSales: formatToMoney(0),
                cardSales: formatToMoney(0),
                cashSales: formatToMoney(0)
            })
        }
    }, [newData])
    const formatToMoney = (amount) => {
        const amountFormatted = new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
        }).format(amount);

        return amountFormatted
    }
    const filterByDate = (e) => {
        e.preventDefault();
        if (!startDate && !endDate) {
            return
        }
        //console.log(startDate)
        //console.log(endDate)
        axios.get(`${URL_BASE}orders/date/${startDate}/${endDate}/${order}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        }).then(response => {
            //console.log(response.data.data)
            setNewData(response.data.data)
            setNewDataCopy(response.data.data)
        }).catch(error => {
            console.log(error)
        })

    }

    const handleChangeOrderstatus = (orderId, status) => {
        const statusConfig = {
            orderId,
            status: status === 'completado' ? 'cancelado' : 'completado'
        }
        const updatingOrderToast = toast.loading('Actualizando Orden...')
        axios.put(`${URL_BASE}orders/changestatus`, statusConfig, {
            headers: {
                'Authorization': `Bearer ${token}`,

            }
        })
            .then(response => {
                 
                toast.success(`Orden: ${orderId} ${statusConfig.status==='cancelado'?'Cancelada. Articulos Repuestos al Inventario':'Completada'}`, {
                    id: updatingOrderToast,
                    duration:5000
                })
                const updatedData = newData.map(order => {
                    if (order.order_id === orderId) {
                        // Actualiza el estado de la orden
                        return { ...order, status: statusConfig.status };
                    }
                    return order;
                });
                setNewData(updatedData);
            })
            .catch(error => {
                console.log(error)
                toast.error(`Ocurrio el sig error: ${error.message}`, {
                    id: updatingOrderToast
                })
            })

    }
    return (

        <div>

            <h2 className='fw-bold text-center my-3'>VENTAS</h2>
            <div className='sub-menu-wrapper mb-1'>
                <Link to={'products-sold'} type='button' className='btn btn-dark add-btn'>
                    <i className="bi bi-bag-check-fill me-2"></i>
                    Productos Vendidos
                </Link>
            </div>
            <div className='filters-container'>
                <form onSubmit={filterByDate} className='filters-form'>
                    <div className='date-picker-container'>
                        <label htmlFor="from">Desde:</label>
                        <input onChange={(e) => { setStartDate(e.target.value) }} name='from' type="date" className='col-auto' />
                    </div>
                    <div className='date-picker-container'>
                        <label htmlFor="to">Hasta:</label>
                        <input onChange={(e) => { setEndDate(e.target.value) }} name='to' type="date" className='col-auto' />
                    </div>
                    <div className='select-order-container'>
                        <label htmlFor="to">Ordenar:</label>
                        <select onChange={(e) => { setOrder(e.target.value) }} value={order} name="order">
                            <option value="asc">ascendente</option>
                            <option value="desc">descendente</option>
                        </select>
                    </div>
                    <div className='submit-btn-container'>
                        <input type="submit" className='btn btn-primary' value={'Filtrar'} />
                    </div>
                </form>
                <div className='search-filter-container'>
                    <div className='search-filter-wrapper'>
                        <input type="text" className='search' onChange={(e) => { setSearch(e.target.value.toLowerCase()) }} value={search} />
                        <i className="bi bi-search"></i>
                    </div>
                </div>
            </div>
            {
                IsLoading ?
                    (<div className="d-flex justify-content-center">
                        <div className="spinner-border m-5" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>)
                    : error ?
                        (<span>Error: {error}</span>)
                        : (
                            <div className='orders-wrapper'>
                                <div className='orders-container'>
                                    {newData && newData.length > 0 ? (
                                        <table className="table table-hover table-striped text-center">
                                            <thead className='table-info'>
                                                <tr>
                                                    <th scope="col">#</th>
                                                    <th className='sort' scope="col">
                                                        IdVenta
                                                    </th>
                                                    <th scope="col">Cliente</th>
                                                    <th scope="col">Total</th>
                                                    <th scope="col">ModoPago</th>
                                                    <th className='sort' scope="col">
                                                        Fecha
                                                    </th>
                                                    <th scope="col">Caja</th>
                                                    <th scope="col">Atendio</th>
                                                    <th scope="col">Status</th>
                                                    <th scope="col">Acciones</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {
                                                    newData.map((order, index) => (
                                                        <tr key={order.order_id}>
                                                            <td>{index + 1}</td>
                                                            <td><strong>{order.order_id}</strong></td>
                                                            <td>{order.customer_firstname} {order.customer_lastname}</td>
                                                            <td>{formatToMoney(order.total)}</td>
                                                            <td>{order.payment_method}</td>
                                                            <td>{format(new Date(order.order_date), 'dd-MM-yyyy HH:mm:ss')}</td>
                                                            <td>{order.name}</td>
                                                            <td>{order.user_firstname} {order.user_lastname}</td>
                                                            <td>{order.status === 'completado' ? (<span className='badge bg-success'>Completado</span>) : (<span className='badge bg-danger'>Cancelado</span>)}
                                                            </td>

                                                            <td className='d-flex justify-content-center gap-2'>
                                                                <Link to={`${order.order_id}/details`} className='btn btn-primary'>Detalles</Link>
                                                                {
                                                                    user.profile.toLowerCase() == 'administrador' && (
                                                                        <div className='d-flex justify-content-center gap-2'>

                                                                            <Link to={`${order.order_id}/update`} className='btn btn-warning'>Editar</Link>
                                                                            {
                                                                                order.status === 'cancelado' ? (<button onClick={() => { handleChangeOrderstatus(order.order_id, order.status) }} className='btn btn-info'>Reanudar</button>) :
                                                                                    (<button onClick={() => { handleChangeOrderstatus(order.order_id, order.status) }} className='btn btn-danger'>Cancelar</button>)
                                                                            }

                                                                        </div>

                                                                    )
                                                                }

                                                            </td>



                                                        </tr>
                                                    ))
                                                }
                                            </tbody>


                                        </table>
                                    ) : (
                                        <div className='no-sales-container'>
                                            <div className='no-sales-card'>
                                                <i className="bi bi-shop-window"></i>
                                            </div>
                                        </div>

                                    )}

                                </div>

                                <div className='information-wrapper'>
                                    <span className='fs-3 fw-bold information-card' >Efectivo: <span className='badge bg-success fs-3'><i className="bi bi-cash-coin fs-1"></i> {information ? information.cashSales : '0.00'}</span> </span>
                                    <span className='fs-3 fw-bold information-card'>Tarjeta: <span className='badge bg-info fs-3'><i className="bi bi-credit-card-2-front fs-1"></i> {information ? information.cardSales : '0.00'}</span> </span>
                                    <span className='fs-3 fw-bold information-card'>Total: <span className='badge bg-warning fs-3'><i className="bi bi-wallet2 fs-1"></i> {information ? information.totalSales : '0.00'}</span> </span>
                                </div>
                            </div>

                        )}

            <Toaster
                position="bottom-right"
            />
        </div>
    )


}
export default Orders