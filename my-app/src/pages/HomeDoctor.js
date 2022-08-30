import React from 'react'
import { BrowserRouter, Redirect, Route } from 'react-router-dom'
import Control from '../components/Doctor/Control';
import Prescription from '../components/Doctor/Prescription';
import SideNav from '../components/Doctor/SideNavDoctor'

function Home() {
    var date1 = new Date((localStorage.getItem("date"))).toString();
    var date2 = new Date().toString();
    if (localStorage.getItem("auth") !== "true" || localStorage.getItem("role") !== "2" || date1 < date2)
        return <Redirect to="/" />
    return (
        <div>
            <BrowserRouter>
                <div className='row'>
                    <div className='col-lg-2'>
                        <SideNav />
                    </div>
                    <div className='col-lg-10'>
                        <Route path='/doctor/prescriptions' component={Prescription} />
                        <Route path='/doctor/controls' component={Control} />
                    </div>
                </div>
            </BrowserRouter>
        </div>
    )
}

export default Home
