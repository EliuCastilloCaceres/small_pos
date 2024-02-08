import axios from "axios"
import Modal from "../../Modal"
import { useEffect, useState } from "react"
import './productsSearcher.css'

function ProductsSearcher({ data, dataCopy, setDataCopy, addToCart, selectedProduct, clickBand }) {
    const URL_BASE = import.meta.env.VITE_URL_BASE
    const token = localStorage.getItem("token")
    const [search, setSearch] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [sizes, setSizes] = useState()
    const [variants, setVariants] = useState()
    useEffect(()=>{
        const getAllSizes = async () => {
            try {
                const sizes = await axios.get(`${URL_BASE}products/all/sizes`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                })
                console.log(sizes.data.data)
                 setSizes(sizes.data.data)
            } catch (e) {
                console.log(e)
            }
        }
        getAllSizes()
    },[])
    useEffect(() => {
        if (selectedProduct) {
            validateProductSelection(selectedProduct)
        }
    }, [clickBand])

    useEffect(() => {
        if (dataCopy) {
            const result = data.filter(product => {
                return search.toLowerCase() === "" ? product : product.sku.toLowerCase().includes(search) || product.name.toLowerCase().includes(search) || product.product_id.toString().includes(search)
            })

            setDataCopy(result)
        }
    }, [search])
    const toggleModal = () => {
        setShowModal(!showModal)
    }
    const getProductSizes = async (productId) => {
        try {
            // const sizes = await axios.get(`${URL_BASE}products/${productId}/sizes`, {
            //     headers: {
            //         'Authorization': `Bearer ${token}`,
            //     }
            // })
            const result = await sizes.filter(s=>s.product_id === productId)
            return result
        } catch (e) {
            console.log(e)
        }
    }
   
    const IsVariable = (product) => {
        if (product.is_variable === 1) {
           return true
        }
        return false
    }
    const findSize = async (sku)=>{
        const result = await sizes.filter(s=> s.sku.toLowerCase() === sku)
        return result
    }
    const handleSizeSelection = async (size)=>{
        const result = await data.filter(product => product.product_id === size.product_id)
        result[0].size = size
        console.log(result)
        addToCart(result[0])
        setSearch('')
    }
    const renderVariants = () => {
        if (!variants || variants.length === 0) {
            return <span>No hay variantes para este producto</span>
        }
        return (

            <div className="variants-wrapper">
                {
                    variants.map(size => (
                        <div onClick={()=>{handleSizeSelection(size)}} key={size.size_id} className={`variant-container ${size.stock === 0?'disabled':''}`}>
                            <span >{size.size}</span>
                            <span className="size-stock-badge badge bg-warning">{size.stock}</span>
                            <span className=" badge bg-info fs-5">{size.sku}</span>
                        </div>
                    ))
                }
            </div>


        )
    }
    const validateProductSelection = async (product) =>{
        if(IsVariable(product)){
            const sizes = await getProductSizes(product.product_id)
            console.log(sizes)
            const sortedSizes = sizes.sort((a,b)=>{
                if(a.size<b.size){
                    return -1
                }
                if(a.size>b.size){
                    return 1
                }
                return 0
            })
            setVariants(sortedSizes)
            toggleModal()
            setSearch('')
        }else{
            addToCart(product)
            setSearch('')
        }

    }
    const handleSearch = async (e) => {
        e.preventDefault()
        const result = data.filter(product => {
            return search.toLowerCase() === "" ? product : product.sku.toLowerCase() === search
        })
        if (result.length > 0 && result.length < 2) {// 1 register match
            validateProductSelection(result[0])
        }
        else if (result.length === 0) {// no product found
            const productVariant = await findSize(search)
            console.log('the prodV: ',productVariant)
            if(productVariant.length>0 && productVariant.length<2){
                handleSizeSelection(productVariant[0])
            }
   
            
        }

    }
    return (
        <>
            <form onSubmit={handleSearch} >
                <input onChange={(e) => { setSearch(e.target.value.toLowerCase()) }} value={search} className="form-control" type="text" />
            </form>

            <Modal title='Seleccionar Variante' showModal={showModal} toggleModal={toggleModal}>
                {
                    renderVariants()
                }
            </Modal>
        </>
    )
}

export default ProductsSearcher