
import { useParams } from 'react-router-dom'
import './productSizes.css'
import usePetition from '../hooks/usePetition';
import { useEffect, useState } from 'react';
import axios from 'axios';
function ProductSizes({ generalStock, onSendSizesStock }) {
    const token = localStorage.getItem("token")
    const { productId } = useParams();
    const [data, isLoading, error, setReload] = usePetition(`products/${productId}/sizes`);
    const [size, setSize] = useState('')
    const [sku, setSku] = useState('')
    const [stock, setStock] = useState(0)
    const [stocks2, setStocks2] = useState(0)
    const sizeInput = document.getElementById('sizeInput')
    let stocks = 0
    const updateSizes = (e)=>{
        e.preventDefault()
        let qty = 0
        let sizesQty = e.target.sku.length
        for(let i = 0; i<sizesQty; i++){
            qty = qty+parseFloat(e.target.stock[i].value)
        }
        console.log(qty)
        if(qty!=generalStock){
            alert('la cantidad ingresada y el stock general no coinciden')
            e.target.stock[0].focus()
            
        }else{
            for(let i = 0; i<sizesQty; i++){
                let sizesData = {
                    size: e.target.size[i].value,
                    sku: e.target.sku[i].value,
                    stock: e.target.stock[i].value
                }
            }
        }
        
    }
    const handleAddSizeSubmit = (e) => {
        e.preventDefault();
        const URL_BASE = import.meta.env.VITE_URL_BASE
        const sizeData = {
            size,
            sku,
            stock,
            productId
        }
        let finalStock = stocks + parseFloat(stock)
        console.log(finalStock)
        if (finalStock != generalStock) {
            alert('El stock final no coincide con el stock General')
            e.target.stock.focus()
        } else {
            axios.post(`${URL_BASE}products/${productId}/sizes/create`, sizeData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            })
                .then(response => {
                    console.log(response)
                    alert('Talla creada exitosamente')
                    setReload(true)
                    setSize('')
                    setSku('')
                    setStock(0)
                })
                .catch(error => {

                    console.log(error)
                    alert('Algo salió mal: ' + error.response.data.message)
                })
            sizeInput.focus();
        }

    }
    useEffect(()=>{
        if(data){
            setStocks2(stocks)
        }
    },[])
    const renderSizes = () => {
        if (isLoading) {
            return <span>Cargando datos...</span>;
        }

        if (error) {
            return <span>Error: {error}</span>;

        }

        if (!data || data.length === 0) {
            onSendSizesStock(stocks)
            return <span>
                No hay tallas para este producto aun
                <button onClick={() => {
                    sizeInput.focus();

                }} type="button" className="btn btn-link">Agregar Talla</button>
            </span>;
        } else {
            data.map(({ stock }) => {
                stocks = stocks + stock
            })
            onSendSizesStock(stocks)
        }

        return (
            <>
            {
                data.map(({size_id, size, sku, stock}, index) => (
                    <div key={size_id} className='row g-2'>
                        <div className="col-md-3">
                            {index == 0 && (<label className="form-label fw-bold">Talla</label>)}
                            <input type="text" name="size" className="form-control" defaultValue={size} />
                        </div>
                        <div className="col-md-4">
                            {index == 0 && (<label className="form-label fw-bold">Sku</label>)}
                            <input type="text" name="sku" className="form-control" defaultValue={sku} />
                        </div>
                        <div className="col-md-3">
                            {index == 0 && (<label className="form-label fw-bold">Stock</label>)}
                            <input type="number" name="stock" className="form-control" defaultValue={stock} />
                        </div>
                        <div className="col-md-2 d-flex align-self-end">
                            <button type="button" className={`btn btn-danger`}>
                                <i className="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                    ))
            }
                <div className="col">
                <button type='submit' className='btn btn-dark'>Guardar</button>
                </div>
            </>
        )
    }

    return (
        <>
            <div className="product-sizes-container text-center">
                <h2 className='my-3'>Tallas</h2>
                <form onSubmit={handleAddSizeSubmit} className='row g-3'>
                    <div className="col-md-3">
                        <label className="form-label fw-bold">Talla</label>
                        <input onChange={(e) => {
                            setSize(e.target.value)
                            setSku('P' + productId + 'T' + e.target.value)
                        }} id='sizeInput' type="text" name="size" className="form-control" placeholder='Ej: 25' value={size} required />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label fw-bold">Sku</label>
                        <input onChange={(e) => { setSku(e.target.value) }} type="text" name="sku" placeholder='Ej: P2547T25' className="form-control" required value={sku} />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label fw-bold">Stock</label>
                        <input onChange={(e) => { setStock(e.target.value) }} type="number" name="stock" className="form-control" value={stock} />
                    </div>
                    <div className="col-md-2 d-flex align-self-end">
                        <button type="submit" className={`btn btn-success w-100`}> Agregar </button>
                    </div>
                </form>
                <form onSubmit={updateSizes} className='row g-3 my-5 border border-secondary pb-3'>
                    {renderSizes()}
                    <label className='fw-bold' >Cantidad: {stocks2}</label>
                </form>
            </div>
        </>
    )
}

export default ProductSizes