import { useContext, useState } from "react"
import BackButton from "../BackButton"
import UserContext from "../../Context/UserContext"
import { Navigate } from "react-router-dom"
import CashRegisterPicker from "../CashRegisterPicker"
import { format } from "date-fns"
import toast, { Toaster } from "react-hot-toast"
import axios from "axios"
import { formatToMoney } from "../../helpers/currencyFormatter"

function CashRegTransactions () {
    const { user } = useContext(UserContext)
    if (user.permissions.orders !== 1) {
        return <Navigate to={'/dashboard'} />
    }
    const URL_BASE = import.meta.env.VITE_URL_BASE
    const token = localStorage.getItem("token")
    const today = format(new Date(), 'yyyy-MM-dd')
    const [startDate, setStartDate] = useState(today)
    const [endDate, setEndDate] = useState(today)
    const [cashRegSelected, setCashRegSelected] = useState('')
    const [type, setType] = useState('')
    const [data, setData] = useState([])
    const [amount, setAmount] = useState(0)
    const [description, setDescription] = useState('')
    const [updateType, setUpdateType] = useState('')
    const [updateAmount, setUpdateAmount] = useState(0)
    const [updateDescription, setUpdateDescription] = useState('')
    const [editingRow, setEditingRow] = useState(null)
    const [currentCr, setCurrentCr] = useState()
    
    const fetchMovements = async ()=>{
        const toastId = toast.loading('Fetching data')
        if(!startDate || !endDate){
            toast.error('Rango de fechas incorrectas',{
                id:toastId
            })
            return
        }
        
        const data = {
            startDate,
            endDate,
            crId:cashRegSelected,
            type
        }
        console.log(data)
        try{
            const response = await axios.post(`${URL_BASE}cash-registers/transactions`,data,{
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            })
            setData(response.data.data)
            console.log(response.data.data)
            console.log(response.data.totals)
            toast.dismiss(toastId)

        }catch(e){
            toast.error('Algo salió mal',{
                id:toastId
            })
            console.log(e)
        }
    }

    const updateMovement = async (movement_id) => {
        const movemetData = {
            movementType: updateType,
            amount:updateAmount,
            description:updateDescription,
            userId: user.user_id
        }
        try {
            await axios.put(`${URL_BASE}cash-registers/${currentCr}/movements/${movement_id}/update`, movemetData, {
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
            const result = await axios.delete(`${URL_BASE}cash-registers/${currentCr}/movements/${movement_id}/delete`, {
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
    const handleEditingRow = (index,type,amount,description,crId)=>{
        setCurrentCr(crId)
        setUpdateType(type)
        setUpdateAmount(amount)
        setUpdateDescription(description)
        setEditingRow(index)
    }
    const handleCancelEditingRow = ()=>{
        cleanUpdateStates()
        setEditingRow(null)
    }
   
    const handleUpdateAmountChange = (event) => {
        const value = event.target.value;
        if (/^\d*\.?\d*$/.test(value)) {
            setUpdateAmount(value)
        }
    }
   const handleSubmit = (e)=>{
        e.preventDefault()
        fetchMovements()
       
   }
   const renderData = ()=>{
        if(!data || data.length===0){
            return <span>No hay datos para mostrar</span>
        }
        return(
            data.map((movement, index) => (
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
                                    <td className={movement.movement_type === 'deposito' ? 'text-success' : 'text-danger'}>{formatToMoney(movement.amount)}</td>
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
                                                    handleEditingRow(index,movement.movement_type,movement.amount,movement.description, movement.cash_register_id)
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
        )
   }
    return(
        <>
        <BackButton saved={true}/>
        <h1 className="text-center fw-bold">Transaccionde de Caja</h1>
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
                        <label htmlFor="to">Caja:</label>
                        <CashRegisterPicker
                            cashRegister = {cashRegSelected}
                            setCashRegister = {setCashRegSelected}
                        />
                    </div>
                    <div className='select-order-container'>
                        <label htmlFor="to">Tipo:</label>
                        <select name="type" value={type} onChange={(e)=>{setType(e.target.value)}}>
                            <option value="">Todos</option>
                            <option value="deposito">Deposito</option>
                            <option value="retiro">Retiro</option>
                        </select>
                    </div>

                    <div className='submit-btn-container'>
                        <input type="submit" className='btn btn-primary' value={'Buscar'} />
                    </div>
                </form>
            </div>
            <div>
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
                           renderData()
                        }
                    </tbody>
                </table>
            </div>
            <Toaster
                position="center-top"
            />
        </>
       
    )
}

export default CashRegTransactions