import axios from "axios"
import { format } from "date-fns"
import { useContext, useEffect, useState } from "react"
import UserContext from "../../../Context/UserContext"
import toast from "react-hot-toast"
import './cashMovements.css'
import { formatToMoney } from "../../../helpers/currencyFormatter"
function CashMovement({ cashRegister, toggleLocalModal, balance, movements, fetchMovements, deposits, withdrawals }) {
    const URL_BASE = import.meta.env.VITE_URL_BASE
    const token = localStorage.getItem("token")
    const { user } = useContext(UserContext)
    const [type, setType] = useState('deposito')
    const [amount, setAmount] = useState(0)
    const [description, setDescription] = useState('')
    const [updateType, setUpdateType] = useState('')
    const [updateAmount, setUpdateAmount] = useState(0)
    const [updateDescription, setUpdateDescription] = useState('')
    const [editingRow, setEditingRow] = useState(null)

    const updateMovement = async (movement_id) => {
        const movemetData = {
            movementType: updateType,
            amount:updateAmount,
            description:updateDescription,
            userId: user.user_id
        }
        try {
            await axios.put(`${URL_BASE}cash-registers/${cashRegister.cash_register_id}/movements/${movement_id}/update`, movemetData, {
                headers: {
                    'Authorization': `Bearer ${token}`,

                }
            })
            toast.success('Movimiento Actualizado')
            handleCancelEditingRow()
            fetchMovements()

        } catch (e) {
            console.log(e)
            // console.log('Ocurrio un error: ' + e)
            toast.error('Ocurrio un error: ' + e)
        }
    }

    const deleteMovement = async (movement_id) => {
        try {
            const result = await axios.delete(`${URL_BASE}cash-registers/${cashRegister.cash_register_id}/movements/${movement_id}/delete`, {
                headers: {
                    'Authorization': `Bearer ${token}`,

                }
            })
            toast.success('Movimiento Borrado')
            fetchMovements()

        } catch (e) {
            console.log(e)
            // console.log('Ocurrio un error: ' + e)
            toast.error('Ocurrio un error: ' + e)
        }
    }
    const cleanUpdateStates = ()=>{
        setUpdateType(null)
        setUpdateAmount(null)
        setUpdateDescription(null)
    }
    const handleEditingRow = (index,type,amount,description)=>{
        setUpdateType(type)
        setUpdateAmount(amount)
        setUpdateDescription(description)
        setEditingRow(index)
    }
    const handleCancelEditingRow = ()=>{
        cleanUpdateStates
        setEditingRow(null)
    }
    const cleanStates = () => {
        setType('deposito')
        setAmount(0)
        setDescription('')
    }
    const handleToggleLocalModal = () => {
        toggleLocalModal()
        cleanStates()
    }
    const handleAmountChange = (event) => {
        const value = event.target.value;
        if (/^\d*\.?\d*$/.test(value)) {
            setAmount(value)
        };
    }
    const handleUpdateAmountChange = (event) => {
        const value = event.target.value;
        if (/^\d*\.?\d*$/.test(value)) {
            setUpdateAmount(value)
        };
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        const movementData = {
            movementType: type,
            amount,
            description,
            userId: user.user_id,
        }
        // console.log('MovData: ', movementData)
        try {
            const result = await axios.post(`${URL_BASE}cash-registers/${cashRegister.cash_register_id}/movements/create`, movementData, {
                headers: {
                    'Authorization': `Bearer ${token}`,

                }
            })
            toast.success('Movimiento Guardado')
            cleanStates()
            fetchMovements()

        } catch (e) {
            console.log(e)
            toast.error('Ocurrio un error: ' + e)
        }
    }
    const renderMovememts = () => {
        if (!movements || movements.length === 0) {
            return <span>Sin movimientos</span>
        }
        if (movements && movements.length > 0) {
            return (
                <table id='movements-table' className="table table-hover table-striped text-center align-middle">
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
                                    {
                                        editingRow === index ?
                                            (<>
                                                <td className='sticky column-values'>
                                                    <select onChange={(e)=>{setUpdateType(e.target.value)}} className="text-center" type="text" value={updateType}>
                                                        <option value="deposito">deposito</option>
                                                        <option value="retiro">retiro</option>
                                                    </select>
                                                    </td>
                                                <td ><input onChange={handleUpdateAmountChange} className="text-center" type="text" value={updateAmount} /></td>
                                                <td className='column-values'><input onChange={(e)=>{setUpdateDescription(e.target.value)}} className="text-center" type="text" value={updateDescription} /></td>
                                            </>)
                                            : (
                                                <>
                                                    <td className='sticky column-values'>{movement.movement_type}</td>
                                                    <td className={movement.movement_type === 'deposito' ? 'text-success' : 'text-danger'}>{movement.amount}</td>
                                                    <td className='column-values'>{movement.description}</td>
                                                </>
                                            )
                                    }
                                    <td className='column-values'>{format(new Date(movement.movement_date),'dd-MM-yyyy HH:mm:ss')}</td>
                                    <td className='column-values'>{movement.name}</td>
                                    <td className='column-values'>{movement.first_name} {movement.last_name}</td>
                                    <td className='column-values'>
                                        <div className='d-flex justify-content-center gap-2'>
                                            {
                                                user.profile.toLowerCase() == 'administrador' && (
                                                    <>
                                                        {
                                                            editingRow === index ? (<>
                                                                <button type='button' onClick={() => {
                                                                    updateMovement(movement.cash_movement_id)
                                                                }} className='btn btn-primary'>Guardar</button>
                                                                <button type='button' onClick={handleCancelEditingRow} className='btn btn-secondary'>Cancelar</button>
                                                            </>) : (<>
                                                                <button type='button' onClick={() => {
                                                                    handleEditingRow(index,movement.movement_type,movement.amount,movement.description)
                                                                }} className='btn btn-warning'>Editar</button>
                                                                <button type='button' onClick={() => { deleteMovement(movement.cash_movement_id) }} className='btn btn-danger'>Eliminar</button></>)
                                                        }

                                                    </>
                                                )
                                            }

                                        </div>
                                    </td>
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
            <div className="movements-table-wrapper">
                {renderMovememts()}
            </div>
            <div className="totals-wrapper">
                <span>Depositos: {formatToMoney(deposits)}</span>
                <span>Retiros: {formatToMoney(withdrawals)}</span>
                <span >En Caja: <span className={balance >= 0 ? 'text-success' : 'text-danger'}>{formatToMoney(balance)}</span> </span>
            </div>
            <form onSubmit={handleSubmit} className="row g-3 align-items-center fw-bold" >
                <div className="col-md-2">
                    <label className="form-label" htmlFor="name">Tipo</label>
                    <select onChange={(e) => { setType(e.target.value) }} name="type" value={type}>
                        <option value="deposito">Deposito</option>
                        <option value="retiro">Retiro</option>
                    </select>
                </div>
                <div className="col-md-2">
                    <label className="form-label" htmlFor="rfc">Monto</label>
                    <input onChange={(e) => { handleAmountChange(e) }} value={amount} type="text" name="amount" className="form-control" />
                </div>
                <div className="col-md-8">
                    <label className="form-label" htmlFor="rfc">Descripción</label>
                    <input onChange={(e) => { setDescription(e.target.value) }} value={description} type="text" name="description" className="form-control" />
                </div>
                <div className="col-12 text-center my-5">
                    <button type="submit" className={`btn btn-primary`}>Guardar</button>
                </div>
            </form>
        </>
    )
}
export default CashMovement