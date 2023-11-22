import { useParams } from "react-router-dom";
import usePetition from "../hooks/usePetition";
import axios from "axios";
import { useState, useEffect } from "react";
import ProvidersPicker from "./ProvidersPicker";

function ProductUpdate() {
    const { productId } = useParams();
    const [data, isLoading, error] = usePetition(`products/${productId}`);
    const [product, setProduct] = useState(null)
    const [updateMessage, setUpdateMessage] = useState(null)
    const token = localStorage.getItem("token")
    useEffect(() => {
        if (data) {
            setProduct({
                isVariable: data[0].is_variable,
                sku: data[0].sku,
                name: data[0].name,
                description: data[0].description,
                color: data[0].color,
                purchasePrice: data[0].purchase_price,
                salePrice: data[0].sale_price,
                generalStock: data[0].general_stock,
                uom: data[0].uom,
                providerId: data[0].provider_id,
                image: data[0].image
            })
        }
    }, [data])
    const handleSubmit = (e) => {
        e.preventDefault();
        //console.log(e.target);
        const formData = new FormData(e.target);
        const URL_BASE=import.meta.env.VITE_URL_BASE
        axios.put(`${URL_BASE}products/update/${productId}`,formData,{
            headers:{
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response =>{
            console.log(response)
            setUpdateMessage(response.data.message)
            
        })
        .catch(error=>{
            console.log(error)
        })
    }
    if (isLoading) return <span>Cargando datos...</span>
    if (error) return <span>Error: {error}</span>
    if (data) {
        return (
            <div>
                <h2 className='fw-bold text-center my-3'>Detalles Producto {productId}</h2>

                <form onSubmit={handleSubmit} className="row g-3 align-items-center fw-bold" >
                    <div className="col-md-1">
                        <label htmlFor="productId" className="form-label">Id</label>
                        <input disabled readOnly type="text" className="form-control-plaintext" defaultValue={data[0].product_id} />
                    </div>
                    <div className="col-md-1 d-flex gap-1">
                        <input onChange={(e) => { setProduct({ ...product, isVariable: parseInt(e.target.checked ? (1) : (0)) }) }} className="form-check-input" name="isVariable" type="checkbox" defaultChecked={data[0].is_variable == 1 ? (true) : (false)} id="flexCheckDefault" />
                        <label className="form-check-label" htmlFor="isVariable">Variable</label>
                    </div>
                    <div className="col-md-2">
                        <label className="form-label" htmlFor="sku">sku</label>
                        <input onChange={(e) => { setProduct({ ...product, sku: e.target.value }) }} type="text" name="sku" className="form-control" defaultValue={data[0].sku} />
                    </div>
                    <div className="col-md-8">
                        <label className="form-label" htmlFor="flexCheckDefault">Nombre</label>
                        <input onChange={(e) => { setProduct({ ...product, name: e.target.value }) }} type="text" name="name" className="form-control" defaultValue={data[0].name} />
                    </div>
                    <div className="col-md-10">
                        <label className="form-label" htmlFor="description">Descripcion</label>
                        <input onChange={(e) => { setProduct({ ...product, description: e.target.value }) }} type="text" name="description" className="form-control" defaultValue={data[0].description} />
                    </div>
                    <div className="col-md-2">
                        <label className="form-label" htmlFor="color">color</label>
                        <input onChange={(e) => { setProduct({ ...product, color: e.target.value }) }} type="text" name="color" className="form-control" defaultValue={data[0].color} />
                    </div>
                    <div className="col-md-2">
                        <label className="form-label" htmlFor="purchasePrice">PrecioCompra</label>
                        <input onChange={(e) => { setProduct({ ...product, purchasePrice: parseInt(e.target.value) }) }} type="text" name="purchasePrice" className="form-control" defaultValue={data[0].purchase_price} />
                    </div>
                    <div className="col-md-2">
                        <label className="form-label" htmlFor="salePrice">PrecioVenta</label>
                        <input onChange={(e) => { setProduct({ ...product, salePrice: parseInt(e.target.value) }) }} type="text" name="salePrice" className="form-control" defaultValue={data[0].sale_price} />
                    </div>
                    <div className="col-md-2">
                        <label className="form-label" htmlFor="generalStock">StockGeneral</label>
                        <input onChange={(e) => { setProduct({ ...product, generalStock: parseInt(e.target.value) }) }} type="text" name="generalStock" className="form-control" defaultValue={data[0].general_stock} />
                    </div>
                    <div className="col-md-2">
                        <label className="form-label" htmlFor="uom">UoM</label>
                        <input onChange={(e) => { setProduct({ ...product, uom: e.target.value }) }} type="text" name="uom" className="form-control" defaultValue={data[0].uom} />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label" htmlFor="providerId">Proveedor</label>
                        <ProvidersPicker name="providerId" handleChange={(e) => { setProduct({ ...product, providerId: parseInt(e.target.value) }) }} selectedProvider={data[0].provider_id} />
                    </div>
                    <div className="col-md-12">
                        <label className="form-label" htmlFor="image">image</label>
                        <input onChange={(e) => { setProduct({ ...product, image: e.target.files[0] }) }} className="form-control" type="file" name="image" />
                    </div>

                    <div className="col-12">
                        <button type="submit" className="btn btn-primary">Sign in</button>
                    </div>
                </form>
                <div className={`toast align-items-center text-white bg-success border-0 ${updateMessage?('show'):('')} mt-5`} role="alert" aria-live="assertive" aria-atomic="true">
                    <div className="d-flex">
                        <div className="toast-body">
                            {updateMessage||<span>Error</span>}
                        </div>
                        <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                </div>
            </div>
        )
    }

}

export default ProductUpdate