import { useParams, Link, Navigate } from 'react-router-dom'
import './productSizes.css'
import usePetition from '../../hooks/usePetition';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import ProductBarCode from './productBarCode';
import UserContext from '../../Context/UserContext';
function ProductSizes({ totalSizesStock, setTotalSizesStock, sizes, setSizes, fetchSizes }) {
    const { user } = useContext(UserContext)
    if (user.permissions.products !== 1) {
        return <Navigate to={'/dashboard'} />
    }
    const token = localStorage.getItem("token")
    const { productId } = useParams();
    const [barCodeSku, setBarCodeSku] = useState('')
    const [stocks, setStocks] = useState(0)
    const sizeInput = document.getElementById('sizeInput')
    const URL_BASE = import.meta.env.VITE_URL_BASE
    const [size, setSize] = useState('')
    const [sku, setSku] = useState('')
    const [stock, setStock] = useState(0)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    useEffect(() => {
        console.log('theS: ', sizes)
        fetchSizes()
    }, [])
    useEffect(() => {
        if (sizes && sizes.length > 0) {
            let tss = 0
            sizes.map(s => {
                if (s.stock != '') {
                    tss = tss + parseFloat(s.stock)
                }
            })
            setTotalSizesStock(tss)
        }
    }, [sizes])

    const handleStockChange = (e) => {
        const value = e.target.value
        if (/^\d*\.?\d*$/.test(value)) {
            setStock(value); // Actualiza el estado con el nuevo array actualizado
        }
    }
    const preventSubmitForm = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Evita que se envíe el formulario
        }
    }
    const handleAddSize = () => {
        const sizeInfo = {
            size,
            sku,
            stock: parseFloat(stock)
        }
        console.log(sizeInfo)
        setSizes(prevSizes => [...prevSizes, sizeInfo])
        setSize('')
        setSku('')
        setStock(0)
        sizeInput.focus()
    }
    const handleDeleteSize = (idx, id) => {
        if (id) {
            deleteSizeFromDb(id)
        } else {
            deleteSize(idx)
        }
    }
    const deleteSizeFromDb = async (id) => {
        const deleteSize = confirm('Desea borrar esta talla?, los datos relacionados a esta talla se perderan')
        if (deleteSize) {
            try {
                const response = await axios.delete(`${URL_BASE}products/sizes/${id}/delete`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                })
                console.log(response)
                toast.success('Talla Borrada')

                fetchSizes()
                isSaved(false)
            } catch (e) {
                console.log(e)
                toast.error(`Algo salió mal: ${e.response.data.message}`)
            }



        }
    }
    const deleteSize = (idx) => {
        const result = sizes.filter((s, index) => index != idx)
        setSizes(result);
    }
    const handleSizeChange = (e, name, idx) => {
        const value = e.target.value

        const updatedSizes = sizes.map((item, index) => {
            if (index === idx) {
                if (name === 'stock') {
                    if (/^\d*\.?\d*$/.test(value)) {
                        return { ...item, [name]: value }; // Actualiza el valor 'stock' del elemento en el índice especificado
                    }
                } else {
                    return { ...item, [name]: value }; // Actualiza el valor 'name' del elemento en el índice especificado
                }

            }
            return item; // Mantiene los otros elementos sin cambios
        });

        setSizes(updatedSizes); // Actualiza el estado con el nuevo array actualizado

    }
    const renderSizes = () => {
        if (loading) {
            return <span>Cargando...</span>
        }
        if (error) {
            return <span>Error: {e}</span>
        }
        if (!sizes || sizes.length === 0) {
            return <div className='text-center'>
                No hay tallas para este producto
                <button onClick={() => {
                    sizeInput.focus();

                }} type="button" className="btn btn-link">Agregar Talla</button>
            </div>;
        }
        return (
            <div>

                <ul className="sizes-list">

                    {
                        sizes.map((s, index) => (
                            <li key={index} className="update-size-card">
                                <div>
                                    <span>Id</span>
                                    <input onKeyDown={preventSubmitForm} className="form-control text-center" type="text" value={s.size_id} name="id" readOnly disabled />
                                </div>
                                <div>
                                    <span>Talla</span>

                                    <input onKeyDown={preventSubmitForm} onChange={(e) => { handleSizeChange(e, 'size', index) }} className="form-control text-center" type="text" value={s.size} name="size" />
                                </div>
                                <div>
                                    <span>Sku</span>
                                    <input onKeyDown={preventSubmitForm} onChange={(e) => { handleSizeChange(e, 'sku', index) }} className="form-control  text-center" type="text" value={s.sku} name="sku" />

                                </div>
                                <div>
                                    <span>Stock</span>
                                    <input onKeyDown={preventSubmitForm} onChange={(e) => { handleSizeChange(e, 'stock', index) }} className="form-control  text-center" type="number" value={s.stock} name="stock" />

                                </div>
                                <div>
                                    <button onClick={() => { handleDeleteSize(index,s.size_id?s.size_id:null) }} type="button" className={`btn btn-danger`}>
                                        <i className="bi bi-trash"></i>
                                    </button>
                                </div>
                            </li>
                        ))
                    }
                </ul>
                <div className='text-center'>
                    <span>Total : {totalSizesStock}</span>
                </div>
            </div>
        )
    }
    return (
        <>
            <div className='row g-3 justify-content-center'>
                <div className="col-md-3">
                    <label className="form-label fw-bold">Talla</label>
                    <input onKeyDown={preventSubmitForm} onChange={(e) => { setSize(e.target.value) }} id='sizeInput' type="text" name="newSize" className="form-control" placeholder='Ej: 25' value={size} />
                </div>
                <div className="col-md-4">
                    <label className="form-label fw-bold">Sku</label>
                    <input onKeyDown={preventSubmitForm} onChange={(e) => { setSku(e.target.value) }} type="text" name="newSku" placeholder='Ej: P2547T25' className="form-control" value={sku} />
                </div>
                <div className="col-md-3">
                    <label className="form-label fw-bold">Stock</label>
                    <input onKeyDown={preventSubmitForm} onChange={handleStockChange} type="number" name="newStock" className="form-control" value={stock} />
                </div>
                <div className="col-md-2 d-flex align-self-end">
                    <button onKeyDown={preventSubmitForm} onClick={handleAddSize} type="button" className={`btn btn-success w-100`}> Agregar </button>
                </div>

                <div>
                    <h3 className="text-center">Tallas</h3>
                    {renderSizes()}

                </div>
            </div>
        </>
    )
}

export default ProductSizes