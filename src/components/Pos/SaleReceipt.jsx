
import { useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import Swal from 'sweetalert2';
import { formatToMoney } from '../../helpers/currencyFormatter';
import usePetition from '../../hooks/usePetition';
import './saleReceipt.css'
import { format } from 'date-fns';
function SaleReceipt({ sale, handleToggleModal, emptyCart }) {
    const URL_BASE = import.meta.env.VITE_URL_BASE
    const [receiptInfo, isLoading, error] = usePetition('cash-registers/receipt')
    useEffect(() => {
        if (sale) {
            console.log('sale',sale)
        }
    }, [sale])

    const clenaSale = () => {
        handleToggleModal()
        emptyCart()
    }
    const componentRef = useRef()
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `Venta No.${sale.orderId}`,
        onBeforePrint: () =>{
            
        },
        onAfterPrint: () => {
            handleToggleModal()
            emptyCart()
        },
    });
    // useEffect(() => {
    //     if (sale) {
    //         console.log('saleDt: ', sale)
    //     }
    // }, [sale])
    useEffect(() => {
        const saleFinished = () => {
            Swal.fire({
                icon: "success",
                title: `Cambio: ${formatToMoney(sale.change)}`,
                text: 'Venta Finalizada',
                confirmButtonText: "Imprimir Recibo",
                showCancelButton: false,
                showDenyButton: true,
                denyButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    handlePrint()
                } else if (result.isDenied) {
                    clenaSale()
                }
            })

        }
        saleFinished()

    }, [])
    const renderSaleReceipt = () => {
        if (sale && receiptInfo) {
            return (
                <div className='sale-receipt-container' ref={componentRef}>
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
                            <span>Tienda: </span>
                            <span>{receiptInfo[0].store ? receiptInfo[0].store : ''}</span>
                        </div>
                        <div>
                            <span>Direccion: </span>
                            <span>{receiptInfo[0].address ? receiptInfo[0].address : ''}</span>
                        </div>
                        <div>
                            <span>RFC: </span>
                            <span>{receiptInfo[0].rfc ? receiptInfo[0].rfc : ''}</span>
                        </div>
                        <div>
                            <span>Cliente: </span>
                            <span>{sale.customer ? sale.customer.first_name : ''}</span>
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
                                sale.products.map(p => (
                                    <li className='item' key={p.size ? p.size.size_id : p.product_id}>

                                        <span className='product-name'>{p.name}{p.size ? `/${p.size.size}` : ''}</span>
                                        <span>{p.qty} x</span>
                                        <span>{formatToMoney(p.sale_price)}</span>
                                        <span>{formatToMoney(p.qty * p.sale_price)}</span>

                                    </li>
                                ))
                            }
                        </ul>
                        <div className="receipt-separator"></div>
                        <div className='sale-recipt-totals'>
                            <div className="total-item"><span>SubTotal:</span> <span>{formatToMoney(sale.subTotal)}</span></div>
                            <div className="total-item"><span>Desc:</span><span>{formatToMoney(sale.discount.disc)}</span></div>
                            <div className="total-item"> <span><strong>Total:</strong></span><span><strong>{formatToMoney(sale.total)}</strong></span></div>
                            <div className='receipt-separator'></div>
                            <div className="total-item"><span>ModoPago:</span><span>{sale.paymentMethod}</span></div>
                            <div className="total-item"><span>Entrega:</span><span>{formatToMoney(sale.cashReceived)}</span></div>
                            <div className="total-item"><span>Cambio:</span><span>{formatToMoney(sale.change)}</span></div>
                            
                        </div>
                        <div className="receipt-separator"></div>
                        <div className="recipt-footer">
                        <span>**Folio: {sale.orderId}**</span>
                        <span>{format(new Date(), 'dd-MM-yyyy HH:mm:ss')}</span>
                        <span>Le antendió: {sale.user.first_name}</span>
                        <span className='mt-3'>¡GRACIAS POR SU COMPRA!</span>
                        </div>
                    </div>
                </div>
            )
        }
    }
    return (
        <>
            {renderSaleReceipt()}
            <button onClick={() => { handlePrint() }} className='btn btn-primary'>Print this out</button>
        </>
    )
}


export default SaleReceipt