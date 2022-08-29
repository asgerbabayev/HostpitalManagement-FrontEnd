import axios from 'axios';
import React, { useState } from 'react'
import { Link, Redirect } from 'react-router-dom';
import Loader from '../Loader';

function SideNav() {
    const [loading, setLoading] = useState(false);
    const [redirect, setRedirect] = useState(null);
    const logout = async () => {
        axios.defaults.headers.post["Content-Type"] = "application/json";
        axios.defaults.headers["Access-Control-Allow-Methods"] = "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT";
        axios.defaults.headers["Access-Control-Allow-Origin"] = "*";
        axios.defaults.withCredentials = true;
        setLoading(true);
        localStorage.setItem("role", "");
        localStorage.setItem("auth", "false");
        localStorage.setItem("date", "");
        await axios.post('https://localhost:44398/auth/logout')
            .then(res => window.location.reload());
        setLoading(false);
        setRedirect(true);
    }

    if (redirect)
        return <Redirect to='/' />


    return (
        <div>
            {loading ? <Loader /> : ''}
            <nav id="sidebarMenu" className="collapse  d-lg-block sidebar collapse bg-white">
                <div className="position-sticky">
                    <div className='d-flex justify-content-center mb-5'>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Flag_for_hospital_ship_of_the_Regia_Marina.svg/1200px-Flag_for_hospital_ship_of_the_Regia_Marina.svg.png" width='100' alt="" />
                    </div>
                    <div className="list-group list-group-flush mx-3 mt-4">
                        <Link
                            to="/reception/registry"
                            className="list-group-item list-group-item-action py-2 ripple"
                            aria-current="true">
                            <i className="fa-solid fa-home me-3"></i><span>Qeydiyyatlar</span>
                        </Link>
                        <Link to="/reception/patients" className="list-group-item list-group-item-action py-2 ripple">
                            <i className="fa-solid fa-bed me-3"></i><span>Xəstələr</span>
                        </Link>
                        <Link to="/reception/materials" className="list-group-item list-group-item-action py-2 ripple"
                        ><i className="fas fa-chart-line fa-fw me-3"></i><span>T. Ləvazimatlar</span></Link>
                        <Link to="#" onClick={logout} className="list-group-item list-group-item-action py-2 ripple"
                        ><i className="fa-solid fa-arrow-right-from-bracket me-3"></i><span>Çıxış et</span></Link>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default SideNav;
