import { useEffect, useState } from 'react'
import CartCard from './CartCard'
import toast, { Toaster } from 'react-hot-toast'
import './cart.css'
function Cart ({cartProducts, setCartProducts, prod, setProd}){
    
    useEffect(()=>{
        const handleAddToCart = (product) => {
            const p = {...product}
                if (cartProducts.length > 0) {//there are products in the cart
                    updateCart(p)
                } else {//there aren't products in the cart
                    addToCart(p)
                }
        }
        if(prod){
            handleAddToCart(prod)
        }
    },[prod])
    const addToCart = (product) => {
        product.qty = 1
        product.subtotal = product.sale_price * product.qty
        setCartProducts(prevCart => [...prevCart, product])
        setProd(null)
    }
    const removeFromCart=(product)=>{
        if (product.size) { //is a product variable, has size?
            const updatedCart = cartProducts.map(cartP => {
                if (cartP.size) {
                    if (cartP.size.size_id !== product.size.size_id) {//product is diferent return product
                        return cartP 
                    }
                    return           
                }
                 return cartP
            })
            // console.log(updatedCart)
            setCartProducts(updatedCart.filter(Boolean))
        } else {//is a normal product
            const updatedCart = cartProducts.map(cartP => {
                if (cartP.product_id !== product.product_id) {//product is diferent return product
                        return cartP
                }
            })
            setCartProducts(updatedCart.filter(Boolean))
        }
    }
    const substractFromCart=(product)=>{
        if (product.size) { //is a product variable, has size?
            const updatedCart = cartProducts.map(cartP => {
                if (cartP.size) {
                    if (cartP.size.size_id === product.size.size_id) {//product match?
                            if (cartP.qty > 1) {//qty in cart is grater than 1?
                                const qtyUpdated = { ...cartP, qty: cartP.qty - 1 }
                                return { ...qtyUpdated, subtotal:qtyUpdated.sale_price*qtyUpdated.qty}
                                // return { ...cartP, qty: cartP.qty - 1 }
                            }
                            return cartP
                    }
                    return cartP

                }
                return cartP
            })
            setCartProducts(updatedCart)
        } else {//is a normal product
            const updatedCart = cartProducts.map(cartP => {
                if (cartP.product_id === product.product_id) {//product match?
              
                        if (cartP.qty > 1) {//qty in cart is grater than 1?
                            const qtyUpdated = { ...cartP, qty: cartP.qty - 1 }
                            return { ...qtyUpdated, subtotal:qtyUpdated.sale_price*qtyUpdated.qty}
                            // return { ...cartP, qty: cartP.qty - 1 }
                        }
                        return cartP
                }
                return cartP
            })
            setCartProducts(updatedCart)
        }
    }
    const updateCart = (product, specificQty = null) => {
        // console.log(product)
        let noMatch = true
        let qtyIsLess = true
        if (product.size) { //is a product variable, has size?
            const updatedCart = cartProducts.map(cartP => {
                if (cartP.size) {
                    if (cartP.size.size_id === product.size.size_id) {//product match?
                        noMatch = false
                        if (!specificQty) {// there is not a specific qty
                            if (cartP.qty < product.size.stock) {//qty in cart is less than stock?
                                const qtyUpdated = { ...cartP, qty: cartP.qty + 1}
                                return { ...qtyUpdated, subtotal:qtyUpdated.sale_price*qtyUpdated.qty}
                                // return { ...cartP, qty: cartP.qty + 1, subtotal:cartP.sale_price*cartP.qty}
                            }
                            qtyIsLess = false
                            return cartP

                        }

                        if (specificQty <= product.size.stock) {
                            const qtyUpdated = { ...cartP, qty: specificQty }
                            return { ...qtyUpdated, subtotal:qtyUpdated.sale_price*qtyUpdated.qty}
                            // return { ...cartP, qty: specificQty }
                        } else {
                            toast(`No se puede agregar más de ${product.size.stock} de este artículo`, {
                                duration: 2000,
                                icon: '🚫'
                            })
                            const qtyUpdated = { ...cartP, qty: product.size.stock }
                            return { ...qtyUpdated, subtotal:qtyUpdated.sale_price*qtyUpdated.qty}
                            // return { ...cartP, qty: product.size.stock }
                        }

                    }
                    return cartP

                }
                return cartP
            })
            setCartProducts(updatedCart)
            setProd(null)
        } else {//is a normal product
            const updatedCart = cartProducts.map(cartP => {
                if (cartP.product_id === product.product_id) {//product match?
                    noMatch = false
                    if (!specificQty) {
                        if (cartP.qty < product.general_stock) {//qty in cart is less than stock?
                            const qtyUpdated = { ...cartP, qty: cartP.qty + 1}
                            return { ...qtyUpdated, subtotal:qtyUpdated.sale_price*qtyUpdated.qty}
                            // return { ...cartP, qty: cartP.qty + 1 }
                        }
                        qtyIsLess = false
                        return cartP
                    }
                    if (specificQty <= product.general_stock) {
                        const qtyUpdated = { ...cartP, qty: specificQty }
                        return { ...qtyUpdated, subtotal:qtyUpdated.sale_price*qtyUpdated.qty}
                        // return { ...cartP, qty: specificQty }
                    } else {
                        toast(`No se puede agregar más de ${product.general_stock} de este artículo`, {
                            duration: 2000,
                            icon: '🚫'
                        })
                        const qtyUpdated = { ...cartP, qty: product.general_stock }
                        return { ...qtyUpdated, subtotal:qtyUpdated.sale_price*qtyUpdated.qty}
                        // return { ...cartP, qty: product.general_stock }
                    }

                }
                return cartP
            })
            setCartProducts(updatedCart)
            setProd(null)
        }
        //console.log(noMatch)
        if (noMatch) {
            addToCart(product)
        }
        if (!qtyIsLess) {
            toast('No se puede agregar más de este artículo', {
                duration: 2000,
                icon: '🚫'
            })
        }
      
        
    }
    const updateProductPrice = (product, newPrice) => {
        if (product.size) { //is a product variable, has size?
            const updatedCart = cartProducts.map(cartP => {
                if (cartP.size) {
                    if (cartP.size.size_id === product.size.size_id) {//product match?
                        const priceUpdated = { ...cartP, sale_price: newPrice} 
                        return { ...priceUpdated, subtotal:priceUpdated.sale_price*priceUpdated.qty}
                        // return { ...cartP, sale_price: newPrice}      
                    }
                    return cartP
                }
                return cartP
            })
            setCartProducts(updatedCart)
        } else {//is a normal product
            const updatedCart = cartProducts.map(cartP => {
                if (cartP.product_id === product.product_id) {//product match?
                    const priceUpdated = { ...cartP, sale_price: newPrice} 
                    return { ...priceUpdated, subtotal:priceUpdated.sale_price*priceUpdated.qty}
                    // return { ...cartP, sale_price: newPrice}
                }
                return cartP
            })
            setCartProducts(updatedCart)

        }  
    }
    
    return(
        <>
        {
            cartProducts.length > 0 ? (
                <div className="cart-products-wrapper">
                {
                    cartProducts.map((p,index)=>(
                        <CartCard key={p.size?p.size.size_id:p.product_id}
                        product={p}
                        updateCart={updateCart}
                        substractFromCart={substractFromCart}
                        removeFromCart={removeFromCart}
                        updateProductPrice={updateProductPrice}
                        />
                    ))
                }
            </div>

            ) : (
                <div className='empty-cart-wrapper'>
                    <i className="bi bi-cart-plus-fill"></i>
                </div>
            )
        }
             <Toaster
                position='top-center'
            />
        </>
    )
}

export default Cart