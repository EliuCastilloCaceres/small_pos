import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import ProvidersPicker from "./ProvidersPicker";
import { hasOnlyNumbers } from '../helpers/formFieldValidators.js';
import MessageCard from "./MessageCard.jsx";
import './newProduct.css'
import ImageUploader from "./ImageUploader.jsx";
function NewProduct() {
    const [updateMessage, setUpdateMessage] = useState(null)
    const [showAlert, setShowAlert] = useState(false)
    const [alertType, setalertType] = useState('')
    const [loading, setLoading] = useState(false)
    const token = localStorage.getItem("token")
    const navigation = useNavigate()
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
                console.log(response)
                setUpdateMessage('Producto creado exitosamente')
                setShowAlert(true)
                setalertType('success')
                setLoading(true)
                setTimeout(() => {
                    setLoading(false)
                    navigation(-1)
                }, 1500)


            })
            .catch(error => {
                setLoading(false)
                console.log(error.message)
                setUpdateMessage('Algo salió mal: ' + error.message)
                setShowAlert(true)
                setalertType('danger')

            })
    }
    return (
        <div>
            <button onClick={() => { navigation(-1) }} type="button" className="btn btn-lg btn-secondary  mt-3">
                <i className="bi bi-arrow-left-square"></i>
            </button>
            <div className={`new-product-container ${loading && 'loading'} `}>
                <div className={`spinner-border spinner ${!loading && 'hide'}`} role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <h2 className='fw-bold text-center my-3'>Nuevo Producto</h2>

                <form onSubmit={handleSubmit} className="row g-3 align-items-center fw-bold" >

                    <ImageUploader defaultSrc={`${import.meta.env.VITE_URL_BASE}product/images/sin_imagen.jpg`} />


                    <div className="col-md-2 d-flex align-items-center flex-column gap-1">
                        <label className="form-check-label" htmlFor="isVariable">Tallas</label>
                        <input className="form-check-input" name="isVariable" type="checkbox" />

                    </div>
                    <div className="col-md-2">
                        <label className="form-label" htmlFor="sku">sku</label>
                        <input type="text" name="sku" className="form-control" />
                    </div>
                    <div className="col-md-8">
                        <label className="form-label" htmlFor="flexCheckDefault">Nombre</label>
                        <input type="text" name="name" className="form-control" />
                    </div>
                    <div className="col-md-10">
                        <label className="form-label" htmlFor="description">Descripcion</label>
                        <input type="text" name="description" className="form-control" />
                    </div>
                    <div className="col-md-2">
                        <label className="form-label" htmlFor="color">color</label>
                        <input type="text" name="color" className="form-control" />
                    </div>
                    <div className="col-md-2">
                        <label className="form-label" htmlFor="purchasePrice">PrecioCompra</label>
                        <input type="text" name="purchasePrice" className="form-control" />
                    </div>
                    <div className="col-md-2">
                        <label className="form-label" htmlFor="salePrice">PrecioVenta</label>
                        <input type="text" name="salePrice" className="form-control" />
                    </div>
                    <div className="col-md-2">
                        <label className="form-label" htmlFor="generalStock">StockGeneral</label>
                        <input type="text" name="generalStock" className="form-control" />
                    </div>
                    <div className="col-md-2">
                        <label className="form-label" htmlFor="uom">UoM</label>
                        <select name="uom" className="form-select" defaultValue=''>
                            <option disabled value="">Seleccionar</option>
                            <option value="pza">pza</option>
                            <option value="kg" >kg</option>
                            <option value="gr" >gr</option>
                            <option value="mt" >mt</option>
                            <option value="cm" >cm</option>

                        </select>
                    </div>
                    <div className="col-md-4">
                        <label className="form-label" htmlFor="providerId">Proveedor</label>
                        <ProvidersPicker name="providerId" />
                    </div>
                    <div className="col-12 my-5">
                        <button type="submit" className={`btn btn-primary ${loading && 'disabled'}`}>Guardar</button>
                    </div>

                </form>

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
    )
}

export default NewProduct