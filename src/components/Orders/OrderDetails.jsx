import axios from "axios";
import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom";
import './orderDetails.css'
import { format } from "date-fns";
import { formatToMoney } from "../../helpers/currencyFormatter";
import usePetition from "../../hooks/usePetition";
import { useReactToPrint } from "react-to-print";
import '../Pos/saleReceipt.css'
function OrderDetails() {
    const token = localStorage.getItem("token")
    const URL_BASE = import.meta.env.VITE_URL_BASE
    const [receiptInfo, isLoading, error] = usePetition('cash-registers/receipt')
    const { orderId } = useParams();
    const [order, setOrder] = useState()
    const [orderDetails, setOrderDetails] = useState()
    const [loading, setLoading] = useState(false)
    const fetchOrderDetails = async () => {
        setLoading(true)
        try {
            const result = await axios.get(`${URL_BASE}orders/details/${orderId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            })
            setOrder(result.data.order[0])
            console.log('order: ', result.data.order[0])
            setOrderDetails(result.data.orderDetails)
            console.log('orderDet: ', result.data.orderDetails)
            setLoading(false)
        } catch (e) {
            console.log('Ocurrio un error: ' + e)
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchOrderDetails()
    }, [])
    const componentRef = useRef()
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `Venta No.${order?order.order_id:''}`,
        onBeforePrint: () =>{
            
        },
        onAfterPrint: () => {
        },
    });
    const renderSaleReceipt = () => {
        if (order && receiptInfo) {
            return (
                <div className='sale-receipt-container ' ref={componentRef}>
                    <div className='sale-receipt-wrapper'>
                        <div className='sale-recipt-header'>
                        {
                            receiptInfo[0].image && (
                                <div className='receipt-logo-wrapper'>
                                    <img src={`${URL_BASE}receipt/images/${receiptInfo[0].image}`} />
                                </div>
                            )
                        }
                        <div>
                            <span>Direccion: </span>
                            <span>{receiptInfo[0].address ? receiptInfo[0].address : ''}</span>
                        </div>
                        <div>
                            <span>RFC: </span>
                            <span>{receiptInfo[0].rfc ? receiptInfo[0].rfc : ''}</span>
                        </div>
                        </div>
                        <div className='receipt-separator'></div>
                        <ul className='items-list'>
                            <li className='item'>

                                <span><strong>Articulo</strong></span>
                                <span><strong>Cant</strong></span>
                                <span><strong>Precio</strong></span>
                                <span><strong>Total</strong></span>

                            </li>
                            {
                                orderDetails.map(od => (
                                    <li className='item' key={od.orders_details_id}>

                                        <span className='product-name'>{od.name}{od.size ? `/${od.size}` : ''}</span>
                                        <span>{od.quantity} x</span>
                                        <span>{formatToMoney(od.final_price)}</span>
                                        <span>{formatToMoney(od.quantity * od.final_price)}</span>

                                    </li>
                                ))
                            }
                        </ul>
                        <div className="receipt-separator"></div>
                        <div className='sale-recipt-totals'>
                            <div className="total-item"><span>SubTotal:</span> <span>{formatToMoney(order.sub_total)}</span></div>
                            <div className="total-item"><span>Desc:</span><span>{formatToMoney(order.discount)}</span></div>
                            <div className="total-item"> <span><strong>Total:</strong></span><span><strong>{formatToMoney(order.total)}</strong></span></div>
                            <div className='receipt-separator'></div>
                            <div className="total-item"><span>ModoPago:</span><span>{order.payment_method}</span></div>
                            <div className="total-item"><span>Entrega:</span><span>{formatToMoney(order.cash_received)}</span></div>
                            <div className="total-item"><span>Cambio:</span><span>{formatToMoney(order.cash_change)}</span></div>
                            
                        </div>
                        <div className="receipt-separator"></div>
                        <div className="recipt-footer">
                        <span>**Folio: {order.order_id}**</span>
                        <span>{format(new Date(order.order_date), 'dd-MM-yyyy HH:mm:ss')}</span>
                        <span className='mt-3'>¡GRACIAS POR SU COMPRA!</span>
                        </div>
                    </div>
                </div>
            )
        }
    }
    const renderOrderDetails = () => {
        if (loading) {
            return <span>Cargando...</span>
        }
        if (order && orderDetails) {
            return (
                <div className="details-wrapper p-5">
                    <h2 className="text-center">Detalle de venta #{orderId}</h2>
                    <div className="details-header">
                        <div className="header-wrapper">
                            <span className="fs-5 ">Fecha: <span className="fw-bold">{format(new Date(order.order_date), 'dd-MM-yyyy HH:mm:ss')}</span> </span>
                            <span className="fs-5 ">No Orden: <span className="fw-bold">{order.order_id} </span></span>
                        </div>
                    </div>
                    <div className="details-body">
                        <div className="mb-2"><span className="fs-5 fw-bold">Articulos vendidos</span></div>
                        <div className="table-wrapper">
                            <table id='details-table' className="table table-hover table-striped text-center align-middle">
                                <thead className="table-dark">
                                    <tr>
                                        <th className='column-headers' scope="col">#</th>
                                        <th className='sticky column-headers' scope="col">Sku</th>
                                        <th className='sticky-2 column-headers' scope="col">Articulo</th>
                                        <th className='sticky-2 column-headers' scope="col">Talla</th>
                                        <th className='column-headers' id='isVarCell' scope="col">Precio</th>
                                        <th className='column-headers' scope="col">PrecioFinal</th>
                                        <th className='column-headers' scope="col">Cantidad</th>
                                        <th className='column-headers' scope="col">Um</th>
                                        <th className='column-headers' scope="col">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        orderDetails.map((od, index) => (
                                            <tr key={od.orders_details_id}>
                                                <td className='column-values'>{index + 1}</td>
                                                <td className='column-values'>{od.sku}</td>
                                                <td className='column-values'>{od.name}</td>
                                                <td className='column-values'>{od.size}</td>
                                                <td className='column-values'>{formatToMoney(od.sale_price)}</td>
                                                <td className='column-values'>{formatToMoney(od.final_price)}</td>
                                                <td className='column-values'>{od.quantity}</td>
                                                <td className='column-values'>{od.uom}</td>
                                                <td className='column-values'>{formatToMoney(od.final_price * od.quantity)}</td>

                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                        <div className="details-footer">

                            <div className="information">
                                <h5>Nota de orden</h5>
                                <span className="information-wrapper">{order.information}</span>
                            </div>
                            <div className="d-flex gap-3 fs-3">
                                <span >Subtotal: <span className="fw-bold">{formatToMoney(order.sub_total)}</span></span>
                                <span>Descuento: <span className="text-danger fw-bold">{formatToMoney(order.discount)}</span></span>
                                <span>Total: <span className="text-success fw-bold">{formatToMoney(order.total)}</span></span>
                            </div>
                            <div>
                                <button onClick={handlePrint} className="btn btn-dark">Imprimir Ticket</button>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }
    return (
        <>
            {renderOrderDetails()}
            <div className="hide">
            {renderSaleReceipt()}
            </div>
            
        </>
    )
}

export default OrderDetails