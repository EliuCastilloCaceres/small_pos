import { useContext, useEffect, useState } from 'react'
import { formatToMoney } from '../../helpers/currencyFormatter'
import DashboardCard from './DashboardCard'
import './dashboard.css'
import { format } from 'date-fns'
import axios from 'axios'
import UserContext from '../../Context/UserContext'
import { Navigate } from 'react-router-dom'
function Dashboard() {
    const { user } = useContext(UserContext)
    if(user.permissions.dashboard !==1){
        return <Navigate to={'/'} />
    }
    const URL_BASE = import.meta.env.VITE_URL_BASE
    const token = localStorage.getItem("token")
    const [productsSold, setProductsSold] = useState()
    const [cashRegistersInfo, setCashRegistersInfo] = useState()
    const [orderTotals, setOrderTotals] = useState()
    const [crSumBalances, setCrSumBalances] = useState()

    useEffect(() => {
        if (cashRegistersInfo && cashRegistersInfo.length>0) {
            let allBalances = 0
            cashRegistersInfo.map(cr=>{
                allBalances = allBalances + cr.balance
            })
            setCrSumBalances(allBalances)
        }
    }, [cashRegistersInfo])

    useEffect(() => {
        fetchData()
    }, [])
    const fetchData = async () => {
        const queryDate = format(new Date(), 'yyyy-MM-dd')
        try {
            const result = await axios.get(`${URL_BASE}dashboard/${queryDate}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,

                }
            })
            // console.log(result)
            if (result) {
                if (result.data.cashRegistersInfo.length > 0) {
                    setCashRegistersInfo(result.data.cashRegistersInfo)
                }
                if (result.data.orderTotals.length > 0) {
                    setOrderTotals(result.data.orderTotals[0])
                }
                if (result.data.productsSold.length > 0) {
                    setProductsSold(result.data.productsSold)
                }

            }
        } catch (e) {
            console.log(e)
            console.log('Ocurrio un error: ' + e)
        }
    }
    return (
        <div className="main-dashboard-container">
            <section className='cards-section'>
                <DashboardCard
                    value={orderTotals && orderTotals.orders_total ? (orderTotals.orders_total):(0)}
                    description={'Ventas Hoy'}
                    iconClassName={'bi bi-cart'}
                />
                <DashboardCard
                    value={orderTotals && orderTotals.products ? (orderTotals.products) : (0)}
                    description={'Productos Vendidos'}
                    iconClassName={'bi bi-box'}
                />
                {/* <DashboardCard
            value={'laptop school '}
            description={'Más Vendido'}
            iconClassName={'bi bi-award'}
            /> */}
                <DashboardCard
                    value={formatToMoney(orderTotals && orderTotals.income ? (orderTotals.income) : (0))}
                    description={'Ganancia'}
                    iconClassName={'bi bi-cash-stack'}
                />
            </section>
            <section className='info-section'>
                <div className='info-card-section'>
                    <h2 className='card-section-title'>Productos vendidos</h2>
                    {
                        productsSold && productsSold.length > 0 ? (
                            <>
                                <div className="content-wrapper">
                                    <table id='dashboard-products-table' className='table table-hover'>
                                        <thead className='table-primary'>
                                            <tr>
                                                <th>#</th>
                                                <th>Imagen</th>
                                                <th>Sku</th>
                                                <th>Nombre</th>
                                                <th>Cantidad</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {

                                                productsSold.map((p, index) => (
                                                    <tr key={p.product_id}>
                                                        <td>{index + 1}</td>
                                                        <td> <img className='info-section-product-image' src={`${URL_BASE}product/images/${p.image ? p.image : 'sin_imagen.jpg'}`} alt="product-image" /></td>
                                                        <td>{p.sku}</td>
                                                        <td>{p.name}</td>
                                                        <td>{p.total_sold}</td>
                                                    </tr>
                                                ))

                                            }
                                        </tbody>
                                    </table>
                                </div>
                                <div className='mt-3'>
                                    Total: <strong>{orderTotals.products}</strong>
                                </div>
                            </>
                        ) : (
                            <span>Sin productos vendidos</span>
                        )
                    }

                </div>
                <div className='info-card-section'>
                    <h2 className='card-section-title'>Cajas Abiertas</h2>
                    {
                        cashRegistersInfo && cashRegistersInfo.length > 0 ? (
                            <>
                                <ul className='content-wrapper'>
                                    {
                                        cashRegistersInfo.map((cr, index) => (
                                            <li key={cr.cash_register_id} className='cr-card'>
                                            <div>
                                              <span>#</span>
                                              <span>{index + 1}</span>
                                            </div>
                                            <div>
                                              <span>Caja</span>
                                              <span>{cr.name}</span>
                                            </div>
                                            <div>
                                              <span>Cajero</span>
                                              <span>{cr.first_name} {cr.last_name}</span>
                                            </div>
                                            <div>
                                              <span >Ingresos</span>
                                              <span className='text-success'>{formatToMoney(cr.deposits_total)}</span>
                                            </div>
                                            <div>
                                              <span >Egresos</span>
                                              <span className='text-danger'>{formatToMoney(cr.withdrawals_total)}</span>
                                            </div>
                                            <div>
                                              <span>Saldo</span>
                                              <span className={cr.balance>=0?'text-success':'text-danger'}>{formatToMoney(cr.balance)}</span>
                                            </div>
                                          </li>
                                          
                                           
                                        ))
                                    }
                                </ul>
                                <div>
                                    Total en cajas: <strong>{formatToMoney(crSumBalances)}</strong>
                                </div>

                            </>
                        ) : (<span>Sin Cajas Abiertas</span>)
                    }
                </div>
            </section>
        </div>
    )
}

export default Dashboard