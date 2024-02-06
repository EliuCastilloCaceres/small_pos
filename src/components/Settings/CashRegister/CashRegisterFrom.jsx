import axios from "axios"
import { useEffect, useState } from "react"
import toast,{ Toaster } from "react-hot-toast"


function CashRegisterForm ({cashRegData, addData, updateData, toggleModal}){
    const URL_BASE = import.meta.env.VITE_URL_BASE
    const token = localStorage.getItem("token")
    const [fields, setFields] = useState({
        cashRegisterId:'',
        name:''
    })
    useEffect(()=>{
        if(cashRegData){
            setFields({
                cashRegisterId:cashRegData.id,
                name:cashRegData.name
            })
        }
    },[cashRegData])
    const handleChange = (e,fieldName)=>{
        setFields({
            ...fields,
            [fieldName]:e.target.value
        })
    }
    const updateCashReg =(e)=>{
        e.preventDefault()
        const toastId = toast.loading('Loading...');
        axios.put(`${URL_BASE}cash-registers/${fields.cashRegisterId}/update`, fields, {
            headers: {
                'Authorization': `Bearer ${token}`,
                
            }
        })
            .then(response => {
                console.log(response)
                toast.success('Caja Registradora Actualizada',{
                    id:toastId,
                })
                updateData(fields)
            })
            .catch(error => {
                console.log(error)
                toast.error(`Algo salió mal: ${error.message}`,{
                    id:toastId,
                })
            })

    }
    const createCashReg =(e)=>{
        e.preventDefault()
        const toastId = toast.loading('Loading...');
        axios.post(`${URL_BASE}cash-registers/create`, fields, {
            headers: {
                'Authorization': `Bearer ${token}`,
                
            }
        })
            .then(response => {
                console.log(response)
                toast.success('Caja Registradora Creada',{
                    id:toastId,
                })
                setFields({
                    name: '',
                });
               addData(response.data.data[0])
               toggleModal()
            })
            .catch(error => {
                console.log(error)
                toast.error(`Algo salió mal: ${error.message}`,{
                    id:toastId,
                })
            })

    }
    return(
        <>
            <form onSubmit={cashRegData && cashRegData.name!=''?updateCashReg:createCashReg} className="row g-3 align-items-center fw-bold justify-content-center" >
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="name">Nombre</label>
                        <input onChange={(e)=>{handleChange(e,'name')}} required value={fields.name} type="text" name="name" className="form-control" />
                    </div>
                    <div className="col-12 text-center my-5">
                        <button type="submit" className={`btn btn-primary`}>Guardar</button>
                    </div>
        </form>
            {/* <Toaster
                position="top-center"
            /> */}
        </>
    )
}

export default CashRegisterForm