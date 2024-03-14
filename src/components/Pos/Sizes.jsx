import { useEffect, useState } from "react"
import Modal from "../../Modal"
import usePetition from "../../hooks/usePetition"
import './sizes.css'
function Sizes ({product, effectBand,showModal, toggleModal,handleSizeSelection ,setSizes, sizes}){
    const[data] = usePetition('products/all/sizes')
    const [variants, setVariants] = useState()

    useEffect(()=>{
        if(data && data.length>0){
            setSizes(data)
        }
        
    },[data])
 
    useEffect(()=>{
        const getVariants = async ()=>{
            const sizes = await getProductSizes(product.product_id)
            //console.log(sizes)
            const sortedSizes = sizes.sort((a, b) => {
                if (a.size < b.size) {
                    return -1
                }
                if (a.size > b.size) {
                    return 1
                }
                return 0
            })
            setVariants(sortedSizes)
            toggleModal()
        }
        if(product){
            getVariants()

        }
        
    },[effectBand])
    
    const getProductSizes = async (productId) => {
        try {
            // const sizes = await axios.get(`${URL_BASE}products/${productId}/sizes`, {
            //     headers: {
            //         'Authorization': `Bearer ${token}`,
            //     }
            // })
            const result = await sizes.filter(s => s.product_id === productId)
            return result
        } catch (e) {
            console.log(e)
        }
    }
    const handleSelectedSize=(size)=>{
        const s = {... size}
        handleSizeSelection(s)
        toggleModal()
    }
    const renderVariants = () => {
        if (!variants || variants.length === 0) {
            return <span>No hay variantes para este producto</span>
        }
        return (

            <div className="variants-wrapper">
                {
                    variants.map(size => (
                        <div onClick={() => { handleSelectedSize(size) }} key={size.size_id} className={`variant-container`}>
                            <span >{size.size}</span>
                            <span className="size-stock-badge badge bg-warning">{size.stock}</span>
                            <span className=" badge bg-info fs-5">{size.sku}</span>
                        </div>
                    ))
                }
            </div>


        )
    }
    return(
        <>
            <Modal title='Seleccionar Variante' showModal={showModal} toggleModal={toggleModal}>
                {
                    renderVariants()
                }
            </Modal>
        </>
    )
}

export default Sizes