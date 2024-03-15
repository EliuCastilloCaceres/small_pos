import { Link, Navigate } from 'react-router-dom';

import { format, set } from 'date-fns';

import '../Orders/orders.css'
import './inventoryOperations.css'
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import toast, { Toaster } from "react-hot-toast";
import UserContext from '../../Context/UserContext.jsx';
import BackButton from '../BackButton.jsx';
function InventoryOperations() {
    const { user } = useContext(UserContext)
    if (user.permissions.orders !== 1) {
        return <Navigate to={'/dashboard'} />
    }
    const [search, setSearch] = useState('')
    const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'))
    const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'))
    const [operations, setOperations] = useState()
    const [operationsCopy, setOperationsCopy] = useState()
    const [operationType, setOperationType] = useState('entry')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState()
    const [productsTotal, setProductsTotal] = useState(0)
    const token = localStorage.getItem("token")
    const URL_BASE = import.meta.env.VITE_URL_BASE
    useEffect(() => {
        //console.log(search)
        if (operationsCopy) {
            const result = operationsCopy.filter(item => {
                return search.toLowerCase() === "" ? item : item.product_sku.toLowerCase() === search || item.inventory_id.toString() === search || item.reason.toLowerCase().includes(search) || item.product_name.toLowerCase().includes(search)
            })
            setOperations(result)
        }
    }, [search])
    useEffect(() => {
        if (operations && operations.length > 0) {
            let total = 0
            operations.map(op => {
                total = total + op.quantity
            })
            setProductsTotal(total)
        }
    }, [operations])
    useEffect(() => {
        fetchOperations()
    }, [])

    const fetchOperations = async () => {
        setLoading(true)
        try {
            const response = await axios.get(`${URL_BASE}products/inventory/getAll/${startDate}/${endDate}/${operationType}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            })
            //console.log(response)
            let data = response.data.data
            setOperations(data)
            setOperationsCopy(data)
            setLoading(false)
        } catch (e) {
            console.log(e)
            setLoading(false)
            setError(e.message)
        }

    }
    const handleSubmit = (e) => {
        e.preventDefault()
        const opInfo = {
            startDate,
            endDate,
            operationType,
        }
       // console.log(opInfo)
        fetchOperations()
    }

    return (

        <div>
            <BackButton saved={true} />
            <h2 className='fw-bold text-center my-3'>OPERACIONES DE INVENTARIO</h2>
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
                        <label htmlFor="to">operacion:</label>
                        <select onChange={(e) => { setOperationType(e.target.value) }} value={operationType} name="operationType">
                            <option value="entry">Entradas</option>
                            <option value="exit">Salidas</option>
                        </select>
                    </div>

                    <div className='submit-btn-container'>
                        <input type="submit" className='btn btn-primary' value={'Buscar'} />
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
                                    {operations && operations.length > 0 ? (
                                        <table className="table table-hover table-striped text-center">
                                            <thead className='table-info'>
                                                <tr>
                                                    <th scope="col">#</th>
                                                    <th className='sort' scope="col">IdOperación</th>
                                                    <th className='sort' scope="col">Operación</th>
                                                    <th scope="col">Sku</th>
                                                    <th scope="col">Producto</th>
                                                    <th scope="col">Talla</th>
                                                    <th scope="col">SkuTalla</th>
                                                    <th scope="col">Cantidad</th>
                                                    <th scope="col">Motivo</th>
                                                    <th scope="col">Fecha</th>
                                                    <th scope="col">Usuario</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {
                                                    operations.map((op, index) => (
                                                        <tr key={op.inventory_id}>
                                                            <td>{index + 1}</td>
                                                            <td><strong>{op.inventory_id}</strong></td>
                                                            <td>{op.operation_type === 'entry' ? (<span className='badge bg-success'>Entrada</span>) : (<span className='badge bg-danger'>Salida</span>)} </td>
                                                            <td>{op.product_sku}</td>
                                                            <td>{op.product_name}</td>
                                                            <td>{op.size}</td>
                                                            <td>{op.size_sku}</td>
                                                            <td>{op.quantity}</td>
                                                            <td>{op.reason}</td>
                                                            <td>{format(new Date(op.operation_date), 'dd-MM-yyyy HH:mm:ss')}</td>
                                                            <td>{op.first_name} {op.last_name}</td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>


                                        </table>
                                    ) : (
                                        <div className='no-sales-container'>
                                            <div className='no-sales-card'>
                                                <i className="bi bi-arrow-down-up"></i>
                                            </div>
                                        </div>

                                    )}

                                </div>

                                <div className='inventory-resum'>
                                    <span className='fs-4 fw-bold' >Total de productos: <span className='badge bg-warning fs-4'>{productsTotal}</span> </span>
                                </div>
                            </div>

                        )}

            <Toaster
                position="bottom-right"
            />
        </div>
    )


}
export default InventoryOperations