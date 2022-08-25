import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom';
import Loader from '../Loader';
import MessageAlert from '../MessageAlert';
import Pagination from '../Pagination';

function Medicines() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState();
    let counter = 0;
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [barcodeNumber, setBarcodeNumber] = useState('');
    const [count, setCount] = useState('');
    const [medicines, setMedicines] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(5);

    const indexOfLast = currentPage * postsPerPage;
    const indexOfFirst = indexOfLast - postsPerPage;
    const current = medicines.slice(indexOfFirst, indexOfLast);

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
        await axios.get(`https://localhost:44398/medicine/get/?id=${id}`)
            .then(res => {
                setId(res.data.data.id);
                setName(res.data.data.name);
                setType(res.data.data.type);
                setBarcodeNumber(res.data.data.barcodeNumber);
                setCount(res.data.data.count);
            });
    }

    async function update(e) {
        e.preventDefault();

        let data = {
            id,
            name,
            type,
            barcodeNumber,
            'count': Number(count),
        }
        axios.defaults.headers.post["Content-Type"] = "application/json";
        axios.defaults.headers["Access-Control-Allow-Methods"] = "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT";
        axios.defaults.headers["Access-Control-Allow-Origin"] = "*";
        axios.defaults.withCredentials = true;
        if (checkInput()) {
            setLoading(true);
            axios({
                method: 'PUT',
                url: 'https://localhost:44398/medicine',
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
            name,
            type,
            barcodeNumber,
            'count': Number(count),
        }
        if (checkInput()) {
            setLoading(true);
            await axios({
                method: 'POST',
                url: 'https://localhost:44398/medicine',
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
        await axios.delete(`https://localhost:44398/medicine/?id=${id}`)
            .then(res => console.log(res))
        window.location.reload()
    }

    function checkInput() {
        if (id === "" && name === "" && barcodeNumber === "" && type === "" && count === "") {
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
        setBarcodeNumber("");
        setType("");
        setCount("");
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
        axios.defaults.headers.post["Content-Type"] = "application/json";
        axios.defaults.headers["Access-Control-Allow-Methods"] = "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT";
        axios.defaults.headers["Access-Control-Allow-Origin"] = "*";
        axios.defaults.withCredentials = true;
        const fetch = async () => {
            setLoading(true);
            await axios.get(`https://localhost:44398/medicine/all`)
                .then(response => {
                    setMedicines(response.data.data);
                    setLoading(false);
                }).catch(e => {
                    console.log(e);
                    setLoading(false);
                });
        }
        fetch();
    }, [])

    return (
        <div className='d-flex flex-column justify-content-center' style={{ width: "98%" }}>
            {loading ? <Loader /> : ''}
            <div className='d-flex justify-content-center'>
                <h1 className='display-5'>Dərmanların siyahısı</h1>
            </div>
            <div className='mb-3'>
                <button type='button' onClick={showModal} className='btn btn-secondary' data-mdb-toggle="modal"
                    data-mdb-target="#exampleModal"
                    data-mdb-whatever="@fat">Yeni dərman</button>
            </div>
            <div>
                <input onKeyUp={Search} className="searchId form-control" type="text" placeholder="Search..." />
            </div>
            <table className="table table-hover table-fixed me-5">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Adı</th>
                        <th>Tipi</th>
                        <th>Barkodu</th>
                        <th>Stok sayısı</th>
                        <th colSpan={2}>Əməliyyatlar</th>
                    </tr>
                </thead>
                <tbody>
                    {current.map(data => {
                        return (
                            <tr key={counter++}>
                                <th scope="row" >{counter + 1}</th>
                                <td>{data.name}</td>
                                <td>{data.type}</td>
                                <td>{data.barcodeNumber}</td>
                                <td>{data.count} ədəd</td>
                                <td><button className='btn btn-warning' data-mdb-toggle="modal"
                                    data-mdb-target="#exampleModal"
                                    data-mdb-whatever="@fat" id={data.id} onClick={get}>Dəyişdir</button></td>
                                <td><button className='btn btn-danger' id={data.id} onClick={del}>Sil</button></td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <Pagination postsPerPage={postsPerPage} totalPosts={medicines.length} paginate={paginate} />
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                {loading ? <Loader /> : ''}
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Dərman əlavə etmə formu</h5>
                            <button type="button" className="btn-close" data-mdb-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <form>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="name" className="col-form-label">Dərman adı:</label>
                                    <input type="text" onChange={e => setName(e.target.value)} value={name} className="form-control" id="name" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="type" className="col-form-label">Dərman tipi:</label>
                                    <input type="text" onChange={e => setType(e.target.value)} value={type} className="form-control" id="type" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="barcodeNumber" className="col-form-label">Barkod №:</label>
                                    <input type="number" min={1} onChange={e => setBarcodeNumber(e.target.value)} value={barcodeNumber} className="form-control" id="barcodeNumber" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="count" className="col-form-label">Dərman sayısı:</label>
                                    <input type="number" min={1} onChange={e => setCount(e.target.value)} value={count} className="form-control" id="count" />
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

export default Medicines
