import { Link, Navigate } from 'react-router-dom';
import usePetition from '../../hooks/usePetition.js';
import { format } from 'date-fns';
import './inventory.css'
import './products.css'
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import UserContext from '../../Context/UserContext.jsx';
import { formatToMoney } from '../../helpers/currencyFormatter.js';
import Modal from '../../Modal.jsx';
function Inventory() {
    const { user } = useContext(UserContext)
    if (user.permissions.products !== 1) {
        return <Navigate to={'/dashboard'} />
    }
    const URL_BASE = import.meta.env.VITE_URL_BASE
    const token = localStorage.getItem("token")
    const [search, setSearch] = useState('')
    const [productsTotal, setProductsTotal] = useState(0)
    const [costsTotal, setCostsTotal] = useState(0)
    const [salesTotal, setSalesTotal] = useState(0)
    const [showModal, setShowModal] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState()
    const [operationType, setOperationType] = useState('entry')
    const [sizes, setSizes] = useState()
    const [qty, setQty] = useState(0)
    const [reason, setReason] = useState('Inventario inicial')
    const [products, setProducts] = useState();
    const [isLoading, setIsLoading] = useState(false)
    const [isDisabled, setIsDisabled] = useState(true)
    const [error, setError] = useState()
    useEffect(() => {
        fetchProducts()
    }, [])

    useEffect(() => {
        if (products && products.length > 0) {
            let totalOfProducts = 0
            let totalOfCosts = 0
            let totalofsales = 0
            products.map(p => {
                totalOfProducts = totalOfProducts + p.general_stock
                totalOfCosts = totalOfCosts + (p.general_stock * p.purchase_price)
                totalofsales = totalofsales + (p.general_stock * p.sale_price)
            })
            setProductsTotal(totalOfProducts)
            setCostsTotal(totalOfCosts)
            setSalesTotal(totalofsales)
        }
    }, [products])
    useEffect(() => {
        if (sizes && sizes.length > 0) {
            let totalQty = 0
            sizes.map(s => {
                if (s.qty != '') {
                    totalQty = totalQty + parseFloat(s.qty)
                }
            })
            setQty(totalQty)
        }
    }, [sizes])
    const fetchProducts = async () => {
        setIsLoading(true)
        try {
            const response = await axios.get(`${URL_BASE}products`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            })
            console.log(response)
            let data = response.data.data
            setProducts(data)
            setIsLoading(false)
        } catch (e) {
            console.log('error: ' + e)
            setIsLoading(false)
            setError(e.message)
        }

    }
    const fetchSizes = async (productId) => {

        try {
            const response = await axios.get(`${URL_BASE}products/${productId}/sizes`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            })
            console.log(response)
            let data = response.data.data
            data.map(dt => {
                dt.qty = 0
            })
            return data
        } catch (e) {
            console.log('error: ' + e)
        }

    }
   const handleReasonChange = (e)=>{
        const value = e.target.value
        if(value.toLowerCase() !== 'otro'){
            setIsDisabled(true)
            setReason(value)
        }else{
            setReason('')
            setIsDisabled(false)
        }
   }
    const createInventory = async (info) => {
        const toastId = toast.loading('Procesando..')
        console.log('info: ', info)
        try {
            const response = await axios.post(`${URL_BASE}products/inventory/create`, info, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            })
            console.log(response)
            toast.success('Operación Exitosa', {
                id: toastId,
            });
            fetchProducts()
            toggleModal()
        } catch (e) {
            console.log(e)
            toast.error('Algo salio mal: ' + e, {
                id: toastId,
            });
        }

    }
    const toggleModal = () => {
        setShowModal(!showModal)
        setQty(0)
        setReason('Inventario inicial')
        setOperationType('entry')
    }
    const handleQtyChange = (e) => {
        const value = e.target.value
        if (/^\d*\.?\d*$/.test(value)) {
            setQty(value); // Actualiza el estado con el nuevo array actualizado
        }
    }
    const handleSizeQtyChange = (e, sizeId) => {
        const value = e.target.value
        if (/^\d*\.?\d*$/.test(value)) {
            const updatedSizes = sizes.map((item) => {
                if (item.size_id === sizeId) {
                    return { ...item, qty: value }; // Actualiza el valor 'qty' del elemento en el índice especificado
                }
                return item; // Mantiene los otros elementos sin cambios
            });

            setSizes(updatedSizes); // Actualiza el estado con el nuevo array actualizado
        }
    }
    const handleSizeQtyBlur = (e, sizeId) => {
        const value = e.target.value
        if (value === '' || !value) {
            const updatedSizes = sizes.map((item) => {
                if (item.size_id === sizeId) {
                    return { ...item, qty: 0 }; // Actualiza el valor 'qty' del elemento en el índice especificado
                }
                return item; // Mantiene los otros elementos sin cambios
            });

            setSizes(updatedSizes); // Actualiza el estado con el nuevo array actualizado
        }
    }
    const handleQtyBlur = (e) => {
        const value = e.target.value
        if (value === '' || !value) {

            setQty(0);
        }
    }
    const handleRowCLick = async (product) => {
        const p = { ...product }
        setSelectedProduct(p)
        const prodSizes = await fetchSizes(p.product_id)
        setSizes(prodSizes)
        console.log(prodSizes)
        toggleModal()
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        if (qty === 0) {
            return
        }
        console.log(sizes)
        let isError = false;
        if ((sizes && sizes.length > 0) && selectedProduct.is_variable === 1) {
            sizes.map((s, idx) => {
                if (!isError) {
                    if ((s.qty > s.stock && operationType == 'exit') || s.qty === '') {
                        e.target.qty[idx].classList.add('border-danger')
                        e.target.qty[idx].focus()
                        toast.error('Cantidad inválida')
                        isError = true;
                        return
                    } else {
                        e.target.qty[idx].classList.remove('border-danger')
                    }
                }
            })
            if (isError) {
                return
            }
        } else {
            if ((qty > selectedProduct.general_stock && operationType == 'exit') || qty === '') {
                e.target.qty.classList.add('border-danger')
                e.target.qty.focus()
                toast.error('Cantidad inválida')
                return
            } else {
                e.target.qty.classList.remove('border-danger')
            }
        }
        const productInfo = {
            product: selectedProduct,
            sizes: sizes,
            operationType: operationType,
            reason: reason,
            quantity: parseFloat(qty),
            userId: user.user_id
        }
        createInventory(productInfo)
    }

    const rendeModalView = () => {
        if (selectedProduct) {
            return (
                <div className='product-view-container'>
                    <div className="product-view-wrapper">
                        <div className='selected-product-view '>
                            <div className='img-wrapper'>
                                <img className='inventory-product-image rounded' src={`${import.meta.env.VITE_URL_BASE}product/images/${selectedProduct.image ? selectedProduct.image : 'sin_imagen.jpg'}`}></img>
                            </div>
                            <div className='product-information'>
                                <div className='info-div'>
                                    <span ><strong>Nombre: </strong>{selectedProduct.name}</span>

                                </div>
                                <div className='info-div'>
                                    <span ><strong>Sku:</strong> {selectedProduct.sku}</span>

                                </div>
                                <div className='info-div'>
                                    <span ><strong>Stock:</strong> <span>{selectedProduct.general_stock} {selectedProduct.uom}</span></span>

                                </div>
                            </div>
                            <div className='operation-container'>
                                <div className='operation-wrapper'>
                                    <span className='fw-bold'>Tipo de operación</span>
                                    <div className='d-flex gap-3'>
                                        <select onChange={(e) => { setOperationType(e.target.value) }} name="entryExitOperation" value={operationType}>
                                            <option value="entry">Entrada de inventario</option>
                                            <option value="exit">Salida de Inventario</option>
                                        </select>
                                        <div className={`operation-type-icon ${operationType === 'entry' ? ('bg-success') : ('bg-danger')}`}>
                                            {
                                                operationType === 'entry' ? (
                                                    <i className="bi bi-plus-circle-fill"></i>
                                                ) : (
                                                    <i className="bi bi-dash-circle-fill"></i>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>

                            </div>

                        </div>
                        <form className='w-100' onSubmit={handleSubmit}>
                            <div className=' table-wrapper'>
                                <table className='table table-bordered'>
                                    {
                                        selectedProduct.is_variable === 1 && (sizes && sizes.length > 0) ? (

                                            <>
                                                <thead >
                                                    <tr>
                                                        <th scope="col">Talla</th>
                                                        <th scope="col">Existencias</th>
                                                        <th scope="col">Cantida</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        sizes.map((s, index) => (
                                                            <tr key={s.size_id}>
                                                                <td>{s.size}</td>
                                                                <td>{s.stock}</td>
                                                                <td><input onBlur={(e) => { handleSizeQtyBlur(e, s.size_id) }} onChange={(e) => { handleSizeQtyChange(e, s.size_id) }} name='qty' className='text-center form-control' type="number" value={sizes[index].qty} /></td>
                                                            </tr>
                                                        ))
                                                    }
                                                </tbody>

                                            </>

                                        ) : (
                                            <>
                                                <thead>
                                                    <tr>
                                                        <th scope="col">Existencias</th>
                                                        <th scope="col">Cantida</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>{selectedProduct.general_stock}</td>
                                                        <td ><input onBlur={handleQtyBlur} onChange={handleQtyChange} name='qty' className='text-center form-control' type="number" value={qty} /></td>
                                                    </tr>
                                                </tbody>
                                            </>
                                        )
                                    }
                                </table>
                                <span>Total:{qty}</span>
                            </div>

                            <div className='w-100'>
                                <span>Motivo</span>
                                <select onChange={(e)=>{handleReasonChange(e)}} className='w-100 my-3'>
                                    <option value={'Inventario inicial'}>Inventario inicial</option>
                                    <option value={'Compra de producto'}>Compra de producto</option>
                                    <option value={'Producto expirado'}>Producto expirado</option>
                                    <option value={'Otro'}>Otro</option>
                                </select>
                                <textarea onChange={(e) => { setReason(e.target.value) }} disabled={isDisabled} value={reason} className='w-100 text-center' name="" id="" cols="80" rows="3" placeholder='Especifíque Motivo...'></textarea>
                            </div>
                            <button className='btn btn-primary w-100 mt-2'>
                                Guardar
                            </button>
                        </form>
                    </div>

                </div>

            )
        }


    }
    const renderProducts = () => {
        if (isLoading) {
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
        if (!products || products.length === 0) {
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
                        <th className='column-headers' scope="col">StockGeneral</th>
                        <th className='column-headers' scope="col">UM</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        products.filter(item => {
                            return search.toLowerCase() === "" ? item : item.name.toLowerCase().includes(search) || item.sku.toLowerCase().includes(search) || item.description.toLowerCase().includes(search) || item.color.toLowerCase().includes(search)
                        }).map((product, index) => (
                            <tr onClick={() => { handleRowCLick(product) }} className='product-row' key={product.product_id}>
                                <td className='column-values'>{index + 1}</td>
                                <td className='sticky column-values'>{product.product_id}</td>
                                <td className='sticky-2 column-values'><img className='inventory-product-image rounded' src={`${import.meta.env.VITE_URL_BASE}product/images/${product.image ? product.image : 'sin_imagen.jpg'}`}></img></td>
                                <td className='column-values'>{product.is_variable == 1 ? "SI" : "NO"}</td>
                                <td className='column-values'>{product.sku}</td>
                                <td className='column-values'>{product.name}</td>
                                <td className='column-values'>{product.description}</td>
                                <td className='column-values'>{product.color}</td>
                                <td className='column-values'>{product.general_stock}</td>
                                <td className='column-values'>{product.uom}</td>
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
                <h2 className='fw-bold text-center'>INVENTARIO DE PRODUCTOS</h2>
                <div className='inventory-sub-menu-wrapper'>

                    <Link to={'operations'} type='button' className='btn btn-info add-btn'>
                        <i className="bi bi-arrow-down-up"></i>
                        Operaciones
                    </Link>


                </div>

            </div>
            <input onChange={(e) => { setSearch(e.target.value.toLowerCase()) }} id='search-field' className="form-control form-control-lg my-3" type="text" placeholder="Buscar producto.." aria-label="search product" autoFocus />
            <div id='prouducts-container'>
                {renderProducts()}
            </div>
            <div className='inventory-resum'>
                <span className='fs-3 fw-bold' >Total de productos: <span className='badge bg-warning fs-3'>{productsTotal}</span> </span>
                {
                    user.profile.toLowerCase() === 'administrador' && (
                        <>
                            <span className='fs-3 fw-bold'>Total de costos: <span className='badge bg-info fs-3'>{formatToMoney(costsTotal)}</span> </span>
                            <span className='fs-3 fw-bold'>Retorno estimado: <span className='badge bg-success fs-3'>{formatToMoney(salesTotal)}</span> </span>
                        </>
                    )
                }
            </div>
            <Modal title={'Ajuste de inventario'} showModal={showModal} toggleModal={toggleModal}>
                {rendeModalView()}
            </Modal>
            <Toaster
                position='bottom-right'
            />
        </>

    )


}
export default Inventory