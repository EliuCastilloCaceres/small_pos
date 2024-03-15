
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import '../../Products/newProduct.css'
import ImageUploader from "../../ImageUploader.jsx";
import BackButton from "../../BackButton.jsx";
import toast, { Toaster } from "react-hot-toast";
import UserContext from "../../../Context/UserContext.jsx";
import { Navigate } from "react-router-dom";
import usePetition from "../../../hooks/usePetition.js";
function Receipt() {
    const { user } = useContext(UserContext)
    if(user.permissions.settings !==1){
        return <Navigate to={'/dashboard'} />
    }
    const [data, isLoading, error] = usePetition('cash-registers/receipt')
    const URL_BASE = import.meta.env.VITE_URL_BASE
    const token = localStorage.getItem("token")
    const [loading, setLoading] = useState(false)
    const [saved, setSaved] = useState(true)
    const [imgSrc, setImgSrc] = useState(`${URL_BASE}receipt/images/sin_imagen.jpg`)
    const [fields, setFields] = useState({
        receiptId:'',
        address: '',
        rfc: '',
    })
 
    useEffect(() => {
        if (data) {
            if (data[0].image) {
                setImgSrc(`${URL_BASE}receipt/images/${data[0].image}`)
            }
            setFields({
                receiptId:data[0].receipt_id,
                address:data[0].address,
                rfc: data[0].rfc
            })
        }
    }, [data])
    const handleChange = (e, fieldName) => {
        setFields({
            ...fields,
            [fieldName]: fieldName = e.target.value 
        })


        setSaved(false)
    }
    const changeImgSrc = (newSrc)=>{
        setImgSrc(newSrc)
    }

    const isSaved = (saved) => {
        setSaved(saved)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const URL_BASE = import.meta.env.VITE_URL_BASE
        setLoading(true)
        axios.put(`${URL_BASE}receipt/update`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        })
            .then(response => {
                setLoading(false)
                setSaved(true)
                //console.log(response)
                toast.success('Ticket Actualizado')
                
            })
            .catch(error => {
                setLoading(false)
                console.log(error)
                toast.error(`Algo salió mal: ${error.response.data.message??error.message}`)

            })
    }
    return (
        <div>
            <BackButton saved={saved} />
            <div className={`new-product-container ${loading && 'loading'} `}>
                <div className={`spinner-border spinner ${!loading && 'hide'}`} role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <h2 className='fw-bold text-center my-3'>Ticket de Venta</h2>

                <form onSubmit={handleSubmit} className="row g-3 align-items-center fw-bold" >
                    
                    <div className="col-12">
                    <ImageUploader changeImgSrc={changeImgSrc} isSaved={isSaved} imgSrc={imgSrc} />

                    </div>
                    <div hidden className="col-md-1">
                        <label className="form-label" htmlFor="address">Id</label>
                        <input onChange={(e) => { handleChange(e, 'receiptId') }} value={fields.receiptId} readOnly type="text" name="receiptId" className="form-control" />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label" htmlFor="address">Dirección</label>
                        <input onChange={(e) => { handleChange(e, 'address') }} value={fields.address} type="text" name="address" className="form-control" />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label" htmlFor="flexCheckDefault">RFC</label>
                        <input onChange={(e) => { handleChange(e, 'rfc') }} value={fields.rfc} type="text" name="rfc" className="form-control" required/>
                    </div>
                   
                    <div className="col-12 my-5 text-center">
                        <button type="submit" className={`btn btn-primary ${loading || saved && 'disabled'}`}>Guardar</button>
                    </div>

                </form>

            </div>
                    <Toaster
                        position="bottom-right"
                    />
        </div>
    )
}

export default Receipt