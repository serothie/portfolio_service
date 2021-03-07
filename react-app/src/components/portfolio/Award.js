import React, { useState, useEffect } from "react";
import axios from "axios"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {setCookie, getCookie, deleteCookie} from "../../utility/user-cookie";
import { Table, Row, Col, Container, Form, Button, Nav, Navbar, FormControl } from 'react-bootstrap';

const apiUrl = 'http://localhost:5000/'

export default function Award(props) {
    const [awardList, setAwardList] = useState([]);

    axios.defaults.headers.common['Authorization'] = `Bearer ${props.access_token}`;

    useEffect(() => {
        readAward(props.userEmail);
    }, [])

    function readAward(user) {
        axios.get(apiUrl+'portfolio/award', {
            params: {
                user_email: user
            }
        })
        .then(
            response => {
                setAwardList(response.data.result);
            }
        )
    }

    return(
        <div>
            {awardList.map((award) => 
                    <AwardForm onUpdate={props.onUpdate} form={false} key={award[0]} id={award[0]} award={award[1]} details={award[2]} userEmail={props.userEmail}/>
                )}
                {props.onUpdate ? <AwardForm onUpdate={props.onUpdate} form={true} userEmail={props.userEmail}/> : null}
        </div>
    )
}

function AwardForm(props) {
    const [award, setAward] = useState();
    const [details, setDetails] = useState();
    const [form, setForm] = useState(props.form);

    function createAward(e) {
        e.preventDefault();
        setAward(e.target.award.value);
        setDetails(e.target.details.value);
        const awardData = {
            award: award,
            details: details,
            user_email: props.userEmail
        }
        axios.post(apiUrl+'portfolio/award', awardData)
    }
    
    function updateAward(e) {
        e.preventDefault();
        setAward(e.target.award.value);
        setDetails(e.target.details.value);
        const awardData = {
            award: award,
            details: details,
            user_email: props.userEmail,
            id: e.target.id
        }

        axios.put(apiUrl+'portfolio/award', awardData);
        setForm(false);
    }

    function deleteAward(e) {
        e.preventDefault();
        axios.delete(apiUrl+'portfolio/award', {
            params: {
                id: e.target.id
            }
        })
    }

    return(
        <Form className = {form ? 'before_register' : 'after_register'} id={props.id} onSubmit={form ? props.id ? (e) => updateAward(e) : (e) => createAward(e) : (e) => deleteAward(e)}>
            <Form.Group as={Row} onClick={form ? null : () => setForm(true)}>
                <Form.Label column sm={2}>수상 내역</Form.Label>
                <Col sm={10}>
                    <Form.Control type='text' name='award' defaultValue={form ? null : props.award} placeholder='Award name' onChange={(e) => setAward(e.target.value)}/>
                </Col>
            </Form.Group>
    
            <Form.Group as={Row} onClick={form ? null : () => setForm(true)}>
                <Form.Label column sm={2}>상세 내역</Form.Label>
                <Col sm={10}>
                    <Form.Control type='text' name='details' defaultValue={form ? null : props.details} placeholder='Award details' onChange={(e) => setDetails(e.target.value)}/>
                </Col>
            </Form.Group>
    
            <fieldset>
                <Row>
                    
                    <Col sm={9} onClick={form ? null : () => setForm(true)}>
                    </Col>
                    <Col sm={3}>
                        {props.onUpdate ?
                        <Button type='submit'>{form ? '저장' : '삭제'}</Button> 
                        : null}
                    </Col>
                </Row>
            </fieldset>
        </Form>
    )
}

