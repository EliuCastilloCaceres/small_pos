import { Link } from 'react-router-dom';
import usePetition from '../hooks/usePetition.js';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';
function Products() {

    const [data, IsLoading, error] = usePetition('products');
    const [product, setProduct] = useState(null)
    let i = 1;
    const imgStyles = {
        width:'80px',
        height: 'auto'
    }
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
    return (
        <div className='container'>
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
                            <table className="table table-hover table-striped text-center align-middle">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">IdProducto</th>
                                        <th scope="col">Imágen</th>
                                        <th scope="col">EsVariable</th>
                                        <th scope="col">sku</th>
                                        <th scope="col">Nombre</th>
                                        <th scope="col">Descripción</th>
                                        <th scope="col">Color</th>
                                        <th scope="col">PrecioCompra</th>
                                        <th scope="col">PrecioVenta</th>
                                        <th scope="col">StockGeneral</th>
                                        <th scope="col">UM</th>
                                        <th scope="col">FechaCreación</th>
                                        <th scope="col">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        data.map(product => (
                                            <tr key={product.product_id}>
                                                <td>{i++}</td>
                                                <td>{product.product_id}</td>
                                                <td><img style={imgStyles} src={`${import.meta.env.VITE_URL_BASE}product/images/${product.image}`}></img></td>
                                                <td>{product.is_variable==1?(<i className=" fs-4 bi bi-check-circle-fill text-success"></i>) : (<i className=" fs-4 bi bi-x-circle-fill text-danger"></i>)}</td>
                                                <td>{product.sku}</td>
                                                <td>{product.name}</td>
                                                <td>{product.description}</td>
                                                <td>{product.color}</td>
                                                <td>${product.purchase_price}</td>
                                                <td>${product.sale_price}</td>
                                                <td>{product.general_stock}</td>
                                                <td>{product.uom}</td>
                                                <td>{format(new Date(product.create_date), 'dd-MM-yyyy HH:mm:ss')}</td>
                                                <td >
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
                        ) : (<span>No hay Ventas para mostrar</span>)}
        </div>
    )


}
export default Products