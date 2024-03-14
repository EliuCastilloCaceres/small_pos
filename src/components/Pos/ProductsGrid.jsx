import { useEffect, useState } from "react";
import Grid from "../../Grid";
import GridCard from "../../GridCard";
import usePetition from "../../hooks/usePetition"
import './productsGrid.css'
import Sizes from "./Sizes";
function ProductsGrid({ setDt, setDtCopy, dtCopy,effectBand,toggleModal,variableProduct,handleSizeSelection, showModal, handleProductSelection, setSizes, sizes}) {
    const URL_BASE = import.meta.env.VITE_URL_BASE
    const [data, isLoading, error] = usePetition('products');
    useEffect(() => {
        if (data && data.length > 0) {
            setDt(data)
            setDtCopy(data)
        }
    }, [data])
   

    const renderProducts = () => {
        if (isLoading) {
            return <span>Cargando...</span>
        }
        if (error) {
            return <span>Error: {error}</span>
        }
        if (!dtCopy || dtCopy.length === 0) {
            return <span>No Hay Productos para mostrar</span>
        }

        return (
            <Grid>
                {
                    dtCopy.map(product => (
                        <GridCard key={product.product_id}>
                            <div className='product-info-wrapper' onClick={() => { handleProductSelection(product) }}>
                                <div className='image-container'>
                                    <img src={`${URL_BASE}product/images/${product.image ? product.image : 'sin_imagen.jpg'}`} alt="product-image" />
                                </div>
                                <div className='title-container'>
                                    <span className='badge bg-info fs-5'>{product.sku}</span>
                                    <span>{product.name}</span>
                                </div>
                                <span className='stock-badge badge rounded-pill text-bg-warning'>
                                    {product.general_stock}
                                </span>
                            </div>
                        </GridCard>
                    ))
                }
            </Grid>
        )

    }
    return (
        <>
            {renderProducts()}
            <Sizes 
            product={variableProduct} 
            effectBand={effectBand} 
            products={data} 
            showModal={showModal}
            toggleModal={toggleModal}
            setSizes={setSizes}
            handleSizeSelection={handleSizeSelection}
            sizes={sizes}
             />
        </>
    )
}

export default ProductsGrid