import { BrowserRouter, Redirect, Route } from 'react-router-dom'
import SideNav from '../components/Admin/SideNavAdmin'
import Statistics from '../components/Admin/Statistics'
import Employees from '../components/Admin/Employees'
import Patients from '../components/Admin/Patients'
import Rooms from '../components/Admin/Rooms'
import Medicines from '../components/Admin/Medicines'
import Stock from '../components/Admin/Stock'
import React from 'react'

function Home() {
    var date1 = new Date((localStorage.getItem("date"))).toString();
    var date2 = new Date().toString();
    if (localStorage.getItem("auth") !== "true" || localStorage.getItem("role") !== "1" || date1 < date2)
        return <Redirect to="/" />
    return (
        <div>
            <BrowserRouter>
                <div className='row'>
                    <div className='col-lg-2'>
                        <SideNav />
                    </div>
                    <div className='col-lg-10'>
                        <Route path='/admin/home' exact component={Statistics} />
                        <Route path='/admin/employees' component={Employees} />
                        <Route path='/admin/patients' component={Patients} />
                        <Route path='/admin/rooms' component={Rooms} />
                        <Route path='/admin/medicines' component={Medicines} />
                        <Route path='/admin/stock' component={Stock} />
                    </div>
                </div>
            </BrowserRouter>
        </div>
    )
}

export default Home
