import React, { useState } from 'react'
import axios from 'axios'
import MessageAlert from '../components/MessageAlert';
import Loader from '../components/Loader';

const ForgotPassword = () => {

    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const SendResetMail = async (e) => {
        e.preventDefault();
        if (Check()) {
            axios.defaults.headers.post["Content-Type"] = "application/json";
            axios.defaults.headers["Access-Control-Allow-Methods"] = "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT";
            axios.defaults.headers["Access-Control-Allow-Origin"] = "*";
            axios.defaults.withCredentials = true;
            setLoading(true);
            await axios.post(`https://localhost:44398/auth/resetpasswordmail/?email=${email}`)
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

    function Check() {
        let span = document.querySelector("span");
        if (email !== "") {
            span.classList.add("d-none");
            return true;
        }
        else {
            span.classList.remove("d-none");
            return false;
        }
    }


    return (
        <div className='d-flex flex-column justify-content-lg-center align-items-lg-center'>
            {loading ? <Loader /> : ''}
            <div className='row'>
                <div className='mb-3 col-lg-12'>
                    <h4 className='text-center'>Şifrə sıfırlama emailini göndərmək üçün etibarlı email ünvanınızı daxil edin.</h4>
                </div>
            </div>
            <form onSubmit={SendResetMail} className="row gy-2 gx-3 justify-content-center align-items-center">
                <div className="col-auto">
                    <div className="form-outline">
                        <input type="email" onChange={e => setEmail(e.target.value)} onKeyUp={Check} onBlur={Check} id="emailForForgotPassword" className="form-control form-control-lg inputShadow"
                            placeholder="Etibarli mail adresi yazın" />
                        <label className="form-label" htmlFor="emailForForgotPassword">Email</label>
                    </div>
                    <span className='text-danger d-none'>Mail yazmaq məcburidir</span>
                </div>
                <div className="col-auto ">
                    <button type="submit" className="btn btn-primary custom-btn">Göndər</button>
                </div>
            </form>
            <div className='message mt-10'>
                {message !== null ? message : ''}
            </div>
        </div>
    )
}
export default ForgotPassword;