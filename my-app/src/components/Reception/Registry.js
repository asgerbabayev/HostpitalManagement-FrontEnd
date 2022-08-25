import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, Redirect } from 'react-router-dom';
import Loader from '../Loader'
import MessageAlert from '../MessageAlert';
import Pagination from '../Pagination'

function Registry() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState();
    let counter = 0;
    const [id, setId] = useState('');
    const [employeeId, setEmployeeId] = useState('');
    const [roomId, setRoomId] = useState('');
    const [registry, setRegistry] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [rooms, setRooms] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(5);
    const indexOfLast = currentPage * postsPerPage;
    const indexOfFirst = indexOfLast - postsPerPage;
    const current = registry.slice(indexOfFirst, indexOfLast);

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

    async function get(e) {
        document.querySelector(".update").classList.remove("d-none");
        document.querySelector(".add").classList.add("d-none");
        let id = parseInt(e.target.getAttribute('id'));
        axios.defaults.headers.post["Content-Type"] = "application/json";
        axios.defaults.headers["Access-Control-Allow-Methods"] = "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT";
        axios.defaults.headers["Access-Control-Allow-Origin"] = "*";
        axios.defaults.withCredentials = true;
        await axios.get(`https://localhost:44398/registry/get/?id=${id}`)
            .then(res => {
                setId(res.data.data.id);
                setEmployeeId(res.data.data.employeeId);
                setRoomId(res.data.data.roomId);
            });
    }

    async function update(e) {
        e.preventDefault();

        let data = {
            id,
            'employeeId': Number(employeeId),
            'roomId': Number(roomId),
        }
        axios.defaults.headers.post["Content-Type"] = "application/json";
        axios.defaults.headers["Access-Control-Allow-Methods"] = "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT";
        axios.defaults.headers["Access-Control-Allow-Origin"] = "*";
        axios.defaults.withCredentials = true;
        if (checkInput()) {
            setLoading(true);
            axios({
                method: 'PUT',
                url: 'https://localhost:44398/registry',
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
            'employeeId': Number(employeeId),
            'roomId': Number(roomId)
        }
        if (checkInput()) {
            setLoading(true);
            await axios({
                method: 'POST',
                url: 'https://localhost:44398/registry',
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
        await axios.delete(`https://localhost:44398/registry/?id=${id}`)
            .then(res => console.log(res))
        window.location.reload()
    }


    function checkInput() {
        if (employeeId === "" && roomId === "" && registry === "" && employees === "" && rooms === "") {
            setMessage(<MessageAlert message={'Bütün məlumatları doldurun'} />)
            messageInterval();
            return false;
        }
        return true;
    }

    function showModal() {
        document.querySelector(".add").classList.remove("d-none");
        document.querySelector(".update").classList.add("d-none");
        setEmployeeId("");
        setRoomId("");
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

    function check() {
        var date1 = new Date((localStorage.getItem("date"))).toString();
        var date2 = new Date().toString();
        if (localStorage.getItem("auth") !== "true" || localStorage.getItem("role") !== "3" || date1 < date2)
            return <Redirect to="/" />
    }

    check();
    useEffect(() => {
        axios.defaults.headers.post["Content-Type"] = "application/json";
        axios.defaults.headers["Access-Control-Allow-Methods"] = "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT";
        axios.defaults.headers["Access-Control-Allow-Origin"] = "*";
        axios.defaults.withCredentials = true;
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

        const fetchEmployees = async () => {
            setLoading(true);
            await axios.get(`https://localhost:44398/employee/doctors`)
                .then(response => {
                    setEmployees(response.data.data);
                    setLoading(false);
                }).catch(e => {
                    setLoading(false);
                });
        }
        fetchEmployees();

        const fetchRooms = async () => {
            setLoading(true);
            await axios.get(`https://localhost:44398/room/all`)
                .then(response => {
                    setRooms(response.data.data);
                    setLoading(false);
                }).catch(e => {
                    setLoading(false);
                });
        }
        fetchRooms();
    }, [])

    return (
        <div className='d-flex flex-column justify-content-center' style={{ width: "98%" }}>
            {loading ? <Loader /> : ''}
            <div className='d-flex justify-content-center'>
                <h1 className='display-5'>Qeydiyyatların siyahısı</h1>
            </div>
            <div className='mb-3'>
                <button type='button' onClick={showModal} className='btn btn-secondary' data-mdb-toggle="modal"
                    data-mdb-target="#exampleModal"
                    data-mdb-whatever="@fat">Yeni qeydiyyat</button>
            </div>
            <div>
                <input onKeyUp={Search} className="searchId form-control" type="text" placeholder="Axtar..." />
            </div>
            <table className="table table-hover table-fixed me-5">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Qeydiyyat №</th>
                        <th>Həkim Ad</th>
                        <th>Həkim Soyad</th>
                        <th>Seriya №</th>
                        <th>Otaq №</th>
                        <th>Otaq tutumu</th>
                        <th title='Qeydiyyat tarixi'>Q. Tarixi</th>
                        <th title='Çıxış tarixi'>Ç. Tarixi</th>
                        <th colSpan={2}>Əməliyyatlar</th>
                    </tr>
                </thead>
                <tbody>
                    {current.map(data => {
                        console.log(data.status);
                        return (
                            <tr key={counter++}>
                                <th scope="row" >{counter + 1}</th>
                                <td>{data.number}</td>
                                <td>{data.employee.name}</td>
                                <td>{data.employee.surname}</td>
                                <td>{data.employee.identificationNumber}</td>
                                <td>{data.room.number}</td>
                                <td>{data.room.capacity}</td>
                                <td>{new Date(data.patientRegistryDate).toDateString()}</td>
                                <td>{data.status === false ? "-" : new Date(data.patientLeavingDate).toDateString()}</td>
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
                                    <label htmlFor="employeeId" className="col-form-label">Həkim:</label>
                                    <select className="form-control" id="employeeId" onChange={e => setEmployeeId(e.target.value)} value={employeeId}>
                                        <option value="" disabled defaultValue>Həkim seçin</option>
                                        {employees.map(data => {
                                            return (
                                                <option key={data.id} value={data.id}>{data.name} {data.surname} {data.identificationNumber}</option>
                                            )
                                        })}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="roomId" className="col-form-label">Otaq:</label>
                                    <select className="form-control" id="roomId" onChange={e => setRoomId(e.target.value)} value={roomId}>
                                        <option value="" disabled defaultValue>Otaq seçin</option>
                                        {rooms.map(data => {
                                            return (
                                                <option key={data.id} value={data.id}>{data.number}</option>
                                            )
                                        })}
                                    </select>
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

export default Registry
