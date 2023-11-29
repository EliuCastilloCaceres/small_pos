import { useParams, useNavigate } from "react-router-dom";
import usePetition from "../hooks/usePetition";
import axios from "axios";
import { useState } from "react";
import ProvidersPicker from "./ProvidersPicker";
import { hasOnlyNumbers } from '../helpers/formFieldValidators.js';
import MessageCard from "./MessageCard.jsx";
import './productUpdate.css'

function ProductUpdate() {
    const imageStyles = {
        width: "200px",
        heigth: "auto"
    }
    const { productId } = useParams();
    const [data, isLoading, error] = usePetition(`products/${productId}`);
    const [updateMessage, setUpdateMessage] = useState(null)
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
        const URL_BASE = import.meta.env.VITE_URL_BASE
        axios.put(`${URL_BASE}products/update/${productId}`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                console.log(response)
                setUpdateMessage(response.data.message)
                setShowAlert(true)

            })
            .catch(error => {
                console.log(error)
            })
    }
    return (
        <div>
            <button onClick={() => { navigation(-1) }} type="button" className="btn btn-secondary">
                <i className="bi bi-arrow-left-square"></i>
            </button>
            {
                isLoading ? (<span>Cargando datos...</span>) : error ? (<span>Error: {error}</span>) 
                : data ?
                    (
                        <div className="product-update-container">
                            <h2 className='fw-bold text-center my-3'>Detalles Producto {productId}</h2>

                            <form onSubmit={handleSubmit} className="row g-3 align-items-center fw-bold" >
                                <div className="main-form-div">
                                    <div className="d-flex align-items-center">
                                        <div>
                                            <img style={imageStyles} src={`${import.meta.env.VITE_URL_BASE}product/images/${data[0].image}`} alt="" />
                                        </div>
                                        <div className="col-md-8 ms-2">
                                        <label className="form-label" htmlFor="image">imágen</label>
                                            <input className="form-control" type="file" name="image" />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-1 d-flex gap-1">
                                    <input className="form-check-input" name="isVariable" type="checkbox" defaultChecked={data[0].is_variable == 1 ? (true) : (false)} id="flexCheckDefault" />
                                    <label className="form-check-label" htmlFor="isVariable">Variable</label>
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
                              

                                <div className="col-12 my-3">
                                    <button type="submit" className="btn btn-primary">Guardar</button>
                                </div>

                            </form>

                            {
                                showAlert && (
                                    <div className="m-3 alert-container">
                                        <MessageCard
                                            message={updateMessage}
                                            onClose={() => setShowAlert(false)}
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