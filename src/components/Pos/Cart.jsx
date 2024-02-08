import { json } from 'react-router-dom'
import CartCard from './CartCard'
import './cart.css'
function Cart ({products}){
    return(
        <>
            <div className="cart-products-wrapper">
                {
                    JSON.stringify(products)
                }
            </div>
        </>
    )
}

export default Cart