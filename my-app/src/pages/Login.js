import React from 'react'
import axios from 'axios'
import { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import hospitalgif from '../images/hospital.gif'
import MessageAlert from '../components/MessageAlert';
import Loader from '../components/Loader';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [redirect, setRedirect] = useState(null);

    const login = async (e) => {
        e.preventDefault();
        if (email === "") document.getElementById("emailSpan").classList.remove("d-none");
        else document.getElementById("emailSpan").classList.add("d-none");
        if (password === "") document.getElementById("passSpan").classList.remove("d-none");
        else document.getElementById("passSpan").classList.add("d-none");
        if (email !== "" && password !== "") {

            const data = {
                Email: email,
                Password: password
            }
            axios.defaults.headers.post["Content-Type"] = "application/json";
            axios.defaults.headers["Access-Control-Allow-Methods"] = "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT";
            axios.defaults.headers["Access-Control-Allow-Origin"] = "*";
            axios.defaults.withCredentials = true;
            setLoading(true);
            await axios.post('https://localhost:44398/auth/login', data)
                .then(response => {
                    localStorage.setItem('role', response.data.resultService.data.roleId);
                    console.log(response);
                    setLoading(false);
                    setMessage(<MessageAlert message={response.data.message} />)
                    messageInterval();
                    setRedirect(response.data.resultService.data.roleId);
                    localStorage.setItem("auth", true);
                    localStorage.setItem("date", response.data.result.data.expiration);
                }).catch(e => {
                    console.log(e);
                    setLoading(false);
                    setMessage(<MessageAlert message={e.response.data.message} />)
                    messageInterval();
                });
        }
    }
    function messageInterval() {
        setTimeout(() => {
            setMessage('');
        }, 5000);
    }
    if (redirect === 1) {
        localStorage.setItem("role", 1);
        return <Redirect from='/' to='/admin/employees' />
    }
    else if (redirect === 2) {
        localStorage.setItem("role", 2);
        return <Redirect from='/' to='/doctor/prescriptions' />
    }
    else if (redirect === 3) {
        localStorage.setItem("role", 3);
        return <Redirect from='/' to='/reception/registry' />
    }
    return (
        <div className="d-flex flex-column">
            {loading ? <Loader /> : ''}
            <div className="container-fluid h-custom">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-md-9 col-lg-6 col-xl-5">
                        <img src={hospitalgif}
                            className="img-fluid img-bxs" alt="Sample image" />
                    </div>
                    <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1" >
                        <form onSubmit={login}>
                            <h2 className='display-5'>Giriş Səhifəsi</h2>
                            <div className="form-outline mb-4">
                                <input type="email" id="emailForLogin" onChange={e => setEmail(e.target.value)} className="form-control form-control-lg"
                                    placeholder="Etibarlı email ünvanı yazın" />
                                <label className="form-label" htmlFor="emailForLogin">Email</label>
                                <span id='emailSpan' className='d-none text-danger'>Email məcburidir</span>
                            </div>

                            <div className="form-outline mb-3">
                                <input type="password" id="password" onChange={e => setPassword(e.target.value)} className="form-control form-control-lg"
                                    placeholder="Şifrəni yazın" />
                                <label className="form-label " htmlFor="password">Şifrə</label>
                                <span id='passSpan' className='d-none text-danger'>Şifrə məcburidir</span>
                            </div>

                            <div className="d-flex justify-content-end align-items-center">
                                <Link to="/forgotpassword" target="_parent" className="text-primary">Şifrəni unutmusuz?</Link>
                            </div>

                            <div className="text-center text-lg-start mt-4 pt-2">
                                <button type="submit" className=" btn btn-primary btn-lg p-25 ">Giriş et</button>
                            </div>
                        </form>
                    </div>
                    <div className='message mt-5'>
                        {message !== null ? message : ''}
                    </div>
                </div>
            </div >
        </div >
    )
}

export default Login;