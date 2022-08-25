import Pagination from '../Pagination';
import axios from 'axios';
import React, { useEffect } from 'react'
import { useState } from 'react';
import { Redirect } from 'react-router-dom';
import Loader from '../Loader';
import MessageAlert from '../MessageAlert';

function EmployeeList() {

    const [loading, setLoading] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [identificationNumber, setIdentificationNumber] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [roleId, setRole] = useState();
    const [message, setMessage] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(5);
    let count = 0;

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

    async function getEmployee(e) {
        document.querySelector(".update").classList.remove("d-none");
        document.querySelector(".add").classList.add("d-none");
        let id = parseInt(e.target.getAttribute('id'));
        axios.defaults.headers.post["Content-Type"] = "application/json";
        axios.defaults.headers["Access-Control-Allow-Methods"] = "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT";
        axios.defaults.headers["Access-Control-Allow-Origin"] = "*";
        axios.defaults.withCredentials = true;
        await axios.get(`https://localhost:44398/employee/get/?id=${id}`)
            .then(res => {
                setId(res.data.data.id);
                setName(res.data.data.name);
                setSurname(res.data.data.surname);
                setBirthDate(res.data.data.birthDate);
                setIdentificationNumber(res.data.data.identificationNumber);
                setPhoneNumber(res.data.data.phoneNumber);
                setRole(res.data.data.roleId);
                setEmail(res.data.data.email);
                setPassword(res.data.data.password);
            });
    }

    async function updateEmployee(e) {
        e.preventDefault();

        if (checkInput()) {
            let data = {
                id,
                name,
                surname,
                birthDate,
                phoneNumber,
                identificationNumber,
                email,
                'roleId': Number(roleId),
                password
            }
            axios.defaults.headers.post["Content-Type"] = "application/json";
            axios.defaults.headers["Access-Control-Allow-Methods"] = "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT";
            axios.defaults.headers["Access-Control-Allow-Origin"] = "*";
            axios.defaults.withCredentials = true;
            setLoading(true);
            axios({
                method: 'PUT',
                url: 'https://localhost:44398/employee',
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



    async function addEmployee(e) {
        e.preventDefault();
        axios.defaults.headers.post["Content-Type"] = "application/json";
        axios.defaults.headers["Access-Control-Allow-Methods"] = "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT";
        axios.defaults.headers["Access-Control-Allow-Origin"] = "*";
        axios.defaults.withCredentials = true;
        let data = {
            name,
            surname,
            birthDate,
            phoneNumber,
            identificationNumber,
            email,
            'roleId': Number(roleId),
            password
        }
        if (checkInput()) {
            setLoading(true);
            await axios.post('https://localhost:44398/employee', JSON.stringify(data))
                .then(response => {
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

    async function deleteEmployee(e) {
        let id = parseInt(e.target.getAttribute('id'));
        axios.defaults.headers.post["Content-Type"] = "application/json";
        axios.defaults.headers["Access-Control-Allow-Methods"] = "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT";
        axios.defaults.headers["Access-Control-Allow-Origin"] = "*";
        axios.defaults.withCredentials = true;
        setLoading(true);
        await axios.delete(`https://localhost:44398/employee/?id=${id}`)
            .then(res => console.log(res))
        window.location.reload()
    }

    function checkInput() {
        if (id === "" && name === "" && surname === "" && birthDate === "" && phoneNumber === "" && identificationNumber === "" && email === "" && roleId === "" && password === "") {
            setMessage(<MessageAlert message={'Bütün məlumatları doldurun'} />)
            messageInterval();
            return false;
        }
        return true;
    }

    useEffect(() => {
        var date1 = new Date((localStorage.getItem("date"))).toString();
        var date2 = new Date().toString();
        if (localStorage.getItem("auth") !== "true" || localStorage.getItem("role") !== "1" || date1 < date2)
            return <Redirect to="/" />
    })

    function showModal() {
        document.querySelector(".add").classList.remove("d-none");
        document.querySelector(".update").classList.add("d-none");
        setName("");
        setSurname("");
        setBirthDate("");
        setIdentificationNumber("");
        setPhoneNumber("");
        setRole("");
        setEmail("");
        setPassword("");
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

    const indexOfLast = currentPage * postsPerPage;
    const indexOfFirst = indexOfLast - postsPerPage;
    const current = employees.slice(indexOfFirst, indexOfLast);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber)
    }

    useEffect(() => {
        axios.defaults.headers.post["Content-Type"] = "application/json";
        axios.defaults.headers["Access-Control-Allow-Methods"] = "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT";
        axios.defaults.headers["Access-Control-Allow-Origin"] = "*";
        axios.defaults.withCredentials = true;
        const fetchEmployees = async () => {
            setLoading(true);
            await axios.get(`https://localhost:44398/employee/all`)
                .then(response => {
                    setEmployees(response.data.data);
                    setLoading(false);
                }).catch(e => {
                    setLoading(false);
                });
        }
        fetchEmployees();
    }, [])

    return (
        <div className='d-flex flex-column justify-content-center' style={{ width: "98%" }}>
            {loading ? <Loader /> : ''}
            <div className='d-flex justify-content-center'>
                <h1 className='display-5'>İşçlərin siyahısı</h1>
            </div>
            <div className='mb-3'>
                <button type='button' onClick={showModal} className='btn btn-secondary' data-mdb-toggle="modal"
                    data-mdb-target="#exampleModal"
                    data-mdb-whatever="@fat">Yeni işçi</button>
            </div>
            <div>
                <input onKeyUp={Search} className="searchId form-control" type="text" placeholder="Search..." />
            </div>
            <table className="table table-hover table-fixed me-5">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Ad</th>
                        <th>Soyad</th>
                        <th>D. Tarixi</th>
                        <th>Seria №</th>
                        <th>Telefon №</th>
                        <th>Rol</th>
                        <th>Email</th>
                        <th colSpan={2}>Əməliyyatlar</th>
                    </tr>
                </thead>
                <tbody>
                    {current.map(emp => {
                        return (
                            <tr key={count++}>
                                <th scope="row" >{count + 1}</th>
                                <td>{emp.name}</td>
                                <td>{emp.surname}</td>
                                <td>{new Date(emp.birthDate).toDateString()}</td>
                                <td>{emp.identificationNumber}</td>
                                <td>{emp.phoneNumber}</td>
                                <td>{emp.role.name}</td>
                                <td style={{ wordWrap: "break-word" }} title={emp.email}><a href={`mailto:${emp.email}`}>{emp.email}</a></td>
                                <td><button className='btn btn-warning' data-mdb-toggle="modal"
                                    data-mdb-target="#exampleModal"
                                    data-mdb-whatever="@fat" id={emp.id} onClick={getEmployee}>Dəyişdir</button></td>
                                <td><button className='btn btn-danger' id={emp.id} onClick={deleteEmployee}>Sil</button></td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <Pagination postsPerPage={postsPerPage} totalPosts={employees.length} paginate={paginate} />
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
                                    <label htmlFor="email" className="col-form-label">Email</label>
                                    <input type="text" onChange={e => setEmail(e.target.value)} value={email} className="form-control" id="email" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="col-form-label">Password</label>
                                    <input type="password" onChange={e => setPassword(e.target.value)} value={password} className="form-control" id="password" />
                                </div>
                                <label htmlFor="role" className="col-form-label">Role:</label>
                                <select className="form-control" id="role" onChange={e => setRole(e.target.value)} value={roleId}>
                                    <option value="" disabled selected>Role seçin</option>
                                    <option value="2">Həkim</option>
                                    <option value="3">Resepşın</option>
                                </select>
                            </div>
                            <div className="modal-footer">
                                <div className='message d-flex justify-content-center align-items-center'>
                                    {message !== null ? message : ''}
                                </div>
                                <button type="button" className="btn btn-secondary" data-mdb-dismiss="modal">Bağla</button>
                                <button type="button" onClick={addEmployee} className="btn btn-primary add">Əlavə et</button>
                                <button type="button" onClick={updateEmployee} className="btn btn-success d-none update">Saxla</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default EmployeeList
