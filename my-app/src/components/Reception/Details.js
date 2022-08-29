import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Loader from '../Loader';
import MessageAlert from '../MessageAlert';

function Details() {
    const id = localStorage.getItem("patientId");
    const [patients, setPatients] = useState({});
    const [registry, setRegistry] = useState({});
    const [employee, setEmployee] = useState({});
    const [room, setRoom] = useState({});
    const [stock, setStock] = useState([]);
    const [material, setMaterial] = useState([]);
    const [registryId, setRegistryId] = useState();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState();


    async function patientLeave(e) {
        setLoading(true);
        axios.defaults.headers.post["Content-Type"] = "application/json";
        axios.defaults.headers["Access-Control-Allow-Methods"] = "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT";
        axios.defaults.headers["Access-Control-Allow-Origin"] = "*";
        axios.defaults.withCredentials = true;
        await axios.get(`https://localhost:44398/registry/leave/?id=${e.target.id}`)
            .then(response => {
                setMessage(<MessageAlert message={response.data.message} />)
                messageInterval();
                setLoading(false);
            }).catch(e => {
                setLoading(false);
            });
    }

    function messageInterval() {
        setTimeout(() => {
            setMessage('');
        }, 5000);
    }

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            axios.defaults.headers.post["Content-Type"] = "application/json";
            axios.defaults.headers["Access-Control-Allow-Methods"] = "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT";
            axios.defaults.headers["Access-Control-Allow-Origin"] = "*";
            axios.defaults.withCredentials = true;
            await axios.get(`https://localhost:44398/patient/get/?id=${id}`)
                .then(response => {
                    setPatients(response.data.data);
                    setRegistry(response.data.data.registry);
                    setEmployee(response.data.data.registry.employee);
                    setRoom(response.data.data.registry.room);
                    setRegistryId(response.data.data.registry.id);
                    setLoading(false);
                }).catch(e => {
                    setLoading(false);
                });
        }
        fetch();
        const fetchStock = async () => {
            setLoading(true);
            axios.defaults.headers.post["Content-Type"] = "application/json";
            axios.defaults.headers["Access-Control-Allow-Methods"] = "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT";
            axios.defaults.headers["Access-Control-Allow-Origin"] = "*";
            axios.defaults.withCredentials = true;
            await axios.get(`https://localhost:44398/stock/all`)
                .then(response => {
                    setStock(response.data.data);
                    setLoading(false);
                }).catch(e => {
                    setLoading(false);
                });
        }
        fetchStock();
        const fetchMaterial = async () => {
            setLoading(true);
            axios.defaults.headers.post["Content-Type"] = "application/json";
            axios.defaults.headers["Access-Control-Allow-Methods"] = "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT";
            axios.defaults.headers["Access-Control-Allow-Origin"] = "*";
            axios.defaults.withCredentials = true;
            await axios.get(`https://localhost:44398/material/all`)
                .then(response => {
                    setMaterial(response.data.data);
                    setLoading(false);
                }).catch(e => {
                    setLoading(false);
                });
        }
        fetchMaterial();
    }, [])

    return (
        <div className='d-flex flex-column justify-content-center' style={{ width: "98%" }}>
            {loading ? <Loader /> : ''}
            <div className='message d-flex justify-content-center align-items-center'>
                {message !== null ? message : ''}
            </div>
            <div className='d-flex justify-content-center'>
                <h1 className='display-5'>Xəstə haqqında</h1>
            </div>
            <table className="table table-hover table-wrap table-fixed me-5">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Xəstə Adı</th>
                        <th>Xəstə Soyadı</th>
                        <th>Seria №</th>
                        <th>Telefon №</th>
                        <th>D. Tarixi</th>
                        <th>Cinsiyyət</th>
                        <th>Adress</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{patients.id}</td>
                        <td>{patients.name}</td>
                        <td>{patients.surname}</td>
                        <td>{patients.identificationNumber}</td>
                        <td>{patients.phoneNumber}</td>
                        <td>{new Date(patients.birthDate).toDateString()}</td>
                        <td>{patients.gender}</td>
                        <td>{patients.address}</td>
                    </tr>
                </tbody>
            </table>
            <hr />
            <table className="table table-hover table-wrap table-fixed me-5">
                <thead>
                    <tr>
                        <th>Qeydiyyat №</th>
                        <th>Həkim Adı</th>
                        <th>Həkim Soyadı</th>
                        <th>Seria №</th>
                        <th>Telefon №</th>
                        <th>Otaq №</th>
                        <th>Q. Tarixi</th>
                        <th>Ç. Tarixi</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{registry.number}</td>
                        <td>{employee.name}</td>
                        <td>{employee.surname}</td>
                        <td>{employee.identificationNumber}</td>
                        <td>{employee.phoneNumber}</td>
                        <td>{room.number}</td>
                        <td>{new Date(registry.patientRegistryDate).toDateString()}</td>
                        <td>{registry.status === false ? "-" : new Date(registry.patientLeavingDate).toDateString()}</td>
                    </tr>
                </tbody>
            </table>
            <div className='mb-3'>
                <button type='button' onClick={patientLeave} id={registry.id} className={registry.status === false ? 'btn btn-success' : 'd-none'}>Xəstə Çıxışını Et</button>
                <h4 className={registry.status === true ? 'text-danger' : 'd-none'}>{registry.status === true ? "Xəstə çıxışı edilib." : ''}</h4>
            </div>

        </div>
    )
}

export default Details
