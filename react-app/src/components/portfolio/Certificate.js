import React, { useState, useEffect } from "react";
import axios from "axios"
import moment from 'moment';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {setCookie, getCookie, deleteCookie} from "../../utility/user-cookie";
import { Table, Row, Col, Container, Form, Button, Nav, Navbar, FormControl } from 'react-bootstrap';

const apiUrl = 'http://localhost:5000/'

export default function Certificate(props) {
    const [certificateList, setCertificateListe] = useState([]);

    axios.defaults.headers.common['Authorization'] = `Bearer ${props.access_token}`;

    useEffect(() => {
        readCertificate(props.userEmail);
    }, [])

    function readCertificate(user) {
        axios.get(apiUrl+'portfolio/certificate', {
            params: {
                user_email: user
            }
        })
        .then(
            response => {
                setCertificateListe(response.data.result);
            }
        )
    }

    return (
        <div>
            {certificateList.map((certificate) => 
                <CertificateForm 
                    onUpdate = {props.onUpdate}
                    form={false} 
                    key={certificate[0]} 
                    id={certificate[0]} 
                    certificate={certificate[1]} 
                    authority={certificate[2]} 
                    acquisition={new Date(certificate[3])} 
                    userEmail={props.userEmail}/>
            )}
            {props.onUpdate ? <CertificateForm 
                                onUpdate = {props.onUpdate} 
                                form={true} 
                                userEmail={props.userEmail} /> : null}
        </div>
    )
}

function CertificateForm(props) {
    const [certificate, setCertificate] = useState();
    const [authority, setAuthority] = useState();
    const [acquisition, setAcquisition] = useState(props.acquisition);
    const [form, setForm] = useState(props.form);

    function createCertificate(e) {
        e.preventDefault();
        setCertificate(e.target.certificate.value);
        setAuthority(e.target.authority.value);
        const certificateData = {
            certificate: certificate,
            authority: authority,
            acquisition: moment(acquisition).format("yyyy-MM-DD"),
            user_email: props.userEmail
        }
        axios.post(apiUrl+'portfolio/certificate', certificateData)
    }

    function updateCertificate(e) {
        e.preventDefault();
        setCertificate(e.target.certificate.value);
        setAuthority(e.target.authority.value);
        const certificateData = {
            certificate: certificate,
            authority: authority,
            acquisition: moment(acquisition).format("yyyy-MM-DD"),
            user_email: props.userEmail,
            id: e.target.id
        }

        axios.put(apiUrl+'portfolio/certificate', certificateData);
        setForm(false);
    }

    function deleteCertificate(e) {
        e.preventDefault();
        axios.delete(apiUrl+'portfolio/certificate', {
            params: {
                id: e.target.id
            }   
        })
    }

    return(
        
        <Form className = {form ? 'before_register' : 'after_register'} id={props.id} onSubmit={form ? props.id ? (e) => updateCertificate(e) : (e) => createCertificate(e) : (e) => deleteCertificate(e)}>
            <Form.Group as={Row} onClick={form ? null : () => setForm(true)}>
                <Form.Label column sm={2}>자격증 이름</Form.Label>
                <Col sm={10}>
                    <Form.Control type='text' name='certificate' defaultValue={form ? null : props.certificate} placeholder='Certificate name' onChange={(e) => setCertificate(e.target.value)}/>
                </Col>
            </Form.Group>
    
            <Form.Group as={Row} onClick={form ? null : () => setForm(true)}>
                <Form.Label column sm={2}>공급 기관</Form.Label>
                <Col sm={10}>
                    <Form.Control type='text' name='authority' defaultValue={form ? null : props.authority} placeholder='Certificate Authority' onChange={(e) => setAuthority(e.target.value)}/>
                </Col>
            </Form.Group>
            <Form.Group as={Row}>
                <Form.Label column sm={2}>취득 일자</Form.Label>
                <Col sm={7} onClick={form ? null : () => setForm(true)}>
                <DatePicker dateFormat="yyyy-MM-dd" placeholderText={form ? moment(props.acquisition).format('yyyy-MM-DD') : moment(acquisition).format('yyyy-MM-DD')} name='acquisition' selected={form ? acquisition : acquisition} onChange={date => setAcquisition(date)}/>
                </Col>
                <Col sm={3}>
                    {props.onUpdate ?
                    <Button type='submit'>{form ? '저장' : '삭제'}</Button> 
                    : null
                    }
                </Col>
            </Form.Group>
        </Form>
    )
}