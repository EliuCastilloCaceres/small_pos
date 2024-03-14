import { useState } from 'react'
import './cashRegstatusCard.css'

function CashRegStatusCard({ title, iconClass, onClick, isOpen, lastOpen, userActive,isDisabled,onMouseOver, setValidate }) {
    return (
        <>
            <div onMouseOver={()=>{
                onMouseOver()
            }} 
            onMouseLeave={()=>{setValidate(true)}}
            onClick={onClick}

            className={`cash-reg-card ${isDisabled} `}>
                <i className={iconClass}></i>
                <span>{title}</span>
                {
                    userActive && (
                        
                        <div>
                            <span className='badge-title'>Usuario: </span>
                            <div className={`user-badge ${isOpen!==1?'bg-secondary':''} badge rounded-pill`}>
                            <span>{userActive}</span>
                        </div>
                        </div>
                    )
                }
                <span className={`status-badge badge rounded-pill bg-${isOpen == 1 ? 'success' : 'danger'}`}>{isOpen == 1 ? 'Abierta' : 'Cerrada'}</span>
                {
                    lastOpen && (
                        <div className='d-flex'>
                        <span className='badge-title'>Ultima: </span>
                        <div className='last-open-badge badge rounded-pill bg-info'>
                            <span>{lastOpen}</span>
                        </div>
                        </div>
                       
                    )
                }

            </div>
        </>
    )
}

export default CashRegStatusCard