
import { useEffect, useState } from "react"
import Swal from "sweetalert2"

function ProductsSearcher({ dt, dtCopy, setDtCopy, handleProductSelection,handleSizeSelection, search, setSearch, sizes}) {


    useEffect(() => {
        if (dtCopy) {
            const result = dt.filter(product => {
                return search.toLowerCase() === "" ? product : product.sku.toLowerCase().includes(search) || product.name.toLowerCase().includes(search) || product.product_id.toString().includes(search)
            })

            setDtCopy(result)
        }
    }, [search])
    
    

    
    const findSize = async (sku) => {
        const result = await sizes.filter(s => s.sku.toLowerCase() === sku)
        return result
    }
    
    const handleSearch = async (e) => {
        e.preventDefault()
        const result = dt.filter(product => {
            return search.toLowerCase() === "" ? product : product.sku.toLowerCase() === search
        })
        if (result.length > 0 && result.length < 2) {// 1 register match
            handleProductSelection(result[0])
        }
        else if (result.length === 0) {// no product found
            const productVariant = await findSize(search)
            console.log('the prodV: ', productVariant)
            if (productVariant.length > 0 && productVariant.length < 2) {
                handleSizeSelection(productVariant[0])
            } else if (productVariant.length === 0) {
                Swal.fire({
                    title: "No existe producto",
                    text: `Producto ${search}, no encontrado`,
                    icon: "error"
                });
                setSearch('')
            }


        }

    }
    return (
        <>
            <form onSubmit={handleSearch} >
                <input id="search-input" tabIndex={0} onChange={(e) => { setSearch(e.target.value.toLowerCase()) }} value={search} className="form-control" type="text" autoFocus placeholder="Buscar Producto..." 
                />
            </form>
        </>
    )
}

export default ProductsSearcher