import usePetition from "../../hooks/usePetition"
import '../Products/products.css'
import { useContext, useState } from "react"
import { Link, Navigate } from "react-router-dom"
import { format } from 'date-fns';
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import UserContext from "../../Context/UserContext";
const Customers = () => {
    const { user } = useContext(UserContext)
    if(user.permissions.customers !==1){
        return <Navigate to={'/dashboard'} />
    }
    const [search, setSearch] = useState('')
    const token = localStorage.getItem("token")
    const URL_BASE = import.meta.env.VITE_URL_BASE
    const [data, IsLoading, error, setData] = usePetition('customers');
    const deleteCustomer = (id) => {
        const deleteCustomer = confirm('Desea borrar este Cliente?')
        if (deleteCustomer) {
            axios.delete(`${URL_BASE}customers/${id}/delete`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            })
                .then(response => {
                    console.log(response)
                    const result = data.filter(customer => customer.customer_id != id)
                    setData(result);
                    toast.success(`Cliente ${id} Borrado Exitosamente`)

                })
                .catch(error => {
                    console.log(error)
                    toast.error(`Algo salió mal: ${error.message}`)
                })
        }
    }
    const renderCustomers = () => {
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
            return <span>No hay Clientes para mostrar</span>
        }

        return (
            <table id='products-table' className="table table-hover table-striped text-center align-middle">
                <thead>
                    <tr>
                        <th className='column-headers' scope="col">#</th>
                        <th className='sticky column-headers' scope="col">IdCliente</th>
                        <th className='sticky-2 column-headers' scope="col">Nombres</th>
                        <th className='sticky-2 column-headers' scope="col">Apellidos</th>
                        <th className='column-headers' id='isVarCell' scope="col">Teléfono</th>
                        <th className='column-headers' scope="col">Direccion</th>
                        <th className='column-headers' scope="col">Estado</th>
                        <th className='column-headers' scope="col">Ciudad</th>
                        <th className='column-headers' scope="col">Código postal</th>
                        <th className='column-headers' scope="col">RFC</th>
                        <th className='column-headers' scope="col">Fecha Alta</th>
                        <th className='column-headers' scope="col">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.filter(item => {

                            return search.toLowerCase() === "" ? item : item.first_name.toLowerCase().includes(search) || item.last_name.toLowerCase().includes(search) || item.rfc.toLowerCase().includes(search) || item.state.toLowerCase().includes(search)
                        }).map((customer, index) => (
                            <tr key={customer.customer_id}>
                                <td className='column-values'>{index + 1}</td>
                                <td className='sticky column-values'>{customer.customer_id}</td>
                                <td className='sticky-2 column-values'>{customer.first_name}</td>
                                <td className='column-values'>{customer.last_name}</td>
                                <td className='column-values'>{customer.phone_number}</td>
                                <td className='column-values'>{customer.adress}</td>
                                <td className='column-values'>{customer.state}</td>
                                <td className='column-values'>{customer.city}</td>
                                <td className='column-values'>{customer.zip_code}</td>
                                <td className='column-values'>{customer.rfc}</td>
                                <td className='column-values'>{format(new Date(customer.create_date), 'dd-MM-yyyy HH:mm:ss')}</td>
                                <td className='column-values'>
                                    <div className='d-flex justify-content-center gap-2'>
                                        {
                                            user.profile.toLowerCase() == 'administrador' && (
                                                <>
                                                    <Link to={`${customer.customer_id}/update`} className='btn btn-warning'>Editar</Link>
                                                    <button type='button' onClick={() => { deleteCustomer(customer.customer_id) }} className='btn btn-danger'>Eliminar</button>
                                                </>
                                            )
                                        }

                                    </div>
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
                <h2 className='fw-bold text-center'>CLIENTES</h2>
                <div className='add-btn-wrapper'>
                    <Link to={'new'} type='button' className='btn btn-success add-btn'>
                        <i className="bi bi-plus-circle-fill"></i>
                        Agregar Cliente</Link>
                </div>

            </div>
            <input onChange={(e) => { setSearch(e.target.value.toLowerCase()) }} id='search-field' className="form-control form-control-lg my-3" type="text" placeholder="Buscar cliente.." aria-label="search product" autoFocus />

            <div id='prouducts-container'>
                {renderCustomers()}
            </div>
            <Toaster
                position="bottom-right"
            />
        </>

    )
}

export default Customers