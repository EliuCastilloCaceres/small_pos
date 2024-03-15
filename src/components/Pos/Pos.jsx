import { useContext, useEffect, useState } from "react"
import UserContext from "../../Context/UserContext"
import { Link, Navigate, useLocation } from "react-router-dom"
import usePetition from "../../hooks/usePetition"
import './pos.css'
import PosLayout from "./PosLayout"

function Pos() {
    //const { cashRegSession } = useContext(CashRegContext)
    const {user} = useContext(UserContext)
    if(user.permissions.pos !==1){
        return <Navigate to={'/dashboard'} />
    }
    const { search } = useLocation()
    const params = new URLSearchParams(search)
    const cashRegId = params.get('crId')
    const [selectedCashReg, setSelectedCashReg] = useState()
    const [cashRegSelection, setCashRegSelection] = useState('')
    const [data, isLoading, error] = usePetition(`cash-registers/open`)
    useEffect(() => {
        //  console.log('selected cashReg:', selectedCashReg)
    }, [selectedCashReg])
    const filterCashRegs = (field, value) => {
        const result = data.filter(cashReg => cashReg[field] === value)
        return result
    }
    useEffect(() => {
        // console.log('cashRegsOpen: ', data)

        if (data && data.length > 0) { //there are open cashregs?
            if (data.length > 1) {//there are more than 1?
                if (cashRegId) {// there is a specific cashReg?
                    const id = parseInt(cashRegId)
                    const result = filterCashRegs('cash_register_id', id)//cashReg with specific id is open?
                    // console.log('resultFiltered',result)
                    if (result.length > 0) {//open cash that pass the filter
                        if (user.profile.toLowerCase() === 'administrador') { //is admin
                            setSelectedCashReg(result[0])
                        } else {
                            //console.log(user.user_id)
                            //console.log(result[0].user_id)
                            if (user.user_id === result[0].user_id) {//user logged is same of the cashReg open?
                                setSelectedCashReg(result[0])
                            }
                        }
                    }
                } else {

                    if (user.profile.toLowerCase() === 'administrador') { //is admin
                        setSelectedCashReg(data)
                    } else {
                        const result = filterCashRegs('user_id', user.user_id)//cashRegs with specific user_id open?
                        if (result.length > 0) {//open cash that pass the filter
                            if (result.length > 1) {
                                setSelectedCashReg(result)
                            } else {
                                setSelectedCashReg(result[0])
                            }

                        } 
                    }
                }
            } else {
                //console.log('no more than one')
                if (user.profile.toLowerCase() === 'administrador') { //is admin
                    setSelectedCashReg(data[0])
                } else {
                    if (data[0].user_id === user.user_id) {
                        setSelectedCashReg(data[0])
                    } else {
                        // navigate('/open-cash-register')
                    }
                }
            }
        }


    }, [data, cashRegId])
    const handleSubmit = (e) => {
        e.preventDefault()
        const result = selectedCashReg.filter(cr => cr.cash_register_id == cashRegSelection)
        //console.log('crSelection',result)
        setSelectedCashReg(result[0])
    }
    const renderPos = () => {
        if (!selectedCashReg || selectedCashReg.length === 0) return <div className="choose-cash-reg-btn-wrapper">
            <Link to={'/open-cash-register'} className="btn btn-dark  btn-lg">
                Escoger caja
            </Link>
        </div>



        if (selectedCashReg.length > 1) {

            return (
                <form onSubmit={handleSubmit} >
                    <div className="select-cash-reg-container">
                        <h2>Seleccionar caja</h2>
                        <select className="form-control" onChange={(e) => { setCashRegSelection(e.target.value) }} value={cashRegSelection} name="CashReg" >
                            <option value={''}>Seleccionar Caja</option>
                            {
                                selectedCashReg.map(cr => (
                                    <option key={cr.cash_register_id} value={cr.cash_register_id}>{cr.name}</option>
                                ))
                            }
                        </select>
                        <button className="btn btn-primary" type="submit">Aceptar</button>
                    </div>
                </form>
            )


        }
        return (
            <PosLayout cashRegister = {selectedCashReg}/>
        )
    }
    return (
        <>
            {renderPos()}
        </>
    )

}

export default Pos