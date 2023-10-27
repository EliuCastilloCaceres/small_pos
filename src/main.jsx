import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/App.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './components/Login.jsx'
import Header from './components/Header.jsx'
import Orders from './components/Orders.jsx'
import OrderUpdate from './components/OrderUpdate.jsx'
import Products from './components/Products.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route path='/' element={<App />}>
          <Route path='orders' element={<Orders/>}/>
          <Route path='orders/:orderId/update' element={<OrderUpdate/>}/>
          <Route path='products' element={<Products/>}/>
         </Route>
        <Route path='/login' element={<Login />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
