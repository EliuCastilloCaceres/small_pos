import { useParams, Link } from "react-router-dom";
import usePetition from "../../hooks/usePetition.js";
import axios from "axios";
import { useEffect, useState } from "react";
import ProvidersPicker from "../Providers/ProvidersPicker.jsx";
import { hasOnlyNumbers } from '../../helpers/formFieldValidators.js';
import MessageCard from "../MessageCard.jsx";
import './productUpdate.css'
import ImageUploader from "../ImageUploader.jsx";
import BackButton from "../BackButton.jsx";
import ProductSisez from "./ProductSizes.jsx"
import toast, { Toaster } from "react-hot-toast";

function ProductUpdate() {
    const token = localStorage.getItem("token")
    const URL_BASE = import.meta.env.VITE_URL_BASE
    const { productId } = useParams();
    const [data, isLoading, error] = usePetition(`products/${productId}`);
    const [loading, setLoading] = useState(false)
    const [saved, setSaved] = useState(true)
    const [generalStock, setGeneralStock] = useState('')
    const [sizesStock, setSizesStock] = useState(null)
    const [hasTallas, setHasTallas] = useState(null)
    const [sizesSaved, setSizesSaved] = useState(true)
    const [imgSrc, setImgSrc] = useState(`${URL_BASE}product/images/sin_imagen.jpg`)
    const [selectedProvider, setSelectedProvider] = useState()
    useEffect(() => {
        if (data) {
            if (data[0].image) {
                setImgSrc(`${URL_BASE}product/images/${data[0].image}`)
                setSelectedProvider(data[0].provider_id)
            }
            setGeneralStock(data[0].general_stock);
            if (data[0].is_variable == 1) {
                setHasTallas(true)
            } else {
                setHasTallas(false)
            }
        }
    }, [data])
    const selectProvider = (provider) => {
        setSelectedProvider(provider)
    }
    const changeImgSrc = (newSrc) => {
        setImgSrc(newSrc)
    }
    const isSizesSaved = (saved) => {
        setSizesSaved(saved)
    }
    const isSaved = (saved) => {
        setSaved(saved)
    }
    const handleSizesStock = (dataSizes) => {
        //console.log('Suma de las tallas del hijo: ', dataSizes)
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
        setLoading(true)
        if (e.target.isVariable.checked) {
            //console.log(generalStock)
            //console.log(sizesStock)
            if (generalStock != sizesStock) {
                alert('El Stock General y la suma del stock de las tallas no coinciden')
                setLoading(false)
                return
            }
        }
        const formData = new FormData(e.target);
        //console.log(e.target.image.files[0])
        axios.put(`${URL_BASE}products/update/${productId}`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                setLoading(false)
                console.log(response)
                toast.success('Cambios Guardados')
                setSaved(true)
                setGeneralStock(e.target.generalStock.value)

            })
            .catch(error => {
                setLoading(false)
                console.log(error)
                toast.error(`Algo salió mal: ${error.message}`)
                setSaved(false)
                return
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
        <BackButton
            saved={saved}
            sizesSaved={sizesSaved}
        />
        <div className={`product-update-container ${loading && 'loading'}`}>
            <h2 className='fw-bold text-center my-3'>Detalles Producto {productId}</h2>
            <div className={`spinner-border spinner ${!loading && 'hide'}`} role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            <form onSubmit={handleSubmit} className="row g-3 align-items-center fw-bold" >

                <ImageUploader changeImgSrc={changeImgSrc} isSaved={isSaved} imgSrc={imgSrc} />
                <div className="col-md-6">
                    <label className="form-label" htmlFor="generalStock">StockGeneral</label>
                    <input onChange={(e) => {
                        setGeneralStock(e.target.value)
                        setSaved(false)
                    }} type="number" name="generalStock" className="form-control" value={generalStock} />
                </div>
                <div className="col-md-6">
                    <label className="form-label" htmlFor="purchasePrice">PrecioCompra</label>
                    <input onChange={() => { setSaved(false) }} type="number" name="purchasePrice" className="form-control" defaultValue={data[0].purchase_price} />
                </div>
                <div className="col-md-6">
                    <label className="form-label" htmlFor="salePrice">PrecioVenta</label>
                    <input onChange={() => { setSaved(false) }} type="number" name="salePrice" className="form-control" defaultValue={data[0].sale_price} />
                </div>

                <div className="col-md-6">
                    <label className="form-label" htmlFor="sku">sku</label>
                    <div className="d-flex gap-1">
                        <input onChange={() => { setSaved(false) }} type="text" name="sku" className="form-control" defaultValue={data[0].sku} />
                        <Link to={`../products/barcode/${data[0].sku}/${generalStock}`} type="button" className={`btn btn-info`} >
                            <i className="bi bi-upc"></i>
                        </Link>
                    </div>

                </div>
                <div className="col-md-6">
                    <label className="form-label" htmlFor="flexCheckDefault">Nombre</label>
                    <input onChange={() => { setSaved(false) }} type="text" name="name" className="form-control" defaultValue={data[0].name} />
                </div>
                <div className="col-md-6">
                    <label className="form-label" htmlFor="description">Descripcion</label>
                    <input onChange={() => { setSaved(false) }} type="text" name="description" className="form-control" defaultValue={data[0].description} />
                </div>
                <div className="col-md-4">
                    <label className="form-label" htmlFor="color">color</label>
                    <input onChange={() => { setSaved(false) }} type="text" name="color" className="form-control" defaultValue={data[0].color} />
                </div>
               
               
                <div className="col-md-3">
                    <label className="form-label" htmlFor="uom">UoM</label>
                    <select onChange={() => { setSaved(false) }} name="uom" className="form-select" defaultValue={data[0].uom}>

                        <option value="pza">pza</option>
                        <option value="kg" >kg</option>
                        <option value="gr" >gr</option>
                        <option value="mt" >mt</option>
                        <option value="cm" >cm</option>

                    </select>
                </div>
                <div className="col-md-4">
                    <label className="form-label" htmlFor="providerId">Proveedor</label>
                    <ProvidersPicker isSaved={isSaved} name="providerId" selectProvider={selectProvider} selectedProvider={selectedProvider} />
                </div>
                <div className="col-md-1 d-flex align-items-center flex-column gap-1">
                    <label className="form-check-label" htmlFor="isVariable">Tallas</label>
                    <input
                        onChange={
                            (e) => {
                                setHasTallas(e.target.checked)
                                setSaved(false)
                            }} className="form-check-input" name="isVariable" type="checkbox" defaultChecked={data[0].is_variable == 1 ? (true) : (false)} id="flexCheckDefault" />

                </div>
                {
                    hasTallas && (
                        <ProductSisez
                            generalStock={generalStock}
                            isSaved={isSaved}
                            onSendSizesStock={handleSizesStock}
                            isSizesSaved={isSizesSaved}
                        />
                    )
                }
                <div className="col-12 text-center my-5">
                    <button type="submit" className={`btn btn-primary ${loading && 'disabled'}`}>Guardar</button>
                </div>

            </form>

        </div>

        <Toaster
            position="bottom-right"
        />
    </div>




}

export default ProductUpdate