import { useNavigate } from "react-router-dom"
import './newProduct.css'
import ImageUploader from "./ImageUploader";
function NewProduct() {
    const navigation = useNavigate();
    return (
        <div>
            <button onClick={() => { navigation(-1) }} type="button" className="btn btn-lg btn-secondary mt-3">
                <i className="bi bi-arrow-left-square"></i>
            </button>
            <div className="new-product-container">
                <h2 className='fw-bold text-center my-3'>Nuevo Producto</h2>
                <form className="row g-3 align-items-center fw-bold" >
                    <ImageUploader />
                    <div className="col-md-2 d-flex align-items-center flex-column gap-1">
                        <label className="form-check-label" htmlFor="isVariable">Tallas</label>
                        <input className="form-check-input " name="isVariable" type="checkbox" id="flexCheckDefault" />
                    </div>
                    <div className="col-md-2">
                        <label className="form-label" htmlFor="sku">sku</label>
                        <input type="text" name="sku" className="form-control" />
                    </div>
                    <div className="col-md-8">
                        <label className="form-label" htmlFor="flexCheckDefault">Nombre</label>
                        <input type="text" name="name" className="form-control" />
                    </div>
                </form>
            </div>
        </div>

    )
}

export default NewProduct