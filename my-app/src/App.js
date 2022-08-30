import React from 'react'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Home from './pages/Home'
import HomeReception from './pages/HomeReception'
import HomeDoctor from './pages/HomeDoctor'
import { BrowserRouter, Route } from 'react-router-dom'


export default function App() {

  return (
    <div className='vh-100 d-flex  justify-content-lg-center align-items-lg-center'>
      <BrowserRouter>
        <Route path='/' exact component={Login} />
        <Route path='/forgotpassword' component={ForgotPassword} />
        <Route path='/resetpassword' component={ResetPassword} />
        <Route path='/admin/' component={Home} />
        <Route path='/reception/' component={HomeReception} />
        <Route path='/doctor/' component={HomeDoctor} />
      </BrowserRouter>
    </div>
  )
}
