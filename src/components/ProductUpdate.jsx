import { useParams, useNavigate, Link } from "react-router-dom";
import usePetition from "../hooks/usePetition";
import axios from "axios";
import { useState } from "react";
import ProvidersPicker from "./ProvidersPicker";
import { hasOnlyNumbers } from '../helpers/formFieldValidators.js';
import MessageCard from "./MessageCard.jsx";
import './productUpdate.css'
import ImageUploader from "./ImageUploader.jsx";

function ProductUpdate() {
    const { productId } = useParams();
    const [data, isLoading, error] = usePetition(`products/${productId}`);
    const [updateMessage, setUpdateMessage] = useState(null)
    const [alertType, setalertType] = useState('')
    const [loading, setLoading] = useState(false)
    const [showAlert, setShowAlert] = useState(false)
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

            })
            .catch(error => {
                setLoading(false)
                console.log(error)
                setUpdateMessage('Algo salio mal: ' + error.message)
                setShowAlert(true)
                setalertType('danger')
            })
    }
    return (
        <div>
            <button onClick={() => { navigation(-1) }} type="button" className="btn btn-lg btn-secondary  mt-3">
                <i className="bi bi-arrow-left-square"></i>
            </button>
            {
                isLoading ? (<span>Cargando datos...</span>) : error ? (<span>Error: {error}</span>)
                    : data ?
                        (
                            <div className={`product-update-container ${loading && 'loading'}`}>
                                <h2 className='fw-bold text-center my-3'>Detalles Producto {productId}</h2>
                                <div className={`spinner-border spinner ${!loading && 'hide'}`} role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <form onSubmit={handleSubmit} className="row g-3 align-items-center fw-bold" >

                                    <ImageUploader defaultSrc={`${import.meta.env.VITE_URL_BASE}product/images/${data[0].image ? data[0].image : 'sin_imagen.jpg'}`} />


                                    <div className="col-md-2 d-flex align-items-center flex-column gap-1">
                                        <label className="form-check-label" htmlFor="isVariable">Tallas</label>
                                        <input className="form-check-input" name="isVariable" type="checkbox" defaultChecked={data[0].is_variable == 1 ? (true) : (false)} id="flexCheckDefault" />

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
                                    <div className="col-md-6">
                                        <Link to={`sizes`} type="button" className={`btn btn-dark`}>Editar Tallas</Link>
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
                        ) : (<span>No hay productos para mostrar =C</span>)
            }
        </div>
    )


}

export default ProductUpdate