import BwipJs from "bwip-js"
import './productBarCode.css'
import { useContext, useEffect } from "react"
import { Navigate, useParams } from "react-router-dom"
import BackButton from "../BackButton"
import UserContext from "../../Context/UserContext"
function ProductBarCode() {
    const { user } = useContext(UserContext)
    if(user.permissions.products !==1){
        return <Navigate to={'/dashboard'} />
    }
    const { sku } = useParams()
    const { qty } = useParams()
    useEffect(() => {
        const generarCodigosDeBarras = () => {
            for (let index = 0; index < qty; index++) {
                const canvasId = `mycanvas-${index}`;
                try {
                    // Generar el código de barras para cada canvas
                    BwipJs.toCanvas(canvasId, {
                        bcid: 'code128',       // Barcode type
                        text: sku,             // Text to encode
                        scale: 3,              // 3x scaling factor
                        height: 10,            // Bar height, in millimeters
                        includetext: true,     // Show human-readable text
                        textxalign: 'center',  // Always good to set this
                    });
                } catch (error) {
                    console.error('Error al generar el código de barras:', error);
                }
            }
        };

        generarCodigosDeBarras();
        handlePrint()
    }, [sku, qty]);
    const handlePrint = () => {
        // Ocultar los elementos que no deseas imprimir
        const elementosNoImprimir = document.querySelectorAll('.hide-to-print');
        elementosNoImprimir.forEach(elemento => {
            elemento.style.display = 'none';
        });

        window.print()

        elementosNoImprimir.forEach(elemento => {
            elemento.style.display = '';
        });
    }
    const rendercodesQty = () => {
        const barcodes = [];
        for (let index = 0; index < qty; index++) {
            const canvasId = `mycanvas-${index}`;
            barcodes.push(
                <div className="bar-code" key={index}>
                    <canvas id={canvasId}></canvas>
                </div>
            );
        }
        return barcodes;
    }
    return (
        <>
            <BackButton saved={true} />
            <div className="d-flex">
                <div>
                {rendercodesQty()}
                </div>
                <div className="mx-5">
                <button onClick={() => { handlePrint() }} className="btn btn-primary hide-to-print btn-lg">
                    Imprimir
                </button>
                </div>
                
            </div>

        </>
    )

}

export default ProductBarCode