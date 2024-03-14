import { useEffect, useRef, useState } from 'react'
import './cashRegCut.css'
import { formatToMoney } from '../../../helpers/currencyFormatter'
import usePetition from '../../../hooks/usePetition'
import { format } from 'date-fns'
import axios from 'axios'
import CloseCarshRegReport from './CloseCashRegReport'
import { useReactToPrint } from 'react-to-print'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
function CashRegCut({ cashRegister, cashCutBand, balance, deposits, withdrawals, movements }) {
    const URL_BASE = import.meta.env.VITE_URL_BASE
    const token = localStorage.getItem("token")
    const [cashCounted, setCashCounted] = useState(0)
    const [cardCounted, setCardCounted] = useState(0)
    const [totalCounted, setTotalCounted] = useState(0)
    const [cashCalculated, setCashCalculated] = useState(0)
    const [cardCalculated, setCardCalculated] = useState(0)
    const [cashSales, setCashSales] = useState(0)
    const [CashWithdrawal, setcashWithdrawal] = useState(0)
    const navigate = useNavigate()

    const CloseCashReg = async () => {
        console.log('opcdId: ',)
        const closeDetails = {
            closeAmount: balance - CashWithdrawal,
            ocdId: cashRegister.open_close_details_id
        }
        console.log('CloseD: ', closeDetails)
        try {
            await axios.post(`${URL_BASE}cash-registers/${cashRegister.cash_register_id}/close`, closeDetails, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            })
            toast.success('Caja cerrada correctamente')
        } catch (e) {
            console.log('Ocurrio un error: ' + e)
            toast.error('Ocurrio un error: ' + e)
        }
    }
    const fetchTotals = async () => {
        const queryDate = format(new Date(cashRegister.open_date), 'yyyy-MM-dd HH:mm:ss')
        try {
            const result = await axios.get(`${URL_BASE}cash-registers/${cashRegister.cash_register_id}/${queryDate}/totals`, {
                headers: {
                    'Authorization': `Bearer ${token}`,

                }
            })
            console.log('Totals: ', result.data)
            if (result && result.data.data.length > 0) {
                console.log('the totals; ', result)
                if (result.data.data[0].card_total > 0) {
                    setCardCalculated(result.data.data[0].card_total)
                }
                if (result.data.data[0].cash_total > 0) {
                    setCashSales(result.data.data[0].cash_total)
                }


            }
        } catch (e) {
            console.log('Ocurrio un error: ' + e)
        }
    }
    useEffect(() => {
        if (balance) {
            setCashCalculated(balance)
        }
        fetchTotals()


    }, [cashCutBand])
    useEffect(() => {
        if (cardCounted === '' && cashCounted === '') {
            setTotalCounted(0)
        }
        else if (cardCounted === '') {
            setTotalCounted(parseFloat(cashCounted) + 0)
        } else if (cashCounted === '') {
            setTotalCounted(0 + parseFloat(cardCounted))
        } else {
            setTotalCounted(parseFloat(cashCounted) + parseFloat(cardCounted))
        }


    }, [cardCounted, cashCounted, cashCalculated, cardCalculated])

    const componentRef = useRef()
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `Corte de Caja No. ${cashRegister.open_close_details_id}`,
        onBeforePrint: () => {
            console.log("before printing...")
        },
        onAfterPrint: () => {
            console.log('after printing...')
            CloseCashReg()
            navigate('/open-cash-register')
        },
    });
    const handleCashCountedChange = (event) => {
        const value = event.target.value
        if (/^\d*\.?\d*$/.test(value)) {
            setCashCounted(value)
        }
    }
    const handleCardCountedChange = (event) => {
        const value = event.target.value
        if (/^\d*\.?\d*$/.test(value)) {
            setCardCounted(value)
        }
    }
    const handleCashCountedBlur = (event) => {
        const value = event.target.value
        if (value === '') {
            setCashCounted(0)
        }
    }
    const handleCardCountedBlur = (event) => {
        const value = event.target.value
        if (value === '') {
            setCardCounted(0)
        }
    }
    return (
        <>
            <div className="cash-cut-container">
                <div className="cash-cut-body">
                    <div className="cash-cut-item">
                        <span><strong>Modo</strong></span>
                        <span>Efectivo</span>
                        <span>Tarjeta</span>
                        <div className='total'><span>Total</span></div>
                    </div>
                    <div className="cash-cut-item">
                        <span><strong>Contado</strong></span>
                        <input autoFocus onChange={(e) => { handleCashCountedChange(e) }} onBlur={(e) => { handleCashCountedBlur(e) }} type="text" value={cashCounted} />
                        <input onChange={(e) => { handleCardCountedChange(e) }} onBlur={(e) => { handleCardCountedBlur(e) }} type="text" value={cardCounted} />
                        <span className='total'><strong>{formatToMoney(totalCounted)}</strong></span>
                    </div>
                    <div className="cash-cut-item">
                        <span><strong>Calculado</strong></span>
                        <input readOnly value={cashCalculated} type="text" />
                        <input readOnly value={cardCalculated} type="text" />
                        <span className='total'><strong>{formatToMoney(cashCalculated + cardCalculated)}</strong></span>
                    </div>
                    <div className="cash-cut-item">
                        <span><strong>Diferencia</strong></span>
                        <input readOnly type="text" value={cashCounted - cashCalculated} />
                        <input readOnly type="text" value={cardCounted - cardCalculated} />
                        <span className='total'><strong>{formatToMoney((cashCounted - cashCalculated) + (cardCounted - cardCalculated))}</strong></span>
                    </div>
                    <div className="cash-cut-item">
                        <span><strong>Retiro de Efectivo</strong></span>
                        <input onChange={(e) => { setcashWithdrawal(e.target.value) }} type="text" value={CashWithdrawal} />
                        <span>Saldo en Caja: <span>{balance - CashWithdrawal}</span></span>
                    </div>
                    <button className='btn btn-primary' onClick={() => {
                        handlePrint()
                    }}>
                        <i className="bi bi-door-closed-fill"></i>
                        Cerrar Caja
                    </button>
                </div>
                <div className='print-wrapper'>

                    <CloseCarshRegReport
                        ref={componentRef}
                        movements={movements}
                        cashRegister={cashRegister}
                        cashSales={cashSales}
                        cardSales={cardCalculated}
                        balance={balance}
                        deposits={deposits}
                        withdrawals={withdrawals}
                        CashWithdrawal={CashWithdrawal}

                    />
                </div>
            </div>
        </>
    )
}

export default CashRegCut