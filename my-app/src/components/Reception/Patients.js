import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, Redirect } from 'react-router-dom';
import Loader from '../Loader'
import MessageAlert from '../MessageAlert';
import Pagination from '../Pagination';

function Patients() {

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState();
    let count = 0;
    const [patients, setPatients] = useState([]);
    const [registry, setRegistry] = useState([]);
    const [registryId, setRegistryId] = useState();
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [identificationNumber, setIdentificationNumber] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [gender, setGender] = useState('');
    const [address, setAddress] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(5);

    const indexOfLast = currentPage * postsPerPage;
    const indexOfFirst = indexOfLast - postsPerPage;
    const current = patients.slice(indexOfFirst, indexOfLast);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber)
    }

    function Search(e) {
        let table = document.querySelector("table");
        for (let i = 1; i < table.rows.length; i++) {
            if (table.rows[i].cells[1].innerText.toLowerCase().includes(e.target.value) === true || table.rows[i].cells[2].innerText.toLowerCase().includes(e.target.value) === true) {
                table.rows[i].classList.remove("d-none");
            }
            else if (e.target.value === "") {
                table.rows[i].classList.remove("d-none");
            }
            else {
                table.rows[i].classList.add("d-none");
            }
        }
    }

    function messageInterval() {
        setTimeout(() => {
            setMessage('');
        }, 5000);
    }

    function axiosHeader() {
        axios.defaults.headers.post["Content-Type"] = "application/json";
        axios.defaults.headers["Access-Control-Allow-Methods"] = "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT";
        axios.defaults.headers["Access-Control-Allow-Origin"] = "*";
        axios.defaults.withCredentials = true;
    }

    async function get(e) {
        document.querySelector(".update").classList.remove("d-none");
        document.querySelector(".add").classList.add("d-none");
        let id = parseInt(e.target.getAttribute('id'));
        axiosHeader();
        await axios.get(`https://localhost:44398/patient/get/?id=${id}`)
            .then(res => {
                setId(res.data.data.id);
                setName(res.data.data.name);
                setSurname(res.data.data.surname);
                setBirthDate(res.data.data.birthDate);
                setIdentificationNumber(res.data.data.identificationNumber);
                setPhoneNumber(res.data.data.phoneNumber);
                setAddress(res.data.data.address);
                setGender(res.data.data.gender);
                setRegistryId(res.data.data.registryId);
            });
    }

    async function update(e) {
        e.preventDefault();

        let data = {
            id,
            name,
            surname,
            birthDate,
            identificationNumber,
            phoneNumber,
            gender,
            address,
            registryId: Number(registryId)
        }
        axiosHeader();
        if (checkInput()) {
            setLoading(true);
            axios({
                method: 'PUT',
                url: 'https://localhost:44398/patient',
                data: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json; charset=utf-8' }
            }).then(response => {
                setLoading(false);
                setMessage(<MessageAlert message={response.data.message} />)
                messageInterval();
                window.location.reload();
            }).catch(e => {
                console.log(e);
                setLoading(false);
                setMessage(<MessageAlert message={e.response.data} />)
                messageInterval();
            });
        }
    }
    async function add(e) {
        e.preventDefault();
        axiosHeader();
        let data = {
            name,
            surname,
            birthDate,
            identificationNumber,
            phoneNumber,
            gender,
            address,
            registryId: Number(registryId)
        }
        if (checkInput()) {
            setLoading(true);
            await axios({
                method: 'POST',
                url: 'https://localhost:44398/patient',
                data: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json; charset=utf-8' }
            }).then(response => {
                setLoading(false);
                setMessage(<MessageAlert message={response.data.message} />)
                messageInterval();
                window.location.reload();
            }).catch(e => {
                console.log(e);
                setLoading(false);
                setMessage(<MessageAlert message={e.response.data} />)
                messageInterval();
            });
        }
    }

    function checkInput() {
        if (id === "" && name === "" && surname === "" && identificationNumber === ""
            && phoneNumber === "" && gender === "" && address === "") {
            setMessage(<MessageAlert message={'Bütün məlumatları doldurun'} />)
            messageInterval();
            return false;
        }
        return true;
    }

    async function del(e) {
        let id = parseInt(e.target.getAttribute('id'));
        axiosHeader();
        setLoading(true);
        await axios.delete(`https://localhost:44398/patient/?id=${id}`)
            .then(res => console.log(res))
        window.location.reload();
    }

    function check() {
        var date1 = new Date((localStorage.getItem("date"))).toString();
        var date2 = new Date().toString();
        if (localStorage.getItem("auth") !== "true" || localStorage.getItem("role") !== "3" || date1 < date2)
            return <Redirect to="/" />
    }

    check();

    function showModal() {
        document.querySelector(".add").classList.remove("d-none");
        document.querySelector(".update").classList.add("d-none");
        setName("");
        setSurname("");
        setBirthDate("");
        setIdentificationNumber("");
        setPhoneNumber("");
        setAddress("");
        setGender("");
        setRegistryId("");
        const exampleModal = document.getElementById('exampleModal');
        exampleModal.addEventListener('show.mdb.modal', (e) => {
            const button = e.relatedTarget;
            const recipient = button.getAttribute('data-mdb-whatever');
            const modalTitle = exampleModal.querySelector('.modal-title');
            const modalBodyInput = exampleModal.querySelector('.modal-body input');
            modalTitle.textContent = `New message to ${recipient}`;
            modalBodyInput.value = recipient;
        })
    }

    useEffect(() => {
        axiosHeader();
        const fetchRegistries = async () => {
            setLoading(true);
            await axios.get(`https://localhost:44398/registry/all`)
                .then(response => {
                    setRegistry(response.data.data);
                    setLoading(false);
                }).catch(e => {
                    setLoading(false);
                });
        }
        fetchRegistries();
        const fetch = async () => {
            setLoading(true);
            await axios.get(`https://localhost:44398/patient/all`)
                .then(response => {
                    console.log(response);
                    setPatients(response.data.data);
                    setLoading(false);
                }).catch(e => {
                    setLoading(false);
                });
        }
        fetch();
    }, [])
    return (
        <div className='d-flex flex-column justify-content-center' style={{ width: "98%" }}>
            {loading ? <Loader /> : ''}
            <div className='d-flex justify-content-center'>
                <h1 className='display-5'>Xəstələrin siyahısı</h1>
            </div>
            <div className='mb-3'>
                <button type='button' onClick={showModal} className='btn btn-secondary' data-mdb-toggle="modal"
                    data-mdb-target="#exampleModal"
                    data-mdb-whatever="@fat">Yeni Xəstə</button>
            </div>
            <div>
                <input onKeyUp={Search} className="searchId form-control" type="text" placeholder="Search..." />
            </div>
            <table className="table table-hover table-fixed me-5">
                <thead>
                    <tr>
                        <th>#</th>
                        <th className='text-center'>Ətraflı</th>
                        <th>Qeydiyyat №</th>
                        <th>Ad</th>
                        <th>Soyad</th>
                        <th>Seria №</th>
                        <th>Telefon №</th>
                        <th>D. Tarixi</th>
                        <th>Cinsiyyət</th>
                        <th colSpan={2}>Əməliyyatlar</th>
                    </tr>
                </thead>
                <tbody>
                    {current.map(data => {
                        return (
                            <tr key={count++}>
                                <th scope="row" >{count + 1}</th>
                                <th><a href="/reception/patient/details"><i class="fa fa-info-circle fs-4 d-flex justify-content-center" aria-hidden="true"></i></a></th>
                                <td>{data.registry.number}</td>
                                <td>{data.name}</td>
                                <td>{data.surname}</td>
                                <td>{data.identificationNumber}</td>
                                <td>{data.phoneNumber}</td>
                                <td>{new Date(data.birthDate).toDateString()}</td>
                                <td>{data.gender}</td>
                                <td><button className='btn btn-warning' data-mdb-toggle="modal"
                                    data-mdb-target="#exampleModal"
                                    data-mdb-whatever="@fat" id={data.id} onClick={get}>Dəyişdir</button></td>
                                <td><button className='btn btn-danger' id={data.id} onClick={del}>Sil</button></td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <Pagination postsPerPage={postsPerPage} totalPosts={patients.length} paginate={paginate} />
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                {loading ? <Loader /> : ''}
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">İşçi əlavə etmə formu</h5>
                            <button type="button" className="btn-close" data-mdb-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <form>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="name" className="col-form-label">Ad:</label>
                                    <input type="text" onChange={e => setName(e.target.value)} value={name} className="form-control" id="name" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="surname" className="col-form-label">Soyad:</label>
                                    <input type="text" onChange={e => setSurname(e.target.value)} value={surname} className="form-control" id="surname" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="birthdate" className="col-form-label">D. Tarixi:</label>
                                    <input type="date" onChange={e => setBirthDate(e.target.value)} value={birthDate} className="form-control" id="birthdate" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="idnumber" className="col-form-label">Seria №:</label>
                                    <input type="text" onChange={e => setIdentificationNumber(e.target.value)} value={identificationNumber} className="form-control" id="idnumber" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="phonenumber" className="col-form-label">Telefon №:</label>
                                    <input type="number" min={1} onChange={e => setPhoneNumber(e.target.value)} value={phoneNumber} className="form-control" id="phonenumber" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="gender" className="col-form-label">Cinsiyyət:</label>
                                    <select className="form-control" id="gender" onChange={e => setGender(e.target.value)} value={gender}>
                                        <option value="" disabled defaultValue>Cinsiyyət seçin</option>
                                        <option value="Kişi">Kişi</option>
                                        <option value="Qadın">Qadın</option>
                                    </select>
                                </div>
                                <label htmlFor="address" className="col-form-label">Address:</label>
                                <textarea className='form-control' id='address' cols="30" rows="5" onChange={e => setAddress(e.target.value)} value={address}></textarea>
                                <label htmlFor="registryId" className="col-form-label">Qeydiyyat:</label>
                                <select className="form-control" id="registryId" onChange={e => setRegistryId(e.target.value)} value={registryId}>
                                    <option value="" disabled defaultValue>Qeydiyyat seçin</option>
                                    {registry.map(data => {
                                        return (
                                            <option key={data.number} value={data.id}> {data.number}</option>
                                        )
                                    })}
                                </select>
                            </div>
                            <div className="modal-footer">
                                <div className='message d-flex justify-content-center align-items-center'>
                                    {message !== null ? message : ''}
                                </div>
                                <button type="button" className="btn btn-secondary" data-mdb-dismiss="modal">Bağla</button>
                                <button type="button" onClick={add} className="btn btn-primary add">Əlavə et</button>
                                <button type="button" onClick={update} className="btn btn-success d-none update">Saxla</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Patients
