import React, { useState, useEffect } from "react";
import axios from "axios"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {setCookie, getCookie, deleteCookie} from "../../utility/user-cookie";
import { Table, Row, Col, Container, Form, Button, Nav, Navbar, FormControl } from 'react-bootstrap';


// function Certificate() {
//     const [certificate, setCertificate] = useState();
//     const [authority, setAuthority] = useState();
//     const [acquisition, setAcquisition] = useState();

//     function submitCertificateInfo(e) {
//         e.preventDefault();
//         setCertificate(e.target.certificate.value);
//         setAuthority(e.target.authority.value);
//     }

//     return(
//         <div>
//             자격증
//             <form onSubmit={submitCertificateInfo}>
//                 <label>자격증 이름: <input type='text' name='certificate' onChange={(e) => setCertificate(e.target.value)}/></label>
//                 <label>공급 기관: <input type='text' name='authority' onChange={(e) => setAuthority(e.target.value)}/></label>
//                 <label>취득 일자: <DatePicker selected={acquisition} onChange={date => setAcquisition(date)}/></label>
//                 <input type='submit' value='자격증 제출' />
//             </form>
//         </div>
//     )
// }