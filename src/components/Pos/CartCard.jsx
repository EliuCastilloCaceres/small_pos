import './cartCard.css'

function CartCard ({product}){
    return(
        <div className="cart-product-card">
            <div className='img-wrapper card-item'>
                1
            </div>
            <div className='name-wrapper card-item'>
                2
            </div>
            <div className='product price-wrapper card-item'>
                3
            </div>
            <div className='product-qty-wrapper card-item'>
                4
            </div>
            <div className='product-subtotal-wrapper card-item'>
                5
            </div>
        </div>
    )
}

export default CartCard