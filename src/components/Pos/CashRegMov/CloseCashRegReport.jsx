import { format } from "date-fns"
import React, { useContext, useEffect } from "react"
import UserContext from "../../../Context/UserContext"
import './closeCashRegReport.css'
import { formatToMoney } from "../../../helpers/currencyFormatter"

const CloseCarshRegReport = React.forwardRef(({ movements, cashSales, cardSales, cashRegister, withdrawals, deposits, balance, CashWithdrawal }, ref) => {
    const { user } = useContext(UserContext)
    const renderMovements = () => {
        if (movements && movements.length > 0) {
            return (
                <table id='movements-table' className="table table-striped text-center align-middle">
                    <thead>
                        <tr>
                            <th className='column-headers' scope="col">#</th>
                            <th className='sticky column-headers' scope="col">Tipo</th>
                            <th className='sticky-2 column-headers' scope="col">Monto</th>
                            <th className='sticky-2 column-headers' scope="col">Descripción</th>
                            <th className='column-headers' id='isVarCell' scope="col">Fecha</th>
                            <th className='column-headers' scope="col">Caja</th>
                            <th className='column-headers' scope="col">Usuario</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            movements.map((movement, index) => (
                                <tr key={movement.cash_movement_id}>
                                    <td className='column-values'>{index + 1}</td>
                                    <td className='sticky column-values'>{movement.movement_type}</td>
                                    <td className={movement.movement_type === 'deposito' ? 'text-success' : 'text-danger'}>{movement.amount}</td>
                                    <td className='column-values'>{movement.description}</td>
                                    <td className='column-values'>{format(new Date(movement.movement_date), 'dd-MM-yyyy HH:mm:ss')}</td>
                                    <td className='column-values'>{movement.name}</td>
                                    <td className='column-values'>{movement.first_name} {movement.last_name}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            )
        }

    }
    return (
        <>
            <div ref={ref} className="report-container m-3" >
                <h1 className="text-center">Reporte de Cierre de Caja</h1>
                <div className="report-header">
                    <span>Caja: {cashRegister.name}</span>
                    <span>Usuario: {user.first_name} {user.last_name}</span>
                    <span>Fecha: {format(new Date(), 'dd-MM-yyyy :HH:mm:ss')}</span>
                </div>
                <div className="report-body">
                    <div className="cash-movements">
                        <h3 className="text-center mt-3">Movimientos de Efectivo</h3>
                        {renderMovements()}
                        <div className="totals-wrapper">
                            
                            
                        </div>
                    </div>
                    <div className="cash-totals">
                        <div>
                            <span>Ventas En Efectivo: {formatToMoney(cashSales)}</span>
                            <span>Ventas En Tarjeta: {formatToMoney(cardSales)}</span>
                            <span>Total Ventas: {formatToMoney(cardSales + cashSales)}</span>
                        </div>
                        <div>
                            <span>Ingresos de Efectivo: <span className="text-success">{formatToMoney(deposits)}</span></span>
                            <span >Egresos de Efectivo: <span className="text-danger">{formatToMoney(withdrawals)}</span></span>
                            <span >Balance: <span className={balance >= 0 ? 'text-success' : 'text-danger'}>{formatToMoney(balance)}</span> </span>
                        </div>
                    </div>
                    <div className="cash-balance">
                        <span>Retiro por corte: <span className="fs-2">{formatToMoney(CashWithdrawal)}</span></span>
                        <span>Saldo en caja: <span className="fs-2">{formatToMoney(balance-CashWithdrawal)}</span></span>
                    </div>
                </div>
            </div>
        </>
    )
})

export default CloseCarshRegReport