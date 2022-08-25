import axios from 'axios'

import React, { useState, useEffect } from 'react'
import MessageAlert from '../components/MessageAlert';
import Loader from '../components/Loader';

const ResetPassword = () => {

    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    function Check() {
        let span = document.querySelector("span");
        if (newPassword !== "" && newPassword === repeatPassword) {
            span.classList.add("d-none");
            return true;
        }
        else {
            span.classList.remove("d-none");
            return false;
        }
    }
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        setEmail(urlParams.get('email'))
    })



    async function Reset(e) {
        e.preventDefault();
        if (Check()) {
            axios.defaults.headers.post["Content-Type"] = "application/json";
            axios.defaults.headers["Access-Control-Allow-Methods"] = "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT";
            axios.defaults.headers["Access-Control-Allow-Origin"] = "*";
            axios.defaults.withCredentials = true;
            setLoading(true);
            await axios.post(`https://localhost:44398/auth/resetpassword/?email=${email}&password=${newPassword}`)
                .then(response => {
                    setLoading(false);
                    setMessage(<MessageAlert message={response.data.message} />)
                    messageInterval();
                }).catch(e => {
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

    return (
        <div  className='d-flex flex-column justify-content-lg-center align-items-lg-center'>
            {loading ? <Loader /> : ''}
            <div className='mb-3 w-100 d-flex flex-column justify-content-center'>
                <h3 className='text-center'>Şifrə yeniləmə formu</h3>
                <h5 className='text-center mt-2 text-primary'>Yeni şifrənizi daxil edin</h5>
            </div>
            <form onSubmit={Reset}>
                <div className="form-outline mb-4 w-400">
                    <input type="password" id="newpassword" onChange={e => setNewPassword(e.target.value)} className="form-control form-control-lg inputShadow"
                        placeholder="Yeni şifrəni yazın" />
                    <label className="form-label" htmlFor="newpassword">Yeni şifrə</label>
                </div>
                <div className="form-outline mb-3 w-400">
                    <input onChange={e => setRepeatPassword(e.target.value)} type="password" id="newpasswordAgain" className="form-control form-control-lg inputShadow"
                        placeholder="Yeni şifrəni təsdiq edin" />
                    <label className="form-label " htmlFor="newpasswordAgain">Yeni şifrənin təkrarı</label>
                </div>
                <div className='text-center'>
                    <span className='text-danger d-none'>Şifrələr eyni deyil</span>
                </div>
                <div className="text-center d-flex justify-content-lg-center align-items-lg-center  text-lg-start mt-4 pt-2">
                    <button type="submit" id='btnSend' className="btn btn-primary btn-lg p-25">Şifrəni yenilə</button>
                </div>
            </form>
            <div className='message mt-5'>
                {message !== null ? message : ''}
            </div>
        </div>
    )
}

export default ResetPassword

