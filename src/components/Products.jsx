import { Link } from 'react-router-dom';
import usePetition from '../hooks/usePetition.js';
import { format } from 'date-fns';
import './products.css'
function Products() {
    const [data, IsLoading, error] = usePetition('products');
    let i = 1;
    return (
        <div id='prouducts-container'>
            <h2 className='fw-bold text-center my-3'>PRODUCTOS</h2>
            {
                IsLoading ?
                    (<div className="d-flex justify-content-center">
                        <div className="spinner-border m-5" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>)
                    : error ?
                        (<span>Error: {error}</span>)
                        : data ? (
                            <table id='products-table' className="table table-hover table-striped text-center align-middle">
                                <thead>
                                    <tr>
                                        <th className='column-headers' scope="col">#</th>
                                        <th className='column-headers' scope="col">IdProducto</th>
                                        <th className='column-headers' scope="col">Imágen</th>
                                        <th className='column-headers' id='isVarCell' scope="col">EsVariable</th>
                                        <th className='column-headers' scope="col">sku</th>
                                        <th className='column-headers' scope="col">Nombre</th>
                                        <th className='column-headers' scope="col">Descripción</th>
                                        <th className='column-headers' scope="col">Color</th>
                                        <th className='column-headers' scope="col">PrecioCompra</th>
                                        <th className='column-headers' scope="col">PrecioVenta</th>
                                        <th className='column-headers' scope="col">StockGeneral</th>
                                        <th className='column-headers' scope="col">UM</th>
                                        <th className='column-headers' scope="col">FechaCreación</th>
                                        <th className='column-headers' scope="col">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        data.map(product => (
                                            <tr key={product.product_id}>
                                                <td  className='column-values'>{i++}</td>
                                                <td  className='column-values'>{product.product_id}</td>
                                                <td  className='column-values'><img className='product-image' src={`${import.meta.env.VITE_URL_BASE}product/images/${product.image}`}></img></td>
                                                <td  className='column-values'>{product.is_variable==1?(<i className=" fs-4 bi bi-check-circle-fill text-success"></i>) : (<i className=" fs-4 bi bi-x-circle-fill text-danger"></i>)}</td>
                                                <td  className='column-values'>{product.sku}</td>
                                                <td  className='column-values'>{product.name}</td>
                                                <td  className='column-values'>{product.description}</td>
                                                <td  className='column-values'>{product.color}</td>
                                                <td  className='column-values'>${product.purchase_price}</td>
                                                <td  className='column-values'>${product.sale_price}</td>
                                                <td  className='column-values'>{product.general_stock}</td>
                                                <td  className='column-values'>{product.uom}</td>
                                                <td  className='column-values'>{format(new Date(product.create_date), 'dd-MM-yyyy HH:mm:ss')}</td>
                                                <td  className='column-values'>
                                                    <div className='d-flex justify-content-center gap-2'>
                                                        <Link to={`${product.product_id}/update`} className='btn btn-warning'>Editar</Link>
                                                        <Link to={`${product.product_id}/delete`} className='btn btn-danger'>Eliminar</Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        ) : (<span>No hay Productos para mostrar</span>)}
        </div>
    )


}
export default Products