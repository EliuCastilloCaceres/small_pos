
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
    if (user.permissions.products !== 1) {
        return <Navigate to={'/dashboard'} />
    }
    const URL_BASE = import.meta.env.VITE_URL_BASE
    const token = localStorage.getItem("token")
    const [loading, setLoading] = useState(false)
    const [saved, setSaved] = useState(true)
    const [imgSrc, setImgSrc] = useState(`${URL_BASE}product/images/sin_imagen.jpg`)
    const [size, setSize] = useState('')
    const [sku, setSku] = useState('')
    const [stock, setStock] = useState(0)
    const sizeInput = document.getElementById('sizeInput')

    const [fields, setFields] = useState({
        sku: '',
        name: '',
        description: '',
        color: '',
        purchasePrice: '0',
        salePrice: '0',
        generalStock: '',
        uom: '',
        isVariable: false,
        providerId: ''
    })
    const [sizes, setSizes] = useState([])

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
    const preventSubmitForm = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Evita que se envíe el formulario
        }
    }
    const handleChange = (e, fieldName) => {
        setFields({
            ...fields,
            [fieldName]: fieldName != 'isVariable' ? e.target.value : !fields.isVariable
        })


        setSaved(false)
    }
    const handleStockChange = (e) => {
        const value = e.target.value
        if (/^\d*\.?\d*$/.test(value)) {
            setStock(value); // Actualiza el estado con el nuevo array actualizado
        }
    }
    const changeImgSrc = (newSrc) => {
        setImgSrc(newSrc)
    }
    const selectProvider = (provider) => {
        setFields({
            ...fields,
            providerId: provider
        })
    }
    const deleteSize = (idx) => {
        const result = sizes.filter((s, index) => index != idx)
        setSizes(result);
    }
    const isSaved = (saved) => {
        setSaved(saved)
    }
    const handleSizeChange = (e, name, idx) => {
        const value = e.target.value

        const updatedSizes = sizes.map((item, index) => {
            if (index === idx) {
                if (name === 'stock') {
                    if (/^\d*\.?\d*$/.test(value)) {
                        console.log('hellow')
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
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('sizes:', sizes)
        if (!hasOnlyNumbers(e.target.purchasePrice.value)) {

            e.target.purchasePrice.classList.add('border-danger')
            e.target.purchasePrice.focus()
            return
        } else if (!hasOnlyNumbers(e.target.salePrice.value)) {
            e.target.salePrice.classList.add('border-danger')
            e.target.salePrice.focus()
            return
        }
        // else if (!hasOnlyNumbers(e.target.generalStock.value)) {
        //     e.target.generalStock.classList.add('border-danger')
        //     e.target.generalStock.focus()
        //     return
        // }
        // e.target.generalStock.classList.remove('border-danger')
        e.target.salePrice.classList.remove('border-danger')
        e.target.purchasePrice.classList.remove('border-danger')
        let errors = false
        if (fields.isVariable) {
                sizes.map((s) => {
                    if (!errors) {
                        if(s.size === ''){
                            errors = true
                            return
                        }
                        
                    }

                })
        }
        if (errors) {
            alert('algun campo de las tallas esta vacío')
            return
        }
        const formData = new FormData(e.target);
        formData.append('sizes',JSON.stringify(sizes))
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
                    purchasePrice: '0',
                    salePrice: '0',
                    generalStock: '',
                    uom: '',
                    isVariable: false,
                    providerId: ''
                })
                setSizes([])
                e.target.image.value = ''
                setImgSrc(`${URL_BASE}product/images/sin_imagen.jpg`)
            })
            .catch(error => {
                setLoading(false)
                console.log(error)
                toast.error(`Algo salió mal: ${error.response.data.message ?? error.message}`)

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
                    {/* <div className="col-md-6">
                        <label className="form-label" htmlFor="generalStock">StockGeneral</label>
                        <input onChange={(e) => { handleChange(e, 'generalStock') }} value={fields.generalStock} type="text" name="generalStock" className="form-control" />
                    </div> */}
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
                        fields.isVariable === true && (
                            <div className='row g-3 justify-content-center'>
                                <div className="col-md-3">
                                    <label className="form-label fw-bold">Talla</label>
                                    <input onKeyDown={preventSubmitForm} onChange={(e) => { setSize(e.target.value) }} id='sizeInput' type="text" name="newSize" className="form-control" placeholder='Ej: 25' value={size} />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label fw-bold">Sku</label>
                                    <input onKeyDown={preventSubmitForm} onChange={(e) => { setSku(e.target.value) }} type="text" name="newSku" placeholder='Ej: P2547T25' className="form-control" value={sku} />
                                </div>
                                {/* <div className="col-md-3">
                                    <label className="form-label fw-bold">Stock</label>
                                    <input onKeyDown={preventSubmitForm} onChange={handleStockChange} type="number" name="newStock" className="form-control" value={stock} />
                                </div> */}
                                <div className="col-md-2 d-flex align-self-end">
                                    <button onClick={handleAddSize} type="button" className={`btn btn-success w-100`}> Agregar </button>
                                </div>

                                <div>
                                    <h3 className="text-center">Tallas</h3>
                                    <div>
                                        {
                                            sizes && sizes.length > 0 && (
                                                <ul className="sizes-list">

                                                    {
                                                        sizes.map((s, index) => (
                                                            <li key={index} className="size-card">
                                                                <div>
                                                                    <span>Talla</span>

                                                                    <input onChange={(e) => { handleSizeChange(e, 'size', index) }} className="form-control" type="text" value={s.size} name="size" />
                                                                </div>
                                                                <div>
                                                                    <span>Sku</span>
                                                                    <input onChange={(e) => { handleSizeChange(e, 'sku', index) }} className="form-control" type="text" value={s.sku} name="sizeSku" />

                                                                </div>
                                                                {/* <div>
                                                                    <span>Stock</span>
                                                                    <input onChange={(e) => { handleSizeChange(e, 'stock', index) }} className="form-control" type="text" value={s.stock} name="stock" />

                                                                </div> */}
                                                                <div>
                                                                    <button onClick={() => { deleteSize(index) }} type="button" className={`btn btn-danger`}>
                                                                        <i className="bi bi-trash"></i>
                                                                    </button>
                                                                </div>

                                                            </li>
                                                        ))
                                                    }
                                                </ul>
                                            )


                                        }
                                    </div>
                                </div>
                            </div>
                        )
                    }

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