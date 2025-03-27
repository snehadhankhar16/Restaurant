import React from 'react'
import {BrowserRouter,Route,Routes} from "react-router-dom"
import Menus from './Common/Pages/Menus'
import Login from './Common/Pages/Login'
import Cart from './Common/Pages/Cart'
import AllRestaurants from './Common/Pages/AllRestaurants'
import Owners from './Owner/Pages/Owners'
import Orders from './Owner/Pages/Orders'
import Superadmin from './Superadmin/Pages/Superadmin'
const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
            <Route path='/superadmin' element={<Superadmin/>}></Route>

            <Route path='/' element={<AllRestaurants/>}></Route>
            <Route path='/Menus' element={<Menus/>}></Route>
            <Route path='/Cart' element={<Cart/>}></Route>
            <Route path='/Login' element={<Login/>}></Route>

            <Route path='/owner' element={<Owners/>}></Route>
            <Route path='/Orders' element={<Orders/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}
export default App