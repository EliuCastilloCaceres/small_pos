
import axios from "axios";
import { useContext, useState } from "react";
import ProvidersPicker from "../Providers/ProvidersPicker.jsx";
import { hasOnlyNumbers } from '../../helpers/formFieldValidators.js';
import './newProduct.css'
import ImageUploader from "../ImageUploader.jsx";
import BackButton from "../BackButton.jsx";
import toast, { Toaster } from "react-hot-toast";
import UserContext from "../../Context/UserContext.jsx";
import { Navigate } from "react-router-dom";
function NewProduct() {
    const { user } = useContext(UserContext)
    if(user.permissions.products !==1){
        return <Navigate to={'/dashboard'} />
    }
    const URL_BASE = import.meta.env.VITE_URL_BASE
    const token = localStorage.getItem("token")
    const [loading, setLoading] = useState(false)
    const [saved, setSaved] = useState(true)
    const [imgSrc, setImgSrc] = useState(`${URL_BASE}product/images/sin_imagen.jpg`)
    const [fields, setFields] = useState({
        sku: '',
        name: '',
        description: '',
        color: '',
        purchasePrice: '',
        salePrice: '',
        generalStock: '',
        uom: '',
        isVariable: false,
        providerId: ''
    })
    

    const handleChange = (e, fieldName) => {
        setFields({
            ...fields,
            [fieldName]: fieldName != 'isVariable' ? e.target.value : !fields.isVariable
        })


        setSaved(false)
    }
    const changeImgSrc = (newSrc)=>{
        setImgSrc(newSrc)
    }
    const selectProvider = (provider) => {
        setFields({
            ...fields,
            providerId: provider
        })
    }
    const isSaved = (saved) => {
        setSaved(saved)
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
        const formData = new FormData(e.target);
        const URL_BASE = import.meta.env.VITE_URL_BASE
        setLoading(true)
        axios.post(`${URL_BASE}products/create`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        })
            .then(response => {
                setLoading(false)
                setSaved(true)
                console.log(response)
                toast.success('Producto Creado')
                setFields({
                    sku: '',
                    name: '',
                    description: '',
                    color: '',
                    purchasePrice: '',
                    salePrice: '',
                    generalStock: '',
                    uom: '',
                    isVariable: false,
                    providerId: ''
                })
                e.target.image.value = ''
                setImgSrc(`${URL_BASE}product/images/sin_imagen.jpg`)
            })
            .catch(error => {
                setLoading(false)
                console.log(error)
                toast.error(`Algo salió mal: ${error.response.data.message??error.message}`)

            })
    }
    return (
        <div>
            <BackButton saved={saved} />
            <div className={`new-product-container ${loading && 'loading'} `}>
                <div className={`spinner-border spinner ${!loading && 'hide'}`} role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <h2 className='fw-bold text-center my-3'>Nuevo Producto</h2>

                <form onSubmit={handleSubmit} className="row g-3 align-items-center fw-bold" >

                    <ImageUploader changeImgSrc={changeImgSrc} isSaved={isSaved} imgSrc={imgSrc} />


                    <div className="col-md-6">
                        <label className="form-label" htmlFor="sku">sku</label>
                        <input onChange={(e) => { handleChange(e, 'sku') }} value={fields.sku} type="text" name="sku" className="form-control" />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="flexCheckDefault">Nombre</label>
                        <input onChange={(e) => { handleChange(e, 'name') }} value={fields.name} type="text" name="name" className="form-control" required/>
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
                            <option value="pza">pza</option>
                            <option value="kg" >kg</option>
                            <option value="gr" >gr</option>
                            <option value="mt" >mt</option>
                            <option value="cm" >cm</option>

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
                    <div className="col-12 my-5 text-center">
                        <button type="submit" className={`btn btn-primary ${loading && 'disabled'}`}>Guardar</button>
                    </div>

                </form>

            </div>
                    <Toaster
                        position="bottom-right"
                    />
        </div>
    )
}

export default NewProduct