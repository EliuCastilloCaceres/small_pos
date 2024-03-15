import { useContext, useEffect, useRef, useState } from 'react';
import './pay.css'
import { formatToMoney } from '../../helpers/currencyFormatter';
import axios from 'axios';
import UserContext from '../../Context/UserContext';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import SaleReceipt from './saleReceipt';
function Pay({ cartProducts, discountApplied, subtotal, total, note, customer, cashRegister, emptyCart, toggleModal, setDt, setDtCopy, setSizes, focusInput }) {
    const { user } = useContext(UserContext)
    const URL_BASE = import.meta.env.VITE_URL_BASE
    const token = localStorage.getItem("token")
    const [payView, setPayView] = useState(1)
    const [payMethod, setPayMethod] = useState('efectivo')
    const [cashReceived, setCashRecived] = useState('')
    const [cashChange, setCashChange] = useState(0)
    const [lastOrderId, setLastOrderId] = useState('')
   
    const cleanStates = ()=>{
        setPayMethod('efectivo')
        setCashRecived('')
        setCashChange(0)
        setPayView(1)
    }
    useEffect(() => {
        if (cartProducts.length === 0) {
            cleanStates()
        }
    }, [cartProducts])

   
    const handleToggleModal = () => {
        cleanStates()
        toggleModal()
    }
    const handleGoBack = () => {
        if (payView === 1) {
            handleToggleModal()
        } else {
            setCashRecived('')
            setPayView(prev => prev - 1)
        }

    }
    const handleCashRecived = (event) => {
        const value = event.target.value;
        if (/^\d*\.?\d*$/.test(value)) {
            setCashRecived(value)
        };
    }
    const handleCashRKeyDown = (e)=>{
        if (e.key === 'Enter') {
            endSale()    
        }
    }

    const endSale = async () => {
        if(cashReceived===''|| cashReceived<total){
            toast.error('Cantidad inválida')
            return
        }
        const toastId = toast.loading('Procesando')
        const change = parseFloat(cashReceived)-parseFloat(total)
        setCashChange(change)
        const orderData = {
            products: cartProducts,
            subTotal: subtotal,
            discount: discountApplied.disc,
            total,
            paymentMethod: payMethod,
            cashReceived: cashReceived,
            cashChange:change,
            information: note,
            customerId: parseInt(customer),
            userId: user.user_id,
            cashRegId: cashRegister.cash_register_id
        }
        console.log('OrderDt: ', orderData)
        try {
            const response = await axios.post(`${URL_BASE}orders/create`, orderData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            })
           // console.log(response)
            setLastOrderId(response.data.orderId)
            setPayView(3)
            setDt(response.data.updatedProducts)
            setDtCopy(response.data.updatedProducts)
           // console.log(response.data.updatedSizes)
            setSizes(response.data.updatedSizes)
            focusInput()
           
            toast.dismiss(toastId)
        } catch (e){
            toast.error(`Algo salió mal: ${e}`, {
                id: toastId,
              });
            console.log(e)
        }

    }
    const renderView = () => {
        if (payView === 1) {
            return (
                <div className='pay-container'>
                    <div>Método de Pago</div>
                    <div className="body">
                        <div className="payment-method-wrapper">
                            <button onClick={() => {
                                setPayMethod('efectivo')
                                setPayView(2)

                            }} className='method cash-method btn btn-success'>
                                <span>Efectivo</span>
                                <i className="bi bi-cash"></i>
                            </button>
                            <button onClick={() => {
                                setPayMethod('tarjeta')
                                setCashRecived(total)
                                setPayView(2)
                            }} className=" method card-method btn btn-primary">
                                <span>Tarjeta</span>
                                <i className="bi bi-credit-card"></i>
                            </button>
                        </div>
                        <div className='total-to-pay-wrapper'>
                            <span>Total</span>
                            <span>{formatToMoney(total)}</span>
                        </div>

                    </div>
                    <CancelButton handleToggleModal={handleToggleModal} />
                </div>
            )
        }
        else if (payView === 2) {
            if (payMethod === 'efectivo') {
                return (
                    <div className='pay-container'>
                        <div className="body">
                            <div className='cash-payment-wrapper'>
                                <div className='cash-received'>
                                    <span>Entrega Cliente</span>
                                    <input autoFocus className='text-center'
                                    onKeyDown={(e)=>{handleCashRKeyDown(e)}} 
                                    onChange={(e) => { 
                                        handleCashRecived(e)
                                         }} value={cashReceived} />
                                    <span>{formatToMoney(cashReceived)}</span>
                                </div>
                                <EndSaleButton endSale={endSale} />
                            </div>
                            <div className='total-to-pay-wrapper'>
                                <span>Total</span>
                                <span>{formatToMoney(total)}</span>
                            </div>

                        </div>
                        <CancelButton handleToggleModal={handleToggleModal} />
                    </div>

                )
            }
            else if (payMethod === 'tarjeta') {
                return (
                    <div className='pay-container'>
                        <div className="body">
                            <div className='cash-payment-wrapper'>
                                <EndSaleButton endSale={endSale} />
                            </div>
                            <div className='total-to-pay-wrapper'>
                                <span>Total</span>
                                <span>{formatToMoney(total)}</span>
                            </div>

                        </div>
                        <CancelButton handleToggleModal={handleToggleModal} />
                    </div>
                )
            }
        }
        else if (payView === 3) {
            const sale = {
                orderId:lastOrderId,
                products: cartProducts,
                subTotal: subtotal,
                discount: discountApplied,
                total,
                cashReceived:cashReceived,
                change: cashChange,
                paymentMethod: payMethod,
                customerId: parseInt(customer),
                user:user,
                cashReg: cashRegister
            }
            return (
                <SaleReceipt sale={sale}  handleToggleModal={handleToggleModal} emptyCart={emptyCart}  />
            )
        }
    }
    return (<>
        <div className='go-back-btn-wrapper'>
            <button tabIndex={-1} onClick={() => { handleGoBack() }} className='go-back-btn btn btn-warning'>
                <i className="bi bi-arrow-left"></i>
            </button>
        </div>
        {renderView()}
    </>)
}
export default Pay

function CancelButton({ handleToggleModal}) {
    return (
        <button onClick={() => { handleToggleModal() }} className='btn btn-secondary mt-5'>Cancelar</button>
    )
}
function EndSaleButton({ endSale }) {
    return (
        <button onClick={() => { 
            endSale() 
            }} className='btn btn-success end-sale-btn'>
            Finalizar Venta
            <i className="bi bi-arrow-right-square-fill"></i>
        </button>
    )
}