import React from 'react'
import { BrowserRouter, Redirect, Route } from 'react-router-dom'
import SideNav from '../components/Reception/SideNavReception'
import Registry from '../components/Reception/Registry'
import Patients from '../components/Reception/Patients';
import Details from '../components/Reception/Details';
import Materials from '../components/Reception/Materials';

function Home() {
    var date1 = new Date((localStorage.getItem("date"))).toString();
    var date2 = new Date().toString();
    if (localStorage.getItem("auth") !== "true" || localStorage.getItem("role") !== "3" || date1 < date2)
        return <Redirect to="/" />
    return (
        <div>
            <BrowserRouter>
                <div className='row'>
                    <div className='col-lg-2'>
                        <SideNav />
                    </div>
                    <div className='col-lg-10'>
                        <Route path='/reception/registry' component={Registry} />
                        <Route path='/reception/patients' component={Patients} />
                        <Route path='/reception/patient/details' component={Details} />
                        <Route path='/reception/materials' component={Materials} />
                    </div>
                </div>
            </BrowserRouter>
        </div>
    )
}

export default Home
