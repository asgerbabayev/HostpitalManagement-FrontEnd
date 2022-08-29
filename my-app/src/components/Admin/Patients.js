import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom';
import Loader from '../Loader'
import Pagination from '../Pagination';

function Patients() {

    const [loading, setLoading] = useState(false);
    let count = 0;
    const [patients, setPatients] = useState([]);
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

    async function del(e) {
        let id = parseInt(e.target.getAttribute('id'));
        axios.defaults.headers.post["Content-Type"] = "application/json";
        axios.defaults.headers["Access-Control-Allow-Methods"] = "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT";
        axios.defaults.headers["Access-Control-Allow-Origin"] = "*";
        axios.defaults.withCredentials = true;
        setLoading(true);
        await axios.delete(`https://localhost:44398/patient/?id=${id}`)
            .then(res => console.log(res))
        window.location.reload();
    }

    function check() {
        var date1 = new Date((localStorage.getItem("date"))).toString();
        var date2 = new Date().toString();
        if (localStorage.getItem("auth") !== "true" || localStorage.getItem("role") !== "1" || date1 < date2)
            return <Redirect to="/" />
    }

    check();

    useEffect(() => {
        axios.defaults.headers.post["Content-Type"] = "application/json";
        axios.defaults.headers["Access-Control-Allow-Methods"] = "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT";
        axios.defaults.headers["Access-Control-Allow-Origin"] = "*";
        axios.defaults.withCredentials = true;
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
            <div>
                <input onKeyUp={Search} className="searchId form-control" type="text" placeholder="Search..." />
            </div>
            <table className="table table-hover table-fixed me-5">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Ad</th>
                        <th>Soyad</th>
                        <th>Seria №</th>
                        <th>Telefon №</th>
                        <th>D. Tarixi</th>
                        <th>Cinsi</th>
                        <th colSpan={2}>Əməliyyatlar</th>
                    </tr>
                </thead>
                <tbody>
                    {current.map(data => {
                        return (
                            <tr key={count++}>
                                <th scope="row" >{count + 1}</th>
                                <td>{data.name}</td>
                                <td>{data.surname}</td>
                                <td>{data.identificationNumber}</td>
                                <td>{data.phoneNumber}</td>
                                <td>{data.birthDate}</td>
                                <td>{data.gender}</td>
                                <td><button className='btn btn-danger' id={data.id} onClick={del}>Sil</button></td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <Pagination postsPerPage={postsPerPage} totalPosts={patients.length} paginate={paginate} />
        </div >
    )
}

export default Patients
