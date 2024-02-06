import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/App.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './components/Login.jsx'
import Orders from './components/Orders/Orders.jsx'
import OrderUpdate from './components/Orders/OrderUpdate.jsx'
import Products from './components/Products/Products.jsx'
import ProductUpdate from './components/Products/ProductUpdate.jsx'
import NewProduct from './components/Products/NewProduct.jsx'
import ProductSizes from './components/Products/ProductSizes.jsx'
import Providers from './components/Providers/Providers.jsx'
import NewProvider from './components/Providers/NewProvider.jsx'
import ProviderUpdate from './components/Providers/ProviderUpdate.jsx'
import Users from './components/Users/Users.jsx'
import NewUser from './components/Users/NewUser.jsx'
import UserPermissions from './components/Users/UserPermissions.jsx'
import Customers from './components/Customers/Customers.jsx'
import NewCustomer from './components/Customers/NewCustomer.jsx'
import CustomerUpdate from './components/Customers/CustomerUpdate.jsx'
import UserUpdate from './components/Users/UserUpdate.jsx'
import ProductBarCode from './components/Products/productBarCode.jsx'
import Settings from './components/Settings/Settings.jsx'
import CashRegisterList from './components/Settings/CashRegister/CashRegisterList.jsx'
import { UserContextProvider } from './Context/UserContext.jsx'
import OpenCashReg from './components/Pos/OpenCashReg.jsx'
import { CashRegContextProvider } from './Context/CashRegContext.jsx'
import Pos from './components/Pos/Pos.jsx'
import Logout from './components/Logout.jsx'
import Dashboard from './components/Dashboard/Dashboard.jsx'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<App />}>
              <Route path='open-cash-register' element={<OpenCashReg />} />
              <Route path='pos' element={<Pos/>} />
              <Route path='dashboard' element={<Dashboard/>} />
              <Route path='settings' element={<Settings />} />
              <Route path='settings/cashregisters' element={<CashRegisterList />} />
              <Route path='orders' element={<Orders />} />
              <Route path='orders/:orderId/update' element={<OrderUpdate />} />
              <Route path='products' element={<Products />} />
              <Route path='products/:productId/update' element={<ProductUpdate />} />
              <Route path='products/:productId/update/sizes' element={<ProductSizes />} />
              <Route path='products/new' element={<NewProduct />} />
              <Route path='providers' element={<Providers />} />
              <Route path='providers/new' element={<NewProvider />} />
              <Route path='providers/:providerId/update' element={<ProviderUpdate />} />
              <Route path='users' element={<Users />} />
              <Route path='users/:userId/permissions' element={<UserPermissions />} />
              <Route path='users/new' element={<NewUser />} />
              <Route path='users/:userId/update' element={<UserUpdate />} />
              <Route path='customers' element={<Customers />} />
              <Route path='customers/new' element={<NewCustomer />} />
              <Route path='customers/:customerId/update' element={<CustomerUpdate />} />
            </Route>
            <Route path='/login' element={<Login />} />
            <Route path='/logout' element={<Logout />} />
            <Route path='/products/barcode/:sku/:qty' element={<ProductBarCode />} />
          </Routes>
        </BrowserRouter>
    </UserContextProvider>
  </React.StrictMode>,
)
