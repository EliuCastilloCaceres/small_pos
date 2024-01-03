
import { useParams } from 'react-router-dom'
import './productSizes.css'
import usePetition from '../hooks/usePetition';
import { useEffect, useState } from 'react';
import axios from 'axios';
function ProductSizes({ generalStock, onSendSizesStock }) {
    const token = localStorage.getItem("token")
    const { productId } = useParams();
    const [data, isLoading, error, setData] = usePetition(`products/${productId}/sizes`);
    const [size, setSize] = useState('')
    const [sku, setSku] = useState('')
    const [stock, setStock] = useState(0)
    const [stocks, setStocks] = useState(0)
    const sizeInput = document.getElementById('sizeInput')
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
    const handleAddSizeSubmit = () => {
        const URL_BASE = import.meta.env.VITE_URL_BASE
        const sizeData = {
            size,
            sku,
            stock,
            productId
        }
            axios.post(`${URL_BASE}products/${productId}/sizes/create`, sizeData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            })
                .then(response => {
                    console.log(response)
                    alert('Talla creada exitosamente')
                    setData([...data, sizeData]);
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
    useEffect(()=>{
        if(data){
            let allSizesStock = 0
            data.map(({ stock }) => {
                allSizesStock = allSizesStock + parseFloat(stock)
            })
            setStocks(allSizesStock)
            onSendSizesStock(allSizesStock)
        }
    },[data])
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
        }

        return (
            <>
            {
                data.map(({size_id, size, sku, stock}, index) => (
                    <div key={size_id} className='row g-2'>
                        <div className="col-md-3">
                            {index == 0 && (<label className="form-label fw-bold">Talla</label>)}
                            <input type="text" name="updateSize" className="form-control" defaultValue={size} />
                        </div>
                        <div className="col-md-4">
                            {index == 0 && (<label className="form-label fw-bold">Sku</label>)}
                            <input type="text" name="updateSku" className="form-control" defaultValue={sku} />
                        </div>
                        <div className="col-md-3">
                            {index == 0 && (<label className="form-label fw-bold">Stock</label>)}
                            <input type="number" name="updateStock" className="form-control" defaultValue={stock} />
                        </div>
                        <div className="col-md-2 d-flex align-self-end">
                            <button type="button" className={`btn btn-danger`}>
                                <i className="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                    ))
            }
            </>
        )
    }

    return (
        <>
            <div className=" col-12 product-sizes-container text-center">
                <h2 className='my-3'>Tallas</h2>
                <div  className='row g-3'>
                    <div className="col-md-3">
                        <label className="form-label fw-bold">Talla</label>
                        <input onChange={(e) => {
                            setSize(e.target.value)
                            setSku('P' + productId + 'T' + e.target.value)
                        }} id='sizeInput' type="text" name="newSize" className="form-control" placeholder='Ej: 25' value={size}  />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label fw-bold">Sku</label>
                        <input onChange={(e) => { setSku(e.target.value) }} type="text" name="newSku" placeholder='Ej: P2547T25' className="form-control"  value={sku} />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label fw-bold">Stock</label>
                        <input onChange={(e) => { setStock(e.target.value) }} type="number" name="newStock" className="form-control" value={stock} />
                    </div>
                    <div className="col-md-2 d-flex align-self-end">
                        <button onClick={handleAddSizeSubmit} type="button" className={`btn btn-success w-100`}> Agregar </button>
                    </div>
                </div>
                <div onSubmit={updateSizes} className='row g-3 my-5 border border-secondary pb-3'>
                    {renderSizes()}
                    <label className='fw-bold' >Cantidad: {stocks}</label>
                </div>
            </div>
        </>
    )
}

export default ProductSizes