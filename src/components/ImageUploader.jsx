import { useState } from "react";
function ImageUploader({isSaved, changeImgSrc, imgSrc}) {
    //const [image, setImage] = useState(defaultSrc?defaultSrc:`${import.meta.env.VITE_URL_BASE}product/images/sin_imagen.jpg`);

    const handleImageChange = (e) => {
        isSaved(false)
        const file = e.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = () => {
                console.log(reader.result)
                changeImgSrc(reader.result);
            };

            reader.readAsDataURL(file);
        } else {
            changeImgSrc(`${import.meta.env.VITE_URL_BASE}product/images/sin_imagen.jpg`);
        }
    };
    return (
        <>
            <div className="d-flex align-items-center">
                <div>
                   {imgSrc &&<img style={{ width: '200px', height: 'auto', border: 'solid 1px black' }} className="product-image rounded" src={imgSrc} alt="Vista Previa" />} 
                </div>
                <div className="col-md-10 ms-2">
                    <label className="form-label" htmlFor="image">imágen</label>
                    <input className="form-control" type="file" accept="image/*" name="image" onChange={handleImageChange} />
                </div>
            </div>
        </>

    );
}

export default ImageUploader