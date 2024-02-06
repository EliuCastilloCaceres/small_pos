import usePetition from "../../hooks/usePetition"
import '../Products/products.css'
import { useContext, useState } from "react"
import { Link, Navigate } from "react-router-dom"
import { format } from 'date-fns';
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import UserContext from "../../Context/UserContext";
const Users = () => {
    const { user:contextUser } = useContext(UserContext)
    if(contextUser.permissions.users !==1){
        return <Navigate to={'/dashboard'} />
    }
    const [search, setSearch] = useState('')
    const token = localStorage.getItem("token")
    const URL_BASE = import.meta.env.VITE_URL_BASE
    const [data, IsLoading, error, setData] = usePetition('users');
    const deleteUser = (id) => {
        const deleteUser = confirm('Desea borrar este Usuario?')
        if (deleteUser) {
            axios.delete(`${URL_BASE}users/${id}/delete`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            })
                .then(response => {
                    console.log(response)
                    const result = data.filter(user => user.user_id != id)
                    setData(result);
                    toast.success(`Usuario ${id} borrado`)

                })
                .catch(error => {
                    console.log(error)
                    toast.error(`Algo salió mal: ${error.message}`)
                })
        }
    }
    const renderUsers = () => {
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
            return <span>No hay Usuarios para mostrar</span>
        }

        return (
            <table id='products-table' className="table table-hover table-striped text-center align-middle">
                <thead>
                    <tr>
                        <th className='column-headers' scope="col">#</th>
                        <th className='sticky column-headers' scope="col">IdUsuario</th>
                        <th className='sticky-2 column-headers' scope="col">Nombres</th>
                        <th className='column-headers' id='isVarCell' scope="col">Apellidos</th>
                        <th className='column-headers' scope="col">Usuario</th>
                        <th className='column-headers' scope="col">Perfil</th>
                        <th className='column-headers' scope="col">Puesto</th>
                        <th className='column-headers' scope="col">Dirección</th>
                        <th className='column-headers' scope="col">Código Postal</th>
                        <th className='column-headers' scope="col">Estado</th>
                        <th className='column-headers' scope="col">Ciudad</th>
                        <th className='column-headers' scope="col">Teléfono</th>
                        <th className='column-headers' scope="col">Fecha Alta</th>
                        <th className='column-headers' scope="col">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.filter(item => {
                            return search.toLowerCase() === "" ? item : item.first_name.toLowerCase().includes(search) || item.last_name.toLowerCase().includes(search) || item.user_name.toLowerCase().includes(search) || item.profile.toLowerCase().includes(search) || item.position.toLowerCase().includes(search)
                        }).map((user, index) => (
                            <tr key={user.user_id}>
                                <td className='column-values'>{index + 1}</td>
                                <td className='sticky column-values'>{user.user_id}</td>
                                <td className='sticky-2 column-values'>{user.first_name}</td>
                                <td className='column-values'>{user.last_name}</td>
                                <td className='column-values'>{user.user_name}</td>
                                <td className='column-values'>{user.profile}</td>
                                <td className='column-values'>{user.position}</td>
                                <td className='column-values'>{user.adress}</td>
                                <td className='column-values'>{user.zip_code}</td>
                                <td className='column-values'>{user.state}</td>
                                <td className='column-values'>{user.city}</td>
                                <td className='column-values'>{user.phone_number}</td>
                                <td className='column-values'>{format(new Date(user.create_date), 'dd-MM-yyyy HH:mm:ss')}</td>
                                <td className='column-values'>
                                    {
                                        contextUser.profile.toLowerCase() === 'administrador' && (
                                            <div className='d-flex justify-content-center gap-2'>
                                                <Link to={`${user.user_id}/permissions`} className='btn btn-info'>Ver Permisos</Link>
                                                <Link to={`${user.user_id}/update`} className='btn btn-warning'>Editar</Link>
                                                <button type='button' onClick={() => { deleteUser(user.user_id) }} className='btn btn-danger'>Eliminar</button>
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
                <h2 className='fw-bold text-center'>USUARIOS</h2>
                <div className='add-btn-wrapper'>
                    <Link to={'new'} type='button' className='btn btn-success add-btn'>
                        <i className="bi bi-plus-circle-fill"></i>
                        Agregar Usuario</Link>
                </div>

            </div>
            <input onChange={(e) => { setSearch(e.target.value.toLowerCase()) }} id='search-field' className="form-control form-control-lg my-3" type="text" placeholder="Buscar usuario.." aria-label="search product" autoFocus />

            <div id='prouducts-container'>
                {renderUsers()}
            </div>

            <Toaster
                position="bottom-right"
            />
        </>

    )
}

export default Users