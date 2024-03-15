import { Link, Navigate } from 'react-router-dom';

import { format, set } from 'date-fns';

import '../Orders/orders.css'
import './inventoryOperations.css'
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import toast, { Toaster } from "react-hot-toast";
import UserContext from '../../Context/UserContext.jsx';
import BackButton from '../BackButton.jsx';
function ProductsSold() {
    const { user } = useContext(UserContext)
    if (user.permissions.orders !== 1) {
        return <Navigate to={'/dashboard'} />
    }
    const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'))
    const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'))
    const [products, setProducts] = useState()
    const [total, setTotal] = useState(0)
    const [sku, setSku] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    
    const token = localStorage.getItem("token")
    const URL_BASE = import.meta.env.VITE_URL_BASE
    
   
    useEffect(() => {
        fetcProductsSold()
    }, [])

    const fetcProductsSold = async () => {
        setLoading(true)
        try {
            const response = await axios.get(`${URL_BASE}orders/products/sold/${startDate}/${endDate}/${sku}?`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            })
            //console.log(response)
            setProducts(response.data.products)
            setTotal(response.data.total)
            setLoading(false)
        } catch (e) {
            console.log(e)
            setError(e.message)
            setLoading(false)
        }

    }
    const handleSubmit = (e) => {
        e.preventDefault()
       
        fetcProductsSold()
    }

    return (

        <div>
            <BackButton saved={true} />
            <h2 className='fw-bold text-center my-3'>PRODUCTOS VENDIDOS</h2>
            <div className='filters-container'>
                <form onSubmit={handleSubmit} className='filters-form'>
                    <div className='date-picker-container'>
                        <label htmlFor="from">Desde:</label>
                        <input onChange={(e) => { setStartDate(e.target.value) }} name='from' type="date" className='col-auto' />
                    </div>
                    <div className='date-picker-container'>
                        <label htmlFor="to">Hasta:</label>
                        <input onChange={(e) => { setEndDate(e.target.value) }} name='to' type="date" className='col-auto' />
                    </div>
                    <div className='select-order-container'>
                        <label htmlFor="to">Sku:</label>
                        <input onChange={(e) => { setSku(e.target.value) }} name='sku' type="text" className='col-auto form-control' />
                    </div>

                    <div className='submit-btn-container'>
                        <input type="submit" className='btn btn-primary' value={'Buscar'} />
                    </div>
                </form>
            </div>
            {
                loading ?
                    (<div className="d-flex justify-content-center">
                        <div className="spinner-border m-5" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>)
                    : error ?
                        (<span>Error: {error}</span>)
                        : (
                            <div className='operations-wrapper'>
                                <div className='operations-container'>
                                    {products && products.length > 0 ? (
                                        <table className="table table-hover table-striped text-center">
                                            <thead className='table-info'>
                                                <tr>
                                                    <th scope="col">#</th>
                                                    <th className='sort' scope="col">IdOrden</th>
                                                    <th className='sort' scope="col">Sku</th>
                                                    <th scope="col">Producto</th>
                                                    <th scope="col">Talla</th>
                                                    <th scope="col">SkuTalla</th>
                                                    <th scope="col">Cantidad</th>
                                                    <th scope="col">Fecha</th>
                                       
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {
                                                    products.map((p, index) => (
                                                        <tr key={p.orders_details_id}>
                                                            <td>{index + 1}</td>
                                                            <td>{p.order_id}</td>
                                                            <td>{p.sku}</td>
                                                            <td>{p.name}</td>
                                                            <td>{p.size}</td>
                                                            <td>{p.sku_size}</td>
                                                            <td>{p.quantity}</td>
                                                            <td>{format(new Date(p.order_date), 'dd-MM-yyyy HH:mm:ss')}</td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>


                                        </table>
                                    ) : (
                                        <div className='no-sales-container'>
                                            <div className='no-sales-card'>
                                                <i className="bi bi-cart-x"></i>
                                            </div>
                                        </div>

                                    )}

                                </div>

                                <div className='inventory-resum'>
                                    <span className='fs-4 fw-bold' >Total de productos: <span className='badge bg-warning fs-4'>{total}</span> </span>
                                </div>
                            </div>

                        )}

            <Toaster
                position="bottom-right"
            />
        </div>
    )


}
export default ProductsSold