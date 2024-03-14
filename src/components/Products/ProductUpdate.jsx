import { useParams, Link, Navigate } from "react-router-dom";
import usePetition from "../../hooks/usePetition.js";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import ProvidersPicker from "../Providers/ProvidersPicker.jsx";
import { hasOnlyNumbers } from '../../helpers/formFieldValidators.js';
import MessageCard from "../MessageCard.jsx";
import './productUpdate.css'
import ImageUploader from "../ImageUploader.jsx";
import BackButton from "../BackButton.jsx";
import toast, { Toaster } from "react-hot-toast";
import UserContext from "../../Context/UserContext.jsx";
import ProductSizes from "./ProductSizes.jsx";

function ProductUpdate() {
    const { user } = useContext(UserContext)
    if (user.permissions.products !== 1) {
        return <Navigate to={'/dashboard'} />
    }
    const token = localStorage.getItem("token")
    const URL_BASE = import.meta.env.VITE_URL_BASE
    const { productId } = useParams();
    const [sizes, setSizes] = useState([])
    const [data, isLoading, error] = usePetition(`products/${productId}`);
    const [loading, setLoading] = useState(false)
    const [saved, setSaved] = useState(true)
    const [generalStock, setGeneralStock] = useState(0)
    const [totalSizesStock, setTotalSizesStock] = useState(0)
    const [imgSrc, setImgSrc] = useState(`${URL_BASE}product/images/sin_imagen.jpg`)
    const [fields, setFields] = useState({
        isVariable: false,
        sku: '',
        name: '',
        description: '',
        color: '',
        purchasePrice: '0',
        salePrice: '0',
        generalStock: '',
        uom: '',
        providerId: ''
    })
    useEffect(() => {
        if (data && data.length > 0) {
            if (data[0].image) {
                setImgSrc(`${URL_BASE}product/images/${data[0].image}`)
            }
            setFields({
                isVariable: data[0].is_variable === 1 ? true : false,
                sku: data[0].sku,
                name: data[0].name,
                description: data[0].description,
                color: data[0].color,
                purchasePrice: data[0].purchase_price,
                salePrice: data[0].sale_price,
                generalStock: data[0].general_stock,
                uom: data[0].uom,
                providerId: data[0].provider_id
            })
        }
    }, [data])
    const fetchSizes = async () => {
        setLoading(true)
        try {
            const response = await axios.get(`${URL_BASE}products/${productId}/sizes`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            })
            console.log(response.data.data)
            setSizes(response.data.data)
            
            setLoading(false)
        } catch (e) {
            console.log(e)
            setLoading(false)
            setError(e.message)
        }

    }
    const selectProvider = (provider) => {
        setFields({
            ...fields,
            providerId: provider
        })
    }
    const changeImgSrc = (newSrc) => {
        setImgSrc(newSrc)
    }
    const isSaved = (saved) => {
        setSaved(saved)
    }
    const handleChange = (e, fieldName) => {
        const value = e.target.value
        if (fieldName === 'purchasePrice' || fieldName === 'salePrice' || fieldName === 'generalStock') {
            if (/^\d*\.?\d*$/.test(value)) {
                setFields({
                    ...fields,
                    [fieldName]: value
                })

            }
        } else {
            setFields({
                ...fields,
                [fieldName]: fieldName != 'isVariable' ? value : !fields.isVariable
            })
        }
        setSaved(false)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(fields)
        if(fields.isVariable===1 && fields.generalStock!=totalSizesStock){
            alert(`el stock general: ${fields.generalStock} y el total de las tallas: ${totalSizesStock}, no coinciden`)
            return
        }
        setLoading(true)
     
            // const formData = new FormData(e.target);
        // console.log(e.target.image.files[0])
         const formData = new FormData()
        formData.append('image', e.target.image.files[0])
        formData.append('updates', JSON.stringify(fields))
        formData.append('sizes', JSON.stringify(sizes))
         try {
            const response = await axios.put(`${URL_BASE}products/update/${productId}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            setLoading(false)
            console.log(response)
            toast.success('Cambios Guardados')
            fetchSizes()
            setSaved(true)
            setGeneralStock(e.target.generalStock.value)

        } catch (e) {
            setLoading(false)
            console.log(e)
            toast.error(`Algo salió mal: ${e.message}`)
            setSaved(false)
        }


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
        />
        <div className={`product-update-container ${loading && 'loading'}`}>
            <h2 className='fw-bold text-center my-3'>Detalles Producto {productId}</h2>
            <div className={`spinner-border spinner ${!loading && 'hide'}`} role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            <form onSubmit={handleSubmit} className="row g-3 align-items-center fw-bold" >

                <ImageUploader changeImgSrc={changeImgSrc} isSaved={isSaved} imgSrc={imgSrc} />


                <div className="col-md-6">
                    <label className="form-label" htmlFor="sku">sku</label>
                    <input onChange={(e) => { handleChange(e, 'sku') }} value={fields.sku} type="text" name="sku" className="form-control" />
                </div>
                <div className="col-md-6">
                    <label className="form-label" htmlFor="flexCheckDefault">Nombre</label>
                    <input onChange={(e) => { handleChange(e, 'name') }} value={fields.name} type="text" name="name" className="form-control" required />
                </div>
                <div className="col-md-8">
                    <label className="form-label" htmlFor="description">Descripcion</label>
                    <input onChange={(e) => { handleChange(e, 'description') }} value={fields.description} type="text" name="description" className="form-control" />
                </div>
                <div className="col-md-4">
                    <label className="form-label" htmlFor="color">Color</label>
                    <input onChange={(e) => { handleChange(e, 'color') }} value={fields.color} type="text" name="color" className="form-control" />
                </div>
                <div className="col-md-6">
                    <label className="form-label" htmlFor="purchasePrice">PrecioCompra</label>
                    <input onChange={(e) => { handleChange(e, 'purchasePrice') }} value={fields.purchasePrice} type="text" name="purchasePrice" className="form-control" />
                </div>
                <div className="col-md-6">
                    <label className="form-label" htmlFor="salePrice">PrecioVenta</label>
                    <input onChange={(e) => { handleChange(e, 'salePrice') }} value={fields.salePrice} type="text" name="salePrice" className="form-control" />
                </div>
                <div className="col-md-6">
                    <label className="form-label" htmlFor="generalStock">StockGeneral</label>
                    <input onChange={(e) => { handleChange(e, 'generalStock') }} value={fields.generalStock} type="text" name="generalStock" className="form-control" />
                </div>
                <div className="col-md-6">
                    <label className="form-label" htmlFor="uom">UoM</label>
                    <select onChange={(e) => { handleChange(e, 'uom') }} value={fields.uom} name="uom" className="form-select">
                        <option disabled value="">Seleccionar</option>
                        <option value="par">par</option>
                        <option value="pza">pza</option>
                        <option value="kg" >kg</option>
                        <option value="mt" >mt</option>
                    </select>
                </div>
                <div className="col-md-6">
                    <label className="form-label" htmlFor="providerId">Proveedor</label>
                    <ProvidersPicker required={true} selectProvider={selectProvider} selectedProvider={fields.providerId} isSaved={isSaved} name="providerId" />
                </div>
                <div className="col-md-1 d-flex align-items-center flex-column gap-1">
                    <label className="form-check-label" htmlFor="isVariable">Tallas</label>
                    <input onChange={(e) => { handleChange(e, 'isVariable') }} checked={fields.isVariable} className="form-check-input" name="isVariable" type="checkbox" />

                </div>

                {
                    fields.isVariable && (
                      
                        <ProductSizes totalSizesStock={totalSizesStock} setTotalSizesStock={setTotalSizesStock} sizes={sizes} setSizes={setSizes} fetchSizes={fetchSizes} />
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