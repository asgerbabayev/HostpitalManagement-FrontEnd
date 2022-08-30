import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom';
import Loader from '../Loader'
import MessageAlert from '../MessageAlert';
import Pagination from '../Pagination'

function Control() {

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState();
    let counter = 0;
    const [id, setId] = useState('');
    const [date, setDate] = useState('');
    const [diagnosis, setDiagnosis] = useState('');
    const [result, setResult] = useState('');
    const [complaint, setComplaint] = useState('');
    const [registryId, setRegistryId] = useState('');
    const [registry, setRegistry] = useState([]);
    const [controls, setControls] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(5);
    const indexOfLast = currentPage * postsPerPage;
    const indexOfFirst = indexOfLast - postsPerPage;
    const current = controls.slice(indexOfFirst, indexOfLast);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber)
    }

    function showModal() {
        document.querySelector(".add").classList.remove("d-none");
        document.querySelector(".update").classList.add("d-none");
        setRegistryId("");
        setComplaint("");
        setDate("");
        setDiagnosis("");
        setResult("");
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

    function messageInterval() {
        setTimeout(() => {
            setMessage('');
        }, 5000);
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

    async function get(e) {
        document.querySelector(".update").classList.remove("d-none");
        document.querySelector(".add").classList.add("d-none");
        let id = parseInt(e.target.getAttribute('id'));
        axios.defaults.headers.post["Content-Type"] = "application/json";
        axios.defaults.headers["Access-Control-Allow-Methods"] = "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT";
        axios.defaults.headers["Access-Control-Allow-Origin"] = "*";
        axios.defaults.withCredentials = true;
        await axios.get(`https://localhost:44398/control/get/?id=${id}`)
            .then(res => {
                setId(res.data.data.id);
                setRegistryId(res.data.data.registryId);
                setComplaint(res.data.data.complaint);
                setDate(res.data.data.date);
                setDiagnosis(res.data.data.diagnosis);
                setResult(res.data.data.result);
            });
    }

    async function update(e) {
        e.preventDefault();

        let data = {
            id,
            'registryId': Number(registryId),
            complaint,
            date,
            diagnosis,
            result,
        }
        axios.defaults.headers.post["Content-Type"] = "application/json";
        axios.defaults.headers["Access-Control-Allow-Methods"] = "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT";
        axios.defaults.headers["Access-Control-Allow-Origin"] = "*";
        axios.defaults.withCredentials = true;
        if (checkInput()) {
            setLoading(true);
            axios({
                method: 'PUT',
                url: 'https://localhost:44398/control',
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
        axios.defaults.headers.post["Content-Type"] = "application/json";
        axios.defaults.headers["Access-Control-Allow-Methods"] = "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT";
        axios.defaults.headers["Access-Control-Allow-Origin"] = "*";
        axios.defaults.withCredentials = true;
        let data = {
            'registryId': Number(registryId),
            complaint,
            date,
            diagnosis,
            result,
        }
        if (checkInput()) {
            setLoading(true);
            await axios({
                method: 'POST',
                url: 'https://localhost:44398/control',
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

    async function del(e) {
        let id = parseInt(e.target.getAttribute('id'));
        axios.defaults.headers.post["Content-Type"] = "application/json";
        axios.defaults.headers["Access-Control-Allow-Methods"] = "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT";
        axios.defaults.headers["Access-Control-Allow-Origin"] = "*";
        axios.defaults.withCredentials = true;
        setLoading(true);
        await axios.delete(`https://localhost:44398/control/?id=${id}`)
            .then(res => console.log(res))
        window.location.reload()
    }

    function checkInput() {
        if (registryId === "" && complaint === "" && date === "" && diagnosis === "" && result === "") {
            setMessage(<MessageAlert message={'Bütün məlumatları doldurun'} />)
            messageInterval();
            return false;
        }
        return true;
    }

    function check() {
        var date1 = new Date((localStorage.getItem("date"))).toString();
        var date2 = new Date().toString();
        if (localStorage.getItem("auth") !== "true" || localStorage.getItem("role") !== "3" || date1 < date2)
            return <Redirect to="/" />
    }

    check();
    useEffect(() => {
        check();
        axios.defaults.headers.post["Content-Type"] = "application/json";
        axios.defaults.headers["Access-Control-Allow-Methods"] = "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT";
        axios.defaults.headers["Access-Control-Allow-Origin"] = "*";
        axios.defaults.withCredentials = true;
        const fetchControls = async () => {
            setLoading(true);
            await axios.get(`https://localhost:44398/control/all`)
                .then(response => {
                    setControls(response.data.data);
                    setLoading(false);
                }).catch(e => {
                    setLoading(false);
                });
        }
        fetchControls();
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
    }, [])

    return (
        <div className='d-flex flex-column justify-content-center' style={{ width: "98%" }}>
            <div className='d-flex justify-content-center'>
                {loading ? <Loader /> : ''}
                <h1 className='display-5'>Müayinələrin siyahısı</h1>
            </div>
            <div className='mb-3'>
                <button type='button' onClick={showModal} className='btn btn-secondary' data-mdb-toggle="modal"
                    data-mdb-target="#exampleModal"
                    data-mdb-whatever="@fat">Yeni müayinə</button>
            </div>
            <div>
                <input onKeyUp={Search} className="searchId form-control" type="text" placeholder="Axtar..." />
            </div>
            <table className="table table-hover table-fixed me-5">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Qeydiyyat №</th>
                        <th>Şikayət</th>
                        <th>Tarix</th>
                        <th>Diaqnoz</th>
                        <th>Nəticə</th>
                        <th colSpan={2}>Əməliyyatlar</th>
                    </tr>
                </thead>
                <tbody>
                    {current.map(data => {
                        return (
                            <tr key={counter++}>
                                <th scope="row" >{counter + 1}</th>
                                <td>{data.registry.number}</td>
                                <td>{data.complaint}</td>
                                <td>{new Date(data.date).toDateString()}</td>
                                <td>{data.diagnosis}</td>
                                <td>{data.result}</td>
                                <td><button className='btn btn-warning' data-mdb-toggle="modal"
                                    data-mdb-target="#exampleModal"
                                    data-mdb-whatever="@fat" id={data.id} onClick={get}>Dəyişdir</button></td>
                                <td><button className='btn btn-danger' id={data.id} onClick={del}>Sil</button></td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <Pagination postsPerPage={postsPerPage} totalPosts={registry.length} paginate={paginate} />
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                {loading ? <Loader /> : ''}
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Tibbi ləvazimat əlavə etmə formu</h5>
                            <button type="button" className="btn-close" data-mdb-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <form>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="registryId" className="col-form-label">Qeydiyyat №:</label>
                                    <select className="form-control" id="registryId" onChange={e => setRegistryId(e.target.value)} value={registryId}>
                                        <option value="" disabled defaultValue>Qeydiyyat seçin</option>
                                        {registry.map(data => {
                                            return (
                                                <option key={data.id} value={data.id}>{data.id} - {data.number}</option>
                                            )
                                        })}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="complaint" className="col-form-label">Şikayət:</label>
                                    <input type="text" onChange={e => setComplaint(e.target.value)} value={complaint} className="form-control" id="complaint" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="date" className="col-form-label">Tarix:</label>
                                    <input type="date" min={1} onChange={e => setDate(e.target.value)} value={date} className="form-control" id="date" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="diagnosis" className="col-form-label">Diaqnoz:</label>
                                    <input type="text" onChange={e => setDiagnosis(e.target.value)} value={diagnosis} className="form-control" id="diagnosis" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="result" className="col-form-label">Nəticə:</label>
                                    <input type="text" onChange={e => setResult(e.target.value)} value={result} className="form-control" id="result" />
                                </div>
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

export default Control
