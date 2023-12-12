
import { useParams } from 'react-router-dom'
import './productSizes.css'
import usePetition from '../hooks/usePetition';
import BackButton from './BackButton';
function ProductSizes() {
    const { productId } = useParams();
    const [data, isLoading, error] = usePetition(`products/${productId}/sizes`);
    const btnClick =() => {
        document.getElementById('sizeInput').focus();
       
    }
    const handleAddSizeSubmit = (e)=>{
        e.preventDefault();
        console.log(e.target)
    }
    const renderSizes = () => {
        if (isLoading) {
            return <span>Cargando datos...</span>;
        }

        if (error) {
            return <span>Error: {error}</span>;
            
        }

        if (!data || data.length === 0) {
            return <span>
                No hay tallas para este producto aun
                <button onClick={btnClick} type="button" className="btn btn-link">Agregar Talla</button>
                </span>;
        }

        return data.map(({ size_id, size, sku, stock }, index) => (
            <div key={size_id} className='row g-2'>
                <div className="col-md-3">
                    {index == 0 && (<label className="form-label fw-bold">Talla</label>)}
                    <input type="text" name="size" className="form-control" defaultValue={size} />
                </div>
                <div className="col-md-4">
                    {index == 0 && (<label className="form-label fw-bold">Sku</label>)}
                    <input type="text" name="sku" className="form-control" defaultValue={sku} />
                </div>
                <div className="col-md-3">
                    {index == 0 && (<label className="form-label fw-bold">Stock</label>)}
                    <input type="text" name="stock" className="form-control" defaultValue={stock} />
                </div>
                <div className="col-md-2 d-flex align-self-end">
                    <button type="button" className={`btn btn-danger`}>
                        <i className="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        ))
    }

    return (
        <>
            <BackButton />
            <div className="product-sizes-container text-center">
                <h2 className='my-3'>Editar Tallas del producto {productId}</h2>
                <form onSubmit={handleAddSizeSubmit} className='row g-3'>
                    <div className="col-md-3">
                        <label className="form-label fw-bold">Talla</label>
                        <input id='sizeInput' type="text" name="size" className="form-control" required />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label fw-bold">Sku</label>
                        <input type="text" name="sku" className="form-control" required />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label fw-bold">Stock</label>
                        <input type="number" name="stock" className="form-control" />
                    </div>
                    <div className="col-md-2 d-flex align-self-end">
                        <button type="submit" className={`btn btn-success w-100`}> Agregar </button>
                    </div>
                </form>
                <div className='row g-3 my-5 border border-secondary pb-3'>
                    {renderSizes()}
                </div>
            </div>
        </>
    )
}

export default ProductSizes