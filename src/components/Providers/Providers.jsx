import usePetition from "../../hooks/usePetition"
import '../Products/products.css'
import { useContext, useState } from "react"
import { Link, Navigate } from "react-router-dom"
import { format } from 'date-fns';
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import UserContext from "../../Context/UserContext";
const Providers = () => {
    const { user } = useContext(UserContext)
    if(user.permissions.providers !==1){
        return <Navigate to={'/dashboard'} />
    }
    const token = localStorage.getItem("token")
    const URL_BASE = import.meta.env.VITE_URL_BASE
    const [search, setSearch] = useState('')
    const [data, IsLoading, error, setData] = usePetition('providers');
    const deleteProvider = (id) => {
        const deleteProvider = confirm('Desea borrar este Proveedor?')
        if (deleteProvider) {
            axios.delete(`${URL_BASE}providers/delete/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            })
                .then(response => {
                    //console.log(response)
                    const result = data.filter(provider => provider.provider_id != id)
                    setData(result);
                    toast.success(`Proveedor ${id} borrado`)

                })
                .catch(error => {
                    console.log(error)
                    toast.error(`Algo salió mal: ${error.message}`)

                })
        }
    }
    const renderProviders = () => {
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
            return <span>No hay Proveedores para mostrar</span>
        }

        return (
            <table id='products-table' className="table table-hover table-striped text-center align-middle">
                <thead>
                    <tr>
                        <th className='column-headers' scope="col">#</th>
                        <th className='sticky column-headers' scope="col">IdProveedor</th>
                        <th className='sticky-2 column-headers' scope="col">Nombre</th>
                        <th className='column-headers' id='isVarCell' scope="col">Teléfono</th>
                        <th className='column-headers' scope="col">Direccion</th>
                        <th className='column-headers' scope="col">Estado</th>
                        <th className='column-headers' scope="col">Ciudad</th>
                        <th className='column-headers' scope="col">Código postal</th>
                        <th className='column-headers' scope="col">RFC</th>
                        <th className='column-headers' scope="col">Fecha Alta</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.filter(item => {
                            return search.toLowerCase() === "" ? item : item.name.toLowerCase().includes(search) || item.adress.toLowerCase().includes(search) || item.state.toLowerCase().includes(search) || item.city.toLowerCase().includes(search)
                        }).map((provider, index) => (
                            <tr hidden={provider.name == '-' ? true : false} key={provider.provider_id}>
                                <td className='column-values'>{index + 1}</td>
                                <td className='sticky column-values'>{provider.provider_id}</td>
                                <td className='sticky-2 column-values'>{provider.name}</td>
                                <td className='column-values'>{provider.phone_number}</td>
                                <td className='column-values'>{provider.adress}</td>
                                <td className='column-values'>{provider.state}</td>
                                <td className='column-values'>{provider.city}</td>
                                <td className='column-values'>{provider.zip_code}</td>
                                <td className='column-values'>{provider.rfc}</td>
                                <td className='column-values'>{format(new Date(provider.create_date), 'dd-MM-yyyy HH:mm:ss')}</td>
                                <td className='column-values'>
                                    {
                                        user.profile.toLowerCase() == 'administrador' && (
                                            <div className='d-flex justify-content-center gap-2'>
                                                <Link to={`${provider.provider_id}/update`} className='btn btn-warning'>Editar</Link>
                                                <button type='button' onClick={() => { deleteProvider(provider.provider_id) }} className='btn btn-danger'>Eliminar</button>
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
                <h2 className='fw-bold text-center'>PROVEEDORES</h2>
                <div className='add-btn-wrapper'>
                    <Link to={'new'} type='button' className='btn btn-success add-btn'>
                        <i className="bi bi-plus-circle-fill"></i>
                        Agregar Proveedor</Link>
                </div>

            </div>
            <input onChange={(e) => { setSearch(e.target.value.toLowerCase()) }} id='search-field' className="form-control form-control-lg my-3" type="text" placeholder="Buscar proveedor.." aria-label="search product" autoFocus />

            <div id='prouducts-container'>
                {renderProviders()}
            </div>
            <Toaster
                position="bottom-right"
            />
        </>

    )
}

export default Providers