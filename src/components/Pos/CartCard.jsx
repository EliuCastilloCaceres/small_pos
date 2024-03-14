import './cartCard.css'
import { formatToMoney } from '../../helpers/currencyFormatter'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'


function CartCard({ product, updateCart, substractFromCart, removeFromCart, updateProductPrice}) {
    const token = localStorage.getItem("token")
    const URL_BASE = import.meta.env.VITE_URL_BASE
    const [originalPrice, setOriginalPrice]=useState('')
    const [fields, setFields] = useState({
        price: '',
        qty: '',
    })
    useEffect(() => {
        if (product) {
            setOriginalPrice(parseFloat(product.sale_price))
        }
    }, [])
    useEffect(() => {
        if (product) {
            setFields({
                price: product.sale_price,
                qty: product.qty
            })
        }
    }, [product])
    const updateProductQty = () => {
        updateCart(product)
    }
    const handleSubstractFromCart = () => {
        const p = { ...product }
        substractFromCart(p)
    }
    const handleRemoveFromCart = () => {
        const prod = { ...product }
        Swal.fire({
            title: `Quitar ${prod.name}${prod.size ? `/${prod.size.size}` : ''} del carrito?`,
            showCancelButton: true,
            confirmButtonText: "Quitar",
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                removeFromCart(prod)
            }
        });
    }
  
    const handlePriceChange = (event) => {
        const value = event.target.value;
        if (/^\d*\.?\d*$/.test(value)) {
            setFields({ ...fields, price: value });
        };
    }
    const handleQtyChange = (event) => {
        const value = event.target.value;
        if (/^\d*\.?\d*$/.test(value)) {
            setFields({ ...fields, qty: value });
        };

    }
    const handlePriceKeyDown = (event) => {
        if (event.key === 'Enter') {
            // Captura la tecla Enter
            updateProductPrice(product, parseFloat(fields.price))
            // Aquí puedes realizar alguna acción, como enviar el formulario o realizar una búsqueda
        }
    };
    const handlePriceBlur = () => {
        // Cuando el foco deja el input
        if (!fields.price || parseFloat(fields.price) === 0) {
            setFields({ ...fields, price: product.sale_price });
            return
        }
        updateProductPrice(product, parseFloat(fields.price))
        // Aquí puedes realizar alguna acción, como validar el valor del input
    };
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            // Captura la tecla Enter
            updateCart(product, parseFloat(fields.qty))
            // Aquí puedes realizar alguna acción, como enviar el formulario o realizar una búsqueda
        }
    };
    const handleBlur = () => {
        // Cuando el foco deja el input
        if (!fields.qty || parseFloat(fields.qty) === 0) {
            updateCart(product, 1)
            return
        }
        updateCart(product, parseFloat(fields.qty))
        // Aquí puedes realizar alguna acción, como validar el valor del input
    };
    return (
        <div className="cart-product-card">
            <div className='img-wrapper card-item'>
                <span className='header'><strong>Imagen</strong></span>
                <img src={`${URL_BASE}product/images/${product.image ? product.image : 'sin_imagen.jpg'}`} alt="product-image" />
            </div>
            <div className='name-wrapper card-item'>
                <span className='header'><strong>Art.</strong></span>
                <span className='value product-name'>{product.name}{product.size ? `/${product.size.size}` : ''}</span>
            </div>
            <div className='product-price-wrapper card-item'>
                <span className='header'><strong>Precio</strong></span>
                <div className='value'>
                        <input
                        tabIndex={-1}
                        className='' 
                        onKeyDown={handlePriceKeyDown}
                        onBlur={handlePriceBlur}
                        type="text" 
                        value={fields.price} 
                        onChange={(e) => { handlePriceChange(e) }} 
                        />
                </div>
                {/* <span className='value'>{formatToMoney(product.sale_price)}</span> */}
            </div>
            <div className='product-qty-wrapper card-item'>
                <span className='header'><strong>Cant.</strong></span>
                <div className='value'>
                    <div >
                        <div className='qty-actions-wrapper' >
                        <button tabIndex={-1} onClick={() => { handleSubstractFromCart() }} className=' update-qty-btn'>
                            <i className="bi bi-dash-lg"></i>
                        </button>
                        <input
                            tabIndex={-1}
                            onChange={(e) => { handleQtyChange(e) }}
                            onKeyDown={handleKeyDown}
                            onBlur={handleBlur}
                            type="text"
                            value={fields.qty} />
                        <button tabIndex={-1} onClick={() => { updateProductQty() }} className=' update-qty-btn'>
                        <i className="bi bi-plus-lg"></i>
                        </button>
                        </div>
                    </div>

                </div>
            </div>
            <div className='product-uom-wrapper card-item'>
                <span className='header'><strong>Um</strong></span>
                <span className="value">{product.uom}</span>
            </div>
            <div className='product-subtotal-wrapper card-item'>
                <span className='header'><strong>SubTotal</strong></span>
                <span className="value">{formatToMoney(product.subtotal)}</span>
            </div>
            <div className='product-del-wrapper card-item'>
                <div>
                    <button tabIndex={-1} onClick={() => { handleRemoveFromCart() }} className='btn btn-danger'><i className="bi bi-trash-fill"></i></button>
                </div>
            </div>
        </div>
    )
}

export default CartCard