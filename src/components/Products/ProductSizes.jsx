import { useParams, Link, Navigate } from 'react-router-dom'
import './productSizes.css'
import usePetition from '../../hooks/usePetition';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import ProductBarCode from './productBarCode';
import UserContext from '../../Context/UserContext';
function ProductSizes({ generalStock, onSendSizesStock, isSizesSaved, isSaved }) {
    const { user } = useContext(UserContext)
    if(user.permissions.products !==1){
        return <Navigate to={'/dashboard'} />
    }
    const token = localStorage.getItem("token")
    const { productId } = useParams();
    const [data, isLoading, error, setData] = usePetition(`products/${productId}/sizes`);
    const [size, setSize] = useState('')
    const [sku, setSku] = useState('')
    const [stock, setStock] = useState(0)
    const [barCodeSku, setBarCodeSku] = useState('')
    const [stocks, setStocks] = useState(0)
    const sizeInput = document.getElementById('sizeInput')
    const URL_BASE = import.meta.env.VITE_URL_BASE
    const deleteSize = (id) => {
        const deleteSize = confirm('Desea borrar esta talla?, los datos relacionados a esta talla se perderan')
        if (deleteSize) {
            axios.delete(`${URL_BASE}products/sizes/${id}/delete`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            })
                .then(response => {
                    console.log(response)
                    toast.success('Talla Borrada')
                    const result = data.filter(size => size.size_id != id)
                    setData(result);
                    isSaved(false)
                })
                .catch(error => {
                    console.log(error)
                    toast.error(`Algo salió mal: ${error.response.data.message}`)
                })
        }
    }
    // const printBarCode = (sku) => {
    //     setBarCodeSku(sku)

    // }
    const sumStocks = () => {

        const stocksInputs = document.getElementsByName('updateStock')
        //console.log(stocksInputs.length)
        let stocksQty = 0
        for (let i = 0; i < stocksInputs.length; i++) {
            if (stocksInputs[i].value)
                stocksQty = stocksQty + parseFloat(stocksInputs[i].value)
        }
        setStocks(stocksQty)
        onSendSizesStock(stocksQty)
    }
    const updateSizes = async () => {
        //console.log(data)
        if (data.length > 0) {
            if (generalStock != stocks) {
                alert('El Stock General y la suma del stock de las tallas no coinciden')
                return
            }
            let errorOcurred = false
            let i = 0
            do {
                if (errorOcurred) {
                    return
                }
                try {
                    const response = await axios.put(`${URL_BASE}products/sizes/${data[i].size_id}/update`, data[i], {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })
                    console.log(response)
                    toast.success(`Talla ${data[i].size} Actualizada`)
                } catch (error) {
                    console.log(error)
                    errorOcurred = true
                    toast.error(`la talla ${data[i].size} no se actualizó:${error.message}`)
                }
                i++
            } while (i < data.length)

            if (!errorOcurred) {
                isSizesSaved(true)
            } else {
                isSizesSaved(false)
            }
        }
    }
    const handleAddSizeSubmit = () => {
        let sizeData = {
            size,
            sku,
            stock,
            product_id: parseInt(productId),
        }
        if (!sizeData.size || sizeData.size == '') {
            alert('El campo talla no puede estar vacío')
            return
        }
        let sizeFound
        let i = 0
        if (data.length > 0) {
            do {
                //console.log(data[i].size)
                if (data[i].size == sizeData.size) {
                    sizeFound = true
                }
                i++
            } while (!sizeFound && i < data.length)
        }


        let nextSizeStock = stocks + parseFloat(stock)

        if (sizeFound) {
            alert('la talla ' + sizeData.size + ' Ya existe')
            sizeInput.focus()
            return
        }

        if (nextSizeStock > parseFloat(generalStock)) {
            sizeData.stock = 0
            alert('el stock de esta talla sera de 0, ya que excede al stock general')
        }
        axios.post(`${URL_BASE}products/${productId}/sizes/create`, sizeData, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        })
            .then(response => {
                console.log(response)
                //alert('Talla creada exitosamente')
                toast.success('Talla creada')
                let size_id = response.data.lastSizeIdCreated
                sizeData.size_id = size_id
                setData([...data, sizeData]);
                setSize('')
                setSku('')
                setStock(0)
            })
            .catch(error => {
                console.log(error)
                toast.error(`Algo salió mal: ${error.response.data.message}`)
            })
        sizeInput.focus();
    }
    useEffect(() => {
        if (data) {
            //console.log(data)
            let allSizesStock = 0
            let allSizes = []
            data.map(({ stock, size }) => {
                allSizesStock = allSizesStock + parseFloat(stock)
                allSizes.push(size)
            })
            setStocks(allSizesStock)
            onSendSizesStock(allSizesStock)
        }
    }, [data])
    const renderSizes = () => {
        if (isLoading) {
            return <span>Cargando datos...</span>;
        }

        if (error) {
            return <span>Error: {error}</span>;

        }

        if (!data || data.length === 0) {
            //onSendSizesStock(stocks)
            return <span>
                No hay tallas para este producto
                <button onClick={() => {
                    sizeInput.focus();

                }} type="button" className="btn btn-link">Agregar Talla</button>
            </span>;
        }

        return (
            <>
                {
                    data.map(({ size_id, size, sku, stock }, index) => (
                        <div key={size_id} className='row g-2'>
                            <div className="col-md-3">
                                {index == 0 && (<label className="form-label fw-bold">Talla</label>)}
                                <input onChange={(e) => {
                                    data[index].size = e.target.value
                                    isSizesSaved(false)
                                }} type="text" name="updateSize" className="form-control" defaultValue={size} />
                            </div>
                            <div className="col-md-3">
                                {index == 0 && (<label className="form-label fw-bold">Sku</label>)}
                                <input onChange={(e) => {
                                    data[index].sku = e.target.value
                                    isSizesSaved(false)
                                }} type="text" name="updateSku" className="form-control" defaultValue={sku} />
                            </div>
                            <div className="col-md-3">
                                {index == 0 && (<label className="form-label fw-bold">Stock</label>)}
                                <input onChange={
                                    (e) => {
                                        sumStocks()
                                        data[index].stock = e.target.value
                                        isSizesSaved(false)
                                    }
                                } type="number" name="updateStock" className="form-control" defaultValue={stock} />
                            </div>
                            <div className="col-md-2 d-flex align-self-end gap-1">
                                <Link to={`../products/barcode/${sku}/${stock}`} type="button" className={`btn btn-info`} >
                                    <i className="bi bi-upc"></i>
                                </Link>

                                <button onClick={() => { deleteSize(size_id) }} type="button" className={`btn btn-danger`}>
                                    <i className="bi bi-trash"></i>
                                </button>

                            </div>


                        </div>
                    ))
                }
                {/* <ProductBarCode sku={barCodeSku} /> */}
            </>
        )
    }

    return (
        <>
            <div className=" col-12 product-sizes-container text-center">
                <h2 className='my-3'>Tallas</h2>
                <div className='row g-3'>
                    <div className="col-md-3">
                        <label className="form-label fw-bold">Talla</label>
                        <input onChange={(e) => {
                            setSize(e.target.value)
                            setSku('P' + productId + 'T' + e.target.value)
                        }} id='sizeInput' type="text" name="newSize" className="form-control" placeholder='Ej: 25' value={size} />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label fw-bold">Sku</label>
                        <input onChange={(e) => { setSku(e.target.value) }} type="text" name="newSku" placeholder='Ej: P2547T25' className="form-control" value={sku} />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label fw-bold">Stock</label>
                        <input onChange={(e) => { setStock(e.target.value) }} type="number" name="newStock" className="form-control" value={stock} />
                    </div>
                    <div className="col-md-2 d-flex align-self-end">
                        <button onClick={handleAddSizeSubmit} type="button" className={`btn btn-success w-100`}> Agregar </button>
                    </div>
                </div>
                <div className='row justify-content-md-center g-3 my-5 border border-secondary pb-3'>
                    {renderSizes()}
                    <label className='fw-bold' >Cantidad: {stocks}</label>
                    <button type="button" onClick={updateSizes} className={`col-md-2 btn btn-dark`}> Guardar tallas </button>
                </div>
                <Toaster
                    position='bottom-right'
                    toastOptions={{
                        // Define default options
                        duration: 5000,
                    }}
                />
            </div>

        </>
    )
}

export default ProductSizes