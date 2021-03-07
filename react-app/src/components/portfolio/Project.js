import React, { useState, useEffect } from "react";
import axios from "axios"
import moment from 'moment';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {setCookie, getCookie, deleteCookie} from "../../utility/user-cookie";
import { Table, Row, Col, Container, Form, Button, Nav, Navbar, FormControl } from 'react-bootstrap';

const apiUrl = 'http://localhost:5000/'

export default function Project(props) {
    const [projectList, setProjectList] = useState([]);

    axios.defaults.headers.common['Authorization'] = `Bearer ${props.access_token}`;

    useEffect(() => {
        readProject(props.userEmail);
    }, [])

    function readProject(user) {
        axios.get(apiUrl+'portfolio/project', {
            params: {
                user_email: user
            }
        })
        .then(
            response => {
                setProjectList(response.data.result);
            }
        )
    }

    return(
        <div>
            {projectList.map((project) => 
                    <ProjectForm 
                        onUpdate = {props.onUpdate}
                        form={false} 
                        key={project[0]} 
                        id={project[0]} 
                        project={project[1]} 
                        details={project[2]} 
                        startDate={new Date(project[3])}
                        endDate={new Date(project[4])}
                        userEmail={props.userEmail}/>
                )}
                {props.onUpdate ? <ProjectForm 
                                    onUpdate={props.onUpdate} 
                                    form={true} 
                                    userEmail={props.userEmail}/> : null}
        </div>
    )
}

function ProjectForm(props) {
    const [project, setProject] = useState();
    const [details, setDetails] = useState();
    const [startDate, setStartDate] = useState(props.startDate);
    const [endDate, setEndDate] = useState(props.endDate);
    const [form, setForm] = useState(props.form);

    function createProject(e) {
        e.preventDefault();
        setProject(e.target.project.value);
        setDetails(e.target.details.value);
        const projectData = {
            project: project,
            details: details,
            startDate: moment(startDate).format("yyyy-MM-DD"),
            endDate: moment(endDate).format("yyyy-MM-DD"),
            user_email: props.userEmail
        }
        axios.post(apiUrl+'portfolio/project', projectData)
    }
    
    function updateProject(e) {
        e.preventDefault();
        setProject(e.target.project.value);
        setDetails(e.target.details.value);
        const projectData = {
            project: project,
            details: details,
            startDate: moment(startDate).format("yyyy-MM-DD"),
            endDate: moment(endDate).format("yyyy-MM-DD"),
            user_email: props.userEmail,
            id: e.target.id
        }

        axios.put(apiUrl+'portfolio/project', projectData);
        setForm(false);
    }

    function deleteProject(e) {
        e.preventDefault();
        axios.delete(apiUrl+'portfolio/project', {
            params: {
                id: e.target.id
            }
        })
    }

    return(
        <Form className = {form ? 'before_register' : 'after_register'} id={props.id} onSubmit={form ? props.id ? (e) => updateProject(e) : (e) => createProject(e) : (e) => deleteProject(e)}>
            <Form.Group as={Row} onClick={form ? null : () => setForm(true)}>
                <Form.Label column sm={2}>프로젝트 이름</Form.Label>
                <Col sm={10}>
                    <Form.Control type='text' name='project' defaultValue={form ? null : props.project} placeholder='Project name' onChange={(e) => setProject(e.target.value)}/>
                </Col>
            </Form.Group>
    
            <Form.Group as={Row} onClick={form ? null : () => setForm(true)}>
                <Form.Label column sm={2}>상세 내역</Form.Label>
                <Col sm={10}>
                    <Form.Control type='text' name='details' defaultValue={form ? null : props.details} placeholder='Proect details' onChange={(e) => setDetails(e.target.value)}/>
                </Col>
            </Form.Group>
            <Form.Group as={Row} onClick={form ? null : () => setForm(true)}>
                <Form.Label column sm={2}>수행 기간</Form.Label>
                <Col sm={5}>
                시작일 <DatePicker className='project-datepicker' placeholderText={form ? moment(props.startDate).format('yyyy-MM-DD') : moment(startDate).format("yyyy-MM-DD")} dateFormat="yyyy-MM-dd" name='startDate' selected={form ? startDate : startDate} onChange={date => setStartDate(date)}/>
                </Col>
                <Col sm={5}>
                종료일 <DatePicker className='project-datepicker' placeholderText={form ? moment(props.endDate).format('yyyy-MM-DD') : moment(endDate).format("yyyy-MM-DD")} dateFormat="yyyy-MM-dd" name='endDate' selected={form ? endDate : endDate} onChange={date => setEndDate(date)}/>
                </Col>
            </Form.Group>
            
            <fieldset>
                <Row>
                    
                    <Col sm={9} onClick={form ? null : () => setForm(true)}>
                    </Col>
                    <Col sm={3}>
                        {props.onUpdate ?
                        <Button type='submit'>{form ? '저장' : '삭제'}</Button> :
                        null
                        }
                    </Col>
                </Row>
            </fieldset>
        </Form>
    )
}


