
import { Link } from 'react-router-dom'
import './posLayout.css'
import { useContext, useEffect, useState } from 'react'
import UserContext from '../../Context/UserContext'
import ProductsSearcher from './ProductsSearcher'
import Cart from './Cart'

import ProductsGrid from './ProductsGrid'
import Swal from 'sweetalert2'
import CartActions from './CartActions'
import Modal from '../../Modal'
import CashMovement from './CashRegMov/CashMovement'
import CashRegCut from './CashRegMov/CashRegCut'
import { format } from 'date-fns'
import axios from 'axios'


function PosLayout({ cashRegister }) {
    const URL_BASE = import.meta.env.VITE_URL_BASE
    const token = localStorage.getItem("token")
    const { user } = useContext(UserContext)
    const [dt, setDt] = useState()
    const [dtCopy, setDtCopy] = useState()
    const [search, setSearch] = useState('')
    const [prod, setProd] = useState('')
    const [effectBand, setEffectBand] = useState(false)
    const [variableProductSelected, setVariableProductSelected] = useState()
    const [variableProduct, setVariableProduct] = useState()
    const [sizes, setSizes] = useState()
    const [showModal, setShowModal] =useState(false)
    const [showLocalModal, setShowLocalModal] =useState(false)
    const[modalTitle, setModalTitle] = useState('')
    const[modalOption, setModalOption] = useState(0)
    const[cashCutBand, setCashCutBand] = useState(true)
    const [balance, setBalance] = useState(0)
    const [movements, setMovements] = useState()
    const [cartProducts, setCartProducts] = useState([])
    const [deposits, setDeposits] = useState()
    const [withdrawals, setWithdrawals] = useState()
    const searchInput = document.getElementById('search-input')
    const fetchMovements = async () => {
        //console.log('fetching the data...',format(new Date(cashRegister.open_date), 'yyyy-MM-dd HH:mm:ss'))
        const queryDate = format(new Date(cashRegister.open_date), 'yyyy-MM-dd HH:mm:ss')
        try {
            const result = await axios.get(`${URL_BASE}cash-registers/${cashRegister.cash_register_id}/${queryDate}/movements`, {
                headers: {
                    'Authorization': `Bearer ${token}`,

                }
            })
            //console.log('movements: ', result.data.movements)
            //console.log('totals: ', result.data.totals)
            setMovements(result.data.movements)
            setDeposits(result.data.totals[0].deposits_total)
            setWithdrawals(result.data.totals[0].withdrawals_total)
            setBalance(result.data.totals[0].balance)

        } catch (e) {
            console.log('Ocurrio un error: ' + e)
        }
    }
    // useEffect(()=>{
    //     //console.log('CashR: ',cashRegister)
    // },[cashRegister])
    useEffect(() => {
        if (variableProductSelected) {

            if (variableProductSelected.size.stock > 0) {
                setProd(variableProductSelected)
            } else {
                productOutOfStock(variableProductSelected)
            }

            setSearch('')
        }
    }, [variableProductSelected])
   const focusInput = ()=>{
        searchInput.focus()
   }
    const toggleModal = () => {
        setShowModal(!showModal)
    }
    const toggleLocalModal = () => {
        setShowLocalModal(!showLocalModal)
    }
    const productOutOfStock = (product) => {
        if (product.size) {
            Swal.fire({
                title: "Sin Stock",
                text: `la variante ${product.size.size}, del producto ${product.name} se ha agotado`,
                icon: "error"
            });
        } else {
            Swal.fire({
                title: "Sin Stock",
                text: `el producto ${product.name} se ha agotado`,
                icon: "error"
            });
        }

    }
    const handleSizeSelection = async (size) => {
        const s = {...size}
            const result = await dt.filter(product => product.product_id === s.product_id)
            result[0].size = s
            const varPord ={...result[0]} 
            setVariableProductSelected(varPord)
    }
    const handleProductSelection = (product) => {
        const p = { ...product }
        if (p.general_stock === 0) {
            productOutOfStock(product)
            setSearch('')
            return
        }
        if (p.is_variable === 1) {
            setVariableProduct(p)
            setEffectBand(!effectBand)
            setSearch('')
        } else {
            setProd(p)
            setSearch('')
        }

    }
    const handleCashMovement= async () =>{
        await fetchMovements()
        setModalOption(1)
        setModalTitle('Movimiento de Efectivo')
        toggleLocalModal()
    }
    const handleCashRegCut= async () =>{
        await fetchMovements()
        setCashCutBand(!cashCutBand)
        setModalOption(2)
        setModalTitle('Corte de Caja')
        toggleLocalModal()
    }
    const renderModalContent =()=>{
        if(modalOption===1){
            return(
                <CashMovement 
                cashRegister={cashRegister} 
                toggleLocalModal={toggleLocalModal}
                balance={balance}
                movements={movements}
                deposits={deposits}
                withdrawals={withdrawals}
                fetchMovements={fetchMovements}
                />
            )
        }
        else if(modalOption===2){
            return(
                <CashRegCut 
                cashRegister={cashRegister} 
                cashCutBand={cashCutBand} 
                balance={balance}
                deposits={deposits}
                withdrawals={withdrawals} 
                movements={movements}/>
            )
        }
    }
    return (
        <div className="pos-layout">
            <div className='pos-header'>
                <div className='cash-info-wrapper'>
                    <div className='cash-reg-name'>
                        {cashRegister.name}
                    </div>
                </div>
                <div className='profile-btn-wrapper'>
                    <div className="btn-group">
                        <button type="button" className="btn btn-info dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                            {user.user_name}
                        </button>
                        <ul className="dropdown-menu">
                        {/* <li><Link className="dropdown-item" to={'sales-resum'}>Resumen Ventas</Link></li> */}
                            <li><button onClick={()=>{handleCashMovement()}} className="dropdown-item" >Movimiento de Efectivo</button></li>
                            <li><button onClick={()=>{handleCashRegCut()}} className="dropdown-item" >Corte de caja</button></li>
                            <li><Link className="dropdown-item" to={user.profile.toLowerCase()==='administrador'?'/dashboard':'/'}>Ir al Dashboard</Link></li>
                            <li><hr className="dropdown-divider" /></li>
                            <li><Link className="dropdown-item" to={'/logout'}>Cerrar Sesión</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className='products-section'>
                <div className='products-searcher-wrapper'>
                    <ProductsSearcher
                        dt={dt}
                        dtCopy={dtCopy}
                        setDtCopy={setDtCopy}
                        search={search}
                        setSearch={setSearch}
                        handleProductSelection={handleProductSelection}
                        sizes={sizes}
                        handleSizeSelection={handleSizeSelection}
                    />
                </div>
                <div className='products-grid-wrapper'>
                    <ProductsGrid 
                    setDt={setDt} 
                    setDtCopy={setDtCopy}  
                    dtCopy={dtCopy}
                    effectBand={effectBand}
                    showModal={showModal}
                    toggleModal={toggleModal}
                    variableProduct={variableProduct}
                    setVariableProductSelected={setVariableProductSelected}
                    handleProductSelection={handleProductSelection}
                    handleSizeSelection={handleSizeSelection}
                    setSizes={setSizes}
                    sizes={sizes}
                    />
                </div>
            </div>
            <div className='cart-section'>
                <div className='cart-section-wrapper'>
                <div className='cart'>
                     <Cart cartProducts={cartProducts} setCartProducts={setCartProducts} prod={prod} setProd={setProd}/>
                </div>
                <div className='cart-actions'>
                    <CartActions focusInput={focusInput} cartProducts={cartProducts} setCartProducts={setCartProducts} cashRegister={cashRegister} setDt={setDt} setDtCopy={setDtCopy} setSizes={setSizes} />
                </div>
                </div>
                
            </div>
           <Modal title={modalTitle} showModal={showLocalModal} toggleModal={toggleLocalModal}>
            {
                renderModalContent()
            }
           </Modal>
        </div>
    )
}

export default PosLayout