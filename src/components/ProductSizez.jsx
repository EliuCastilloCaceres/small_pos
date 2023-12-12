
import { useNavigate, useParams } from 'react-router-dom'
import './productSizes.css'
import usePetition from '../hooks/usePetition';
function ProductSizes() {
    const { productId } = useParams();
    const [data, isLoading, error] = usePetition(`products/${productId}/sizes`);
    const navigation = useNavigate();
    return (
        <>
            <button onClick={() => { navigation(-1) }} type="button" className="btn btn-lg btn-secondary  mt-3">
                <i className="bi bi-arrow-left-square"></i>
            </button>
            <div className="product-sizes-container text-center">
                <h2 className='my-3'>Editar Tallas del producto {productId}</h2>
                <form className='row g-3'>
                    <div className="col-md-3">
                        <label className="form-label fw-bold">Talla</label>
                        <input type="text" name="size" className="form-control" />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label fw-bold">Código de Variante</label>
                        <input type="text" name="code" className="form-control" />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label fw-bold">Stock</label>
                        <input type="text" name="stock" className="form-control" />
                    </div>
                    <div className="col-md-2 d-flex align-self-end">
                        <button type="submit" className={`btn btn-success w-100`}> Agregar </button>
                    </div>
                </form>
                <div className='row g-3 my-5 border border-secondary pb-3'>
                    {
                        isLoading ? (<span>Cargando datos...</span>) : error ? (<span>Error: {error}</span>)
                            : data ? (
                                data.map(({ size_id, size, sku, stock },index) => (
                                    <div key={size_id} className='row g-2'>
                                        <div className="col-md-3">
                                            {index==0 && (<label className="form-label fw-bold">Talla</label>)}
                                            <input type="text" name="size" className="form-control" defaultValue={size} />
                                        </div>
                                        <div className="col-md-4">
                                        {index==0 && (<label className="form-label fw-bold">Código Variante</label>)}
                                            <input type="text" name="code" className="form-control" defaultValue={sku} />
                                        </div>
                                        <div className="col-md-3">
                                        {index==0 && (<label className="form-label fw-bold">stock</label>)}
                                            <input type="text" name="stock" className="form-control" defaultValue={stock} />
                                        </div>
                                        <div className="col-md-2 d-flex align-self-end">
                                            <button type="button" className={`btn btn-danger`}>
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (<span>No hay tallas para este producto aun</span>)
                    }
                </div>
            </div>
        </>
    )
}

export default ProductSizes