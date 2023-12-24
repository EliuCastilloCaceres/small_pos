import { useParams, Link } from "react-router-dom";
import usePetition from "../hooks/usePetition";
import axios from "axios";
import { useEffect, useState } from "react";
import ProvidersPicker from "./ProvidersPicker";
import { hasOnlyNumbers } from '../helpers/formFieldValidators.js';
import MessageCard from "./MessageCard.jsx";
import './productUpdate.css'
import ImageUploader from "./ImageUploader.jsx";
import BackButton from "./BackButton.jsx";
import ProductSisez from "./ProductSizes.jsx"

function ProductUpdate() {
    const { productId } = useParams();
    const [data, isLoading, error] = usePetition(`products/${productId}`);
    const [updateMessage, setUpdateMessage] = useState(null)
    const [alertType, setalertType] = useState('')
    const [loading, setLoading] = useState(false)
    const [showAlert, setShowAlert] = useState(false)
    const [saved, setSaved] = useState(false)
    const [generalStock, setGeneralStock] = useState(null)
    const [sizesStock, setSizesStock] = useState(null)
    const [hasTallas, setHasTallas] = useState(null)
    const token = localStorage.getItem("token")
    useEffect(() => {
        if (data) {
            setGeneralStock(data[0].general_stock);
            if (data[0].is_variable == 1) {
                setHasTallas(true)
            } else {
                setHasTallas(false)
            }
        }
    }, [data])
    const handleSizesStock = (dataSizes) => {
        console.log('Suma de las tallas del hijo: ', dataSizes)
        setSizesStock(dataSizes)
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!hasOnlyNumbers(e.target.purchasePrice.value)) {

            e.target.purchasePrice.classList.add('border-danger')
            e.target.purchasePrice.focus()
            return
        } else if (!hasOnlyNumbers(e.target.salePrice.value)) {
            e.target.salePrice.classList.add('border-danger')
            e.target.salePrice.focus()
            return
        }
        else if (!hasOnlyNumbers(e.target.generalStock.value)) {
            e.target.generalStock.classList.add('border-danger')
            e.target.generalStock.focus()
            return
        }
        e.target.generalStock.classList.remove('border-danger')
        e.target.salePrice.classList.remove('border-danger')
        e.target.purchasePrice.classList.remove('border-danger')
        if (e.target.isVariable.checked) {
            if (generalStock != sizesStock) {
                alert('El Stock General y la suma del stock de las tallas no coinciden')
                return
            }
        }
        const formData = new FormData(e.target);
        console.log(e.target.image.files[0])
        const URL_BASE = import.meta.env.VITE_URL_BASE
        setLoading(true)
        axios.put(`${URL_BASE}products/update/${productId}`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                setLoading(false)
                console.log(response)
                setUpdateMessage('Cambios guardados correctamente')
                setShowAlert(true)
                setalertType('success')
                setSaved(true)
                setGeneralStock(e.target.generalStock.value)

            })
            .catch(error => {
                setLoading(false)
                console.log(error)
                setUpdateMessage('Algo salio mal: ' + error.message)
                setShowAlert(true)
                setalertType('danger')
                setSaved(false)
            })
    }

    if (isLoading) {
        return <>
            <BackButton saved={saved} />
            <span>Cargando datos...</span>
        </>
    }
    if (error) {
        return <>
            <BackButton saved={saved} />
            <span>Error: {error}</span>
        </>
    }
    if (!data || data.length === 0) {
        return <>
            <BackButton saved={saved} />
            <span>No hay datos para mostrar =C</span>
        </>
    }

    return <div>
        <BackButton saved={saved} />
        <span>Generl stock {generalStock}</span>
        <div className={`product-update-container ${loading && 'loading'}`}>
            <h2 className='fw-bold text-center my-3'>Detalles Producto {productId}</h2>
            <div className={`spinner-border spinner ${!loading && 'hide'}`} role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            <form onSubmit={handleSubmit} className="row g-3 align-items-center fw-bold" >

                <ImageUploader defaultSrc={`${import.meta.env.VITE_URL_BASE}product/images/${data[0].image ? data[0].image : 'sin_imagen.jpg'}`} />


                <div className="col-md-2 d-flex align-items-center flex-column gap-1">
                    <label className="form-check-label" htmlFor="isVariable">Tallas</label>
                    <input onChange={(e) => { setHasTallas(e.target.value) }} className="form-check-input" name="isVariable" type="checkbox" defaultChecked={data[0].is_variable == 1 ? (true) : (false)} id="flexCheckDefault" />

                </div>
                <div className="col-md-2">
                    <label className="form-label" htmlFor="sku">sku</label>
                    <input type="text" name="sku" className="form-control" defaultValue={data[0].sku} />
                </div>
                <div className="col-md-8">
                    <label className="form-label" htmlFor="flexCheckDefault">Nombre</label>
                    <input type="text" name="name" className="form-control" defaultValue={data[0].name} />
                </div>
                <div className="col-md-10">
                    <label className="form-label" htmlFor="description">Descripcion</label>
                    <input type="text" name="description" className="form-control" defaultValue={data[0].description} />
                </div>
                <div className="col-md-2">
                    <label className="form-label" htmlFor="color">color</label>
                    <input type="text" name="color" className="form-control" defaultValue={data[0].color} />
                </div>
                <div className="col-md-2">
                    <label className="form-label" htmlFor="purchasePrice">PrecioCompra</label>
                    <input type="text" name="purchasePrice" className="form-control" defaultValue={data[0].purchase_price} />
                </div>
                <div className="col-md-2">
                    <label className="form-label" htmlFor="salePrice">PrecioVenta</label>
                    <input type="text" name="salePrice" className="form-control" defaultValue={data[0].sale_price} />
                </div>
                <div className="col-md-2">
                    <label className="form-label" htmlFor="generalStock">StockGeneral</label>
                    <input type="text" name="generalStock" className="form-control" defaultValue={data[0].general_stock} />
                </div>
                <div className="col-md-2">
                    <label className="form-label" htmlFor="uom">UoM</label>
                    <select name="uom" className="form-select" defaultValue={data[0].uom}>

                        <option value="pza">pza</option>
                        <option value="kg" >kg</option>
                        <option value="gr" >gr</option>
                        <option value="mt" >mt</option>
                        <option value="cm" >cm</option>

                    </select>
                </div>
                <div className="col-md-4">
                    <label className="form-label" htmlFor="providerId">Proveedor</label>
                    <ProvidersPicker name="providerId" selectedProvider={data[0].provider_id} />
                </div>
                <div className="col-12">
                    <button type="submit" className={`btn btn-primary ${loading && 'disabled'}`}>Guardar</button>
                </div>


            </form>
            {
                hasTallas && (
                    <ProductSisez
                        generalStock={generalStock}
                        onSendSizesStock={handleSizesStock}
                    />
                )
            }


            {
                showAlert && (
                    <div className="m-3 alert-container">
                        <MessageCard
                            message={updateMessage}
                            onClose={() => setShowAlert(false)}
                            type={alertType}
                        />
                    </div>

                )
            }

        </div>
    </div>




}

export default ProductUpdate