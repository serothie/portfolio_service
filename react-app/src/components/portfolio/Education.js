import React, { useState, useEffect } from "react";
import axios from "axios"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {setCookie, getCookie, deleteCookie} from "../../utility/user-cookie";
import { Table, Row, Col, Container, Form, Button, Nav, Navbar, FormControl } from 'react-bootstrap';

const apiUrl = 'http://localhost:5000/'

export default function Education(props) {
    const [educationList, setEducationList] = useState([]);

    axios.defaults.headers.common['Authorization'] = `Bearer ${props.access_token}`;

    useEffect(() => {
        readEducation(props.userEmail);
    }, [])

    function readEducation(user) {
        axios.get(apiUrl+'portfolio/education', {
            params: {
                user_email: user
            }
        })
        .then(
            response => {
                setEducationList(response.data.result);
            }
        )
    }

    return(
        <div>
            {educationList.map((education) => 
                    <EducationForm form={false} key={education[0]} id={education[0]} university={education[1]} major={education[2]} degree={education[3]} userEmail={props.userEmail}/>
                )}
                <EducationForm form={true} userEmail={props.userEmail}/>
        </div>
    )
}

function EducationForm(props) {
    const [university, setUniversity] = useState();
    const [major, setMajor] = useState();
    const [degree, setDegree] = useState();
    const [form, setForm] = useState(props.form);

    function createEducation(e) {
        e.preventDefault();
        setUniversity(e.target.university.value);
        setMajor(e.target.major.value);
        setDegree(e.target.degree.value);
        const educationData = {
            university: university,
            major: major,
            degree: degree,
            user_email: props.userEmail
        }

        axios.post(apiUrl+'portfolio/education', educationData)
    }

    function updateEducation(e) {
        e.preventDefault();
        setUniversity(e.target.university.value);
        setMajor(e.target.major.value);
        setDegree(e.target.degree.value);
        const educationData = {
            university: university,
            major: major,
            degree: degree,
            id: e.target.id
        }

        axios.put(apiUrl+'portfolio/education', educationData);
        setForm(false);
    }
 
    function deleteEducation(e) {
        e.preventDefault();
        axios.delete(apiUrl+'portfolio/education', {
            params: {
                id: e.target.id
            }
        })
    }

    return (
        <Form id={props.id} onSubmit={form ? props.id ? (e) => updateEducation(e) : (e) => createEducation(e) : (e) => deleteEducation(e)}>
            <Form.Group as={Row} onClick={form ? null : () => setForm(true)}>
                <Form.Label column sm={2}>대학</Form.Label>
                <Col sm={10}>
                    <Form.Control type='text' name='university' defaultValue={form ? null : props.university} placeholder='University' onChange={(e) => setUniversity(e.target.value)}/>
                </Col>
            </Form.Group>
    
            <Form.Group as={Row} onClick={form ? null : () => setForm(true)}>
                <Form.Label column sm={2}>전공</Form.Label>
                <Col sm={10}>
                    <Form.Control type='text' name='major' defaultValue={form ? null : props.major} placeholder='Major' onChange={(e) => setMajor(e.target.value)}/>
                </Col>
            </Form.Group>
    
            <fieldset>
                <Form.Group as={Row}>
                    <Form.Label column sm={2}>
                        학위
                    </Form.Label>
                    <Col sm={7} onClick={form ? null : () => setForm(true)}>
                        {form ?
                        <>
                        <Form.Check inline type='radio' defaultChecked={props.degree==='학사'} name='degree' label='학사' value='학사' onChange={(e) => setDegree(e.target.value)} />
                        <Form.Check inline type='radio' defaultChecked={props.degree==='석사'} name='degree' label='석사' value='석사' onChange={(e) => setDegree(e.target.value)} />
                        <Form.Check inline type='radio' defaultChecked={props.degree==='박사'} name='degree' label='박사' value='박사' onChange={(e) => setDegree(e.target.value)} />
                        </> :
                        <>
                        <Form.Control type='text' name='degree' defaultValue={props.degree} />
                        </>
                        }
                    </Col>
                    <Col sm={3}>
                        
                        <Button type='submit'>{form ? '저장' : '삭제'}</Button> 
                       
                    </Col>
                </Form.Group>
            </fieldset>
        </Form>
    )
}