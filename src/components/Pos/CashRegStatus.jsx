import { useContext, useEffect, useState } from "react"
import Grid from "../../Grid"
import usePetition from "../../hooks/usePetition"
import CashRegStatusCard from "./CashRegStatusCard"
import axios from "axios"
import { format, parseISO } from "date-fns"
import UserContext from "../../Context/UserContext"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import { formatInTimeZone, utcToZonedTime } from "date-fns-tz"

function CashRegStatus() {
    const [data, isLoading, error] = usePetition('cash-registers')
    const [cashRegisters, setCashRegisters] = useState()
    const [newData, setNewData] = useState()
    const [validate, setValidate] = useState(true)
    const URL_BASE = import.meta.env.VITE_URL_BASE
    const token = localStorage.getItem("token")
    const { user } = useContext(UserContext)
    // useEffect(()=>{
    //   if(newData && newData.length>0){
    //       //console.log('User in statusCashReg: ',user)
    //       console.log('the data: !' ,newData)
    //       const dateParsed = parseISO(newData[0].close_date)
    //       const zonedDate = utcToZonedTime(dateParsed, 'America/Cancun');
    //       console.log('the date: !' ,zonedDate)
    //   }
    // },[newData])
    const navigation = useNavigate()
    const fetchCashRegStatus = async () => {

        const cashRegs = await Promise.all(
            data.map(async cr => {
                try {
                    const response = await axios.get(`${URL_BASE}cash-registers/${cr.cash_register_id}/status`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,

                        }
                    })
                    // console.log(response.data.data)
                    if (response.data.data.length > 0) {
                        return response.data.data[0]
                    }
                } catch (e) {
                    console.log(e)
                }
            })
        )
        //console.log('status:',cashRegs.filter(Boolean))
        setCashRegisters(cashRegs.filter(Boolean))
    }
    useEffect(() => {
        if (data && data.length > 0) {
            setNewData(data)
            fetchCashRegStatus()
        }
    }, [data])
    useEffect(() => {
        if ((data && data.length > 0) && (cashRegisters && cashRegisters.length > 0)) {
            const result = data.filter(item =>
                !cashRegisters.some(item2 => item.cash_register_id === item2.cash_register_id)
            )
            //console.log('the result is: ', result)
            setNewData(cashRegisters.concat(result))
        }
    }, [data, cashRegisters])
    const OpenCashReg = async (crId,openAmount) => {
        const openDetails={
            openAmount,
            userId:user.user_id,
        }
        try {
            const response = await axios.post(`${URL_BASE}cash-registers/${crId}/open`,openDetails,{
                headers: {
                    'Authorization': `Bearer ${token}`,

                }
            })
            //console.log(response)
            return navigation(`/pos?crId=${crId}`)
        } catch (e) {
            console.log(e)
            
        }
    }
    const openAmountSet = async (crId,)=>{
        //console.log(crId)
        const { value: openAmount } = await Swal.fire({
            title: "Monto Inicial",
            input: "text",
            inputLabel: "$",
            inputPlaceholder: "Ej: 1000"
          });
          if (openAmount) {
            OpenCashReg(crId,openAmount)
          }
    }
    const ValidatePermissionsAndStatus =  (isOpen, crUser, crName,crId) => {
             //validamos si la caja está abierta
        //console.log('open?: ',isOpen)
        //console.log('is admin?: ',user.profile)
        //console.log('user logged: ',user.user_name)
       // console.log('user of the cash open: ',crUser)
        
        if (isOpen == 1) {
           
            if (user.profile.toLowerCase() == 'administrador') {
                return navigation(`/pos?crId=${crId}`)
            }else{
                if(user.user_name == crUser){
                    return navigation(`/pos?crId=${crId}`)
                }
            }
           
        }else{
            Swal.fire({
                icon: "question",
                title: 'Abrir Caja',
                text:`"${crName}"`,
                showCancelButton: true,
                confirmButtonText: "Abrir",
                cancelButtonText: `cancelar`
            }).then(result=>{
                
                if(result.isConfirmed){
                    openAmountSet(crId)
                }
            })
        }
      
        
    }
    const handleMouseOver = (isOpen)=>{
        if(isOpen===0){
            if(validate === true){
                //console.log('fetching...')
                fetchCashRegStatus()
            }
            
        }
         
        setValidate(false)
    }

    const renderCashRegisters = () => {
        if (error) {
            return <span>Error: {error}</span>
        }
        if (!newData || newData.length === 0) {
            return <span>Sin Cajas Disponibles</span>
        }
        return newData.map((cr) => {

            return <CashRegStatusCard
                key={cr.cash_register_id}
                title={cr.name}
                isDisabled = {(user.profile.toLowerCase()!='administrador')&&(cr.is_open==1 && cr.user_name != user.user_name )?'disabled':''}
                iconClass={'bi bi-pc-horizontal'}
                userActive={cr.user_name ? cr.user_name : ''}
                isOpen={cr.is_open}
                lastOpen={cr.close_date ? formatInTimeZone(new Date(cr.close_date),'America/Cancun', 'dd-MM-yyyy HH:mm:ss') : cr.open_date ? formatInTimeZone(new Date(cr.open_date), 'America/Cancun','dd-MM-yyyy HH:mm:ss') : ''}
                balance={cr.close_amount ? cr.close_amount : '0'}
                onClick={() => { 
                    ValidatePermissionsAndStatus(cr.is_open, cr.user_name ? cr.user_name : '',cr.name,cr.cash_register_id) 
                }}
                onMouseOver={()=>{handleMouseOver(cr.is_open)}}
                setValidate={setValidate}
            />
        })

    }
    return (
        <>
            <Grid>

                {renderCashRegisters()}
            </Grid>
        </>
    )
}

export default CashRegStatus