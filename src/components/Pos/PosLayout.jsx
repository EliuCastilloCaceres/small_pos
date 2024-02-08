
import { Link } from 'react-router-dom'
import './posLayout.css'
import { useContext, useEffect, useState } from 'react'
import UserContext from '../../Context/UserContext'
import GridCard from '../../GridCard'
import usePetition from '../../hooks/usePetition'
import Grid from '../../Grid'
import ProductsSearcher from './ProductsSearcher'
import Cart from './Cart'

function PosLayout({cashRegister}) {
    const { user } = useContext(UserContext)
    const URL_BASE = import.meta.env.VITE_URL_BASE
    const [data, IsLoading, error, setData] = usePetition('products');
    const [dataCopy,setDataCopy] = useState()
    const [selectedProduct, setSelectedProduct] = useState()
    const [clickBand, setClickBand] = useState(false)
    const [cartProducts,setCartProducts] = useState()
    useEffect(()=>{
        if(data && data.length>0){
            setDataCopy(data)
        }
    },[data])
    const addToCart = (product)=>{

    }
    const handleProductSelection = (product)=>{
        setSelectedProduct(product)
        setClickBand(!clickBand)
        console.log('product selected:',product)
    }
    const renderProducts = ()=>{
        if(IsLoading)return <span>Cargando...</span>
        if(error) return<span>Error: {error}</span>
        if(!dataCopy || dataCopy.length === 0) return <span>No hay productos</span>

        return (
            <Grid>
                {
                    dataCopy.map(product=>(
                        <GridCard onClick={()=>{handleProductSelection(product)}} key={product.product_id}>
                            <div className='product-info-wrapper'>
                                <div className='image-container'>
                                        <img  src={`${URL_BASE}product/images/${product.image ? product.image : 'sin_imagen.jpg'}`} alt="product-image"/>
                                </div>
                                <div className='title-container'>
                                        <span className='badge bg-info fs-5'>{product.sku}</span>
                                        <span>{product.name}</span>
                                </div>
                                <span className='stock-badge badge rounded-pill text-bg-warning'>
                                    {product.general_stock}
                                </span>
                            </div>
                        </GridCard>
                    ))
                }
            </Grid>
        )
        
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
                            <li><Link className="dropdown-item" to={'cash-movements'}>Caja</Link></li>
                            <li><Link className="dropdown-item" to={'/dashboard'}>Ir al Dashboard</Link></li>
                            <li><hr className="dropdown-divider" /></li>
                            <li><Link className="dropdown-item" to={'/logout'}>Cerrar Sesión</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className='products-section'>
                <div className='products-searcher-wrapper'>
                    <ProductsSearcher data={data} dataCopy={dataCopy} setDataCopy={setDataCopy} addToCart={addToCart} selectedProduct={selectedProduct}/>
                </div>
                <div className='products-grid-wrapper'>
                        {renderProducts()}
                </div>
            </div>
            <div className='cart-section'>
                <div className='cart'>
                    <Cart products={cartProducts}/>
                </div>
                <div className='cart-actions'>
                    
                </div>
            </div>
        </div>
    )
}

export default PosLayout