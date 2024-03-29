import { Link, Navigate } from 'react-router-dom';
import usePetition from '../../hooks/usePetition.js';
import { format } from 'date-fns';
import './products.css'
import { useContext, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import UserContext from '../../Context/UserContext.jsx';
function Products() {

    const { user } = useContext(UserContext)
    if (user.permissions.products !== 1) {
        return <Navigate to={'/dashboard'} />
    }
    const URL_BASE = import.meta.env.VITE_URL_BASE
    const token = localStorage.getItem("token")
    const [search, setSearch] = useState('')
    const [data, IsLoading, error, setData] = usePetition('products');


    const deleteProduct = (id) => {
        const deleteProduct = confirm('Desea borrar este Producto?, los datos relacionados a este producto se perderan')
        if (deleteProduct) {
            axios.delete(`${URL_BASE}products/delete/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            })
                .then(response => {
                    //console.log(response)
                    const result = data.filter(product => product.product_id != id)
                    setData(result);
                    toast.success('Producto Borrado')

                })
                .catch(error => {
                    console.log(error)
                    toast.error(`Algo salió mal: ${error.message}`)
                })
        }
    }
    const renderProducts = () => {
        if (IsLoading) {
            return <>
                <div className="d-flex justify-content-center">
                    <div className="spinner-border m-5" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </>
        }
        if (error) {
            return <span>Error: {error}</span>
        }
        if (!data || data.length === 0) {
            return <span>No hay Productos para mostrar</span>
        }

        return (
            <table id='products-table' className="table table-hover table-striped text-center align-middle">
                <thead>
                    <tr>
                        <th className='column-headers' scope="col">#</th>
                        <th className='sticky column-headers' scope="col">IdProducto</th>
                        <th className='sticky-2 column-headers' scope="col">Imágen</th>
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
                        data.filter(item => {
                            return search.toLowerCase() === "" ? item : item.name.toLowerCase().includes(search) || item.sku.toLowerCase().includes(search) || item.description.toLowerCase().includes(search) || item.color.toLowerCase().includes(search)
                        }).map((product, index) => (
                            <tr key={product.product_id}>
                                <td className='column-values'>{index + 1}</td>
                                <td className='sticky column-values'>{product.product_id}</td>
                                <td className='sticky-2 column-values'><img className='product-image rounded' src={`${import.meta.env.VITE_URL_BASE}product/images/${product.image ? product.image : 'sin_imagen.jpg'}`}></img></td>
                                <td className='column-values'>{product.is_variable == 1 ? "SI" : "NO"}</td>
                                <td className='column-values'>{product.sku}</td>
                                <td className='column-values'>{product.name}</td>
                                <td  className='column-values'>{product.description}</td>
                                <td className='column-values'>{product.color}</td>
                                <td className='column-values'>${product.purchase_price}</td>
                                <td className='column-values'>${product.sale_price}</td>
                                <td className='column-values'>{product.general_stock}</td>
                                <td className='column-values'>{product.uom}</td>
                                <td className='column-values'>{format(new Date(product.create_date), 'dd-MM-yyyy HH:mm:ss')}</td>
                                <td className='column-values'>
                                    {
                                        user.profile.toLowerCase() == 'administrador' && (
                                            <div className='d-flex justify-content-center gap-2'>
                                                <Link to={`${product.product_id}/update`} className='btn btn-warning'>Editar</Link>
                                                <button type='button' onClick={() => { deleteProduct(product.product_id) }} className='btn btn-danger'>Eliminar</button>
                                            </div>
                                        )
                                    }

                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        )
    }
    return (
        <>
            <div className='module-header'>
                <h2 className='fw-bold text-center'>PRODUCTOS</h2>
                <div className='sub-menu-wrapper'>
                    <div>
                        <Link to={'inventory'} type='button' className='btn btn-warning add-btn'>
                            <i className="bi bi-list-check"></i>
                            inventario
                        </Link>
                    </div>
                    <div>
                        <Link to={'new'} type='button' className='btn btn-success add-btn'>
                            <i className="bi bi-plus-circle-fill"></i>
                            Agregar
                        </Link>
                    </div>
                </div>

            </div>
            <input onChange={(e) => { setSearch(e.target.value.toLowerCase()) }} id='search-field' className="form-control form-control-lg my-3" type="text" placeholder="Buscar producto.." aria-label="search product" autoFocus />

            <div id='prouducts-container'>
                {renderProducts()}
            </div>
            <Toaster
                position='bottom-right'
            />
        </>

    )


}
export default Products