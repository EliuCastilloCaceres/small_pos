import { useContext, useEffect, useState } from "react"
import Grid from "../../../Grid"
import GridCard from "../../../GridCard"
import CashRegStatusCard from "../../Pos/CashRegStatusCard"
import Modal from "../../../Modal"
import CashRegisterForm from "./cashRegisterFrom"
import usePetition from "../../../hooks/usePetition"
import BackButton from "../../BackButton"
import axios from "axios"
import toast, { Toaster } from "react-hot-toast"
import UserContext from "../../../Context/UserContext"
import { Navigate } from "react-router-dom"

function CashRegisterList() {
    const {user} = useContext(UserContext)
    if(user.permissions.settings !==1){
        return <Navigate to={'/dashboard'} />
    }
    const [showModal, setShowModal] = useState(false)
    const [modatTitle, setmodatTitle] = useState('')
    const [cashRegData, setCashRegData] = useState()
    const [data, isLoading, error, setData] = usePetition('cash-registers')
    const URL_BASE = import.meta.env.VITE_URL_BASE
    const token = localStorage.getItem("token")
    const toggleModal = () => {
        setShowModal(!showModal);
    }
    const handleGridCardClick = (name, id) => {
        setCashRegData({
            name,
            id
        })
        toggleModal()
    }
    const addData = (newData) => {
        setData([...data, newData])
    }
    const updateData = (dataUpdated) => {
        console.log(dataUpdated)
        const newData = data.map(cashReg => {
            if (cashReg.cash_register_id === dataUpdated.cashRegisterId) {
                // Actualiza el estado de la orden
                return { ...cashReg, name: dataUpdated.name };
            }
            return cashReg;
        })
        setData(newData)
    }
    const deleteCashReg = (id, name, isOpen) => {
        if(isOpen ===1){
            toast.error('No se puede borrar una caja Abierta')
            return
        }
        if (confirm(`Desea borrar caja: "${name}"`)) {
                axios.delete(`${URL_BASE}cash-registers/${id}/delete`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,

                    }
                }).then(response => {
                    toast.success('Caja borrada')
                    const result = data.filter(cr=>cr.cash_register_id != id)
                    setData(result)
                }).catch(error => {
                    toast.error(`Algo salió mal: ${error.message}`)
                })
        }
    }
    if (isLoading) {
        return <span>Cargando...</span>
    }
    if (error) {
        return <span>Error: {error}</span>
    }
    return (
        <>
            <BackButton saved={true} />
            <h2 className="tex-center">Cajas Registradoras</h2>
            <Grid>
                <GridCard
                    onClick={() => {
                        handleGridCardClick('', '')
                        setmodatTitle('Agregar Caja Registradora')
                    }}

                >
                    <i className="bi bi-plus-circle-fill fs-1"></i>
                    <span>Agregar</span>
                </GridCard>
                {
                    data && data.length > 0 && (
                        data.map(({ name, cash_register_id, is_open}) => (
                            <div key={cash_register_id} className="w-100 h-100 d-flex flex-column align-items-center border border-primary p-1 rounded">
                                <CashRegStatusCard
                                    title={name}
                                    iconClass={'bi bi-pc-horizontal'}
                                    isOpen={is_open}
                                    onClick={() => {
                                        handleGridCardClick(name, cash_register_id)
                                        setmodatTitle('Actualizar Caja Registradora')
                                    }}
                                />
                                <div className="mt-2 w-100 d-flex justify-content-center">
                                    <button onClick={() => { deleteCashReg(cash_register_id, name, is_open) }} className="btn btn-danger ">
                                        <i className="bi bi-trash-fill"></i>
                                    </button>
                                </div>
                            </div>
                        ))
                    )
                }
            </Grid>
            <Modal title={modatTitle} showModal={showModal} toggleModal={toggleModal} >
                <CashRegisterForm toggleModal={toggleModal} cashRegData={cashRegData} addData={addData} updateData={updateData} />
            </Modal>

            <Toaster
                position="bottom-right"
            />
        </>
    )
}
export default CashRegisterList