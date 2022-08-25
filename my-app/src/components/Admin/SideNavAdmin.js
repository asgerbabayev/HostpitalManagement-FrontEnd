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
                            to="/admin/home"
                            className="list-group-item list-group-item-action py-2 ripple"
                            aria-current="true">
                            <i className="fa-solid fa-home me-3"></i><span>Ana Səhifə</span>
                        </Link>
                        <Link to="/admin/employees" className="list-group-item list-group-item-action py-2 ripple">
                            <i className="fa-solid fa-users me-3"></i><span>İşçilər</span>
                        </Link>
                        <Link to="/admin/patients" className="list-group-item list-group-item-action py-2 ripple">
                            <i className="fa-solid fa-bed me-3"></i><span>Xəstələr</span>
                        </Link>
                        <Link to="/admin/rooms" className="list-group-item list-group-item-action py-2 ripple"
                        ><i className="fa-brands fa-intercom me-3"></i><span>Otaqlar</span></Link>
                        <Link to="#" className="list-group-item list-group-item-action py-2 ripple"
                        ><i className="fas fa-chart-line fa-fw me-3"></i><span>Materiallar</span></Link>
                        <Link to="/admin/stock" className="list-group-item list-group-item-action py-2 ripple"
                        ><i className="fa-solid fa-bag-shopping me-3"></i><span>Ambar</span></Link>
                        <Link to="/admin/medicines" className="list-group-item list-group-item-action py-2 ripple"
                        ><i className="fa-solid fa-capsules me-3"></i><span>Dərmanlar</span></Link>
                        {/* <Link href="#" className="list-group-item list-group-item-action py-2 ripple"
                        ><i className="fa-solid fa-gear me-3"></i><span>Tənzimləmələr</span></Link> */}
                        <Link to="#" onClick={logout} className="list-group-item list-group-item-action py-2 ripple"
                        ><i className="fa-solid fa-arrow-right-from-bracket me-3"></i><span>Çıxış et</span></Link>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default SideNav;
