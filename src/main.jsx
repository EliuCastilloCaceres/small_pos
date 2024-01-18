import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/App.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './components/Login.jsx'
import Header from './components/Header.jsx'
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

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route path='/' element={<App />}>
          <Route path='orders' element={<Orders/>}/>
          <Route path='orders/:orderId/update' element={<OrderUpdate/>}/>
          <Route path='products' element={<Products/>}/>
          <Route path='products/:productId/update' element={<ProductUpdate/>}/>
          <Route path='products/:productId/update/sizes' element={<ProductSizes/>}/>
          <Route path='products/new' element={<NewProduct/>}/>
          <Route path='providers' element={<Providers/>}/>
          <Route path='providers/new' element={<NewProvider/>}/>
          <Route path='providers/:providerId/update' element={<ProviderUpdate/>}/>
          <Route path='users' element={<Users/>}/>
          <Route path='users/:userId/permissions' element={<UserPermissions/>}/>
          <Route path='users/new' element={<NewUser/>}/>
         </Route>
        <Route path='/login' element={<Login />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
