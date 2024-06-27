import usePetition from "../hooks/usePetition"

function CashRegisterPicker ({cashRegister,setCashRegister}) {
    const [data] = usePetition('cash-registers')
    const renderCashRegPicker = ()=>{
        if(!data || data.length === 0)return <span>sin cajas registradoras</span>

        return (
            <>
                <select name="cashRegisterSelect" value={cashRegister} onChange={(e)=>{setCashRegister(e.target.value)}}>
                    <option value="">Todos</option>
                {data.map(cr =>(
                    <option value={cr.cash_register_id} key={cr.cash_register_id}>{cr.name}</option> 
                ))}
                </select>
            </>
        )
    }
    return(
       <>
            {renderCashRegPicker()}
       </>
    )
}

export default CashRegisterPicker