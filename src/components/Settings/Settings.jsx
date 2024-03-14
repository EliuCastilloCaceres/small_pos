import { Navigate, useNavigate } from 'react-router-dom'
import Grid from '../../Grid'
import GridCard from '../../GridCard'
import { useContext, useEffect } from 'react'
import UserContext from '../../Context/UserContext'
function Settings() {
    const { user } = useContext(UserContext)
    const navigation = useNavigate()
    if (user.permissions.settings !== 1) {
        return <Navigate to={'/dashboard'} />
    }


    const navigateTo = (route) => {
        navigation(route)
    }
    return (
        <>
            <Grid>
                <GridCard onClick={() => { navigateTo('cashregisters') }}>
                    <i className='bi bi-pc-display-horizontal fs-1'></i>
                    <span>Cajas Registradoras</span>
                </GridCard>
                <GridCard onClick={() => { navigateTo('receipt') }}>
                    <i className='bi bi-receipt fs-1'></i>
                    <span>Ticket</span>
                </GridCard>
            </Grid>

        </>
    )
}
export default Settings