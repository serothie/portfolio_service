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
                    <ProjectForm form={false} key={project[0]} id={project[0]} project={project[1]} details={project[2]} startDate={project[3]} endDate={project[4]}userEmail={props.userEmail}/>
                )}
                <ProjectForm form={true} userEmail={props.userEmail}/>
        </div>
    )
}

function ProjectForm(props) {
    const [project, setProject] = useState();
    const [details, setDetails] = useState();
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [form, setForm] = useState(props.form);

    function createProject(e) {
        e.preventDefault();
        setProject(e.target.project.value);
        setDetails(e.target.details.value);
        // setStartDate(e.target.startDate.value);
        // setEndDate(e.target.endDate.value);
        const projectData = {
            project: project,
            details: details,
            startDate: startDate,
            endDate: endDate,
            user_email: props.userEmail,
        }
        console.log(projectData);
        // axios.post(apiUrl+'portfolio/project', projectData)
    }
    
    function updateProject(e) {
        e.preventDefault();
        setProject(e.target.project.value);
        setDetails(e.target.details.value);
        // setStartDate(e.target.startDate.value);
        // setEndDate(e.target.endDate.value);
        const projectData = {
            project: project,
            details: details,
            startDate: startDate,
            endDate: endDate,
            user_email: props.userEmail,
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
        <Form id={props.id} onSubmit={form ? props.id ? (e) => updateProject(e) : (e) => createProject(e) : (e) => deleteProject(e)}>
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
                시작일 <DatePicker dateFormat="yyyy-MM-dd" name='startDate' selected={startDate} onChange={date => setStartDate(moment(date).format("yyyy-MM-DD"))}/>
                </Col>
                <Col sm={5}>
                종료일 <DatePicker dateFormat="yyyy-MM-dd" name='endDate' selected={endDate} onChange={date => setEndDate(date)}/>
                </Col>
            </Form.Group>
            
            <fieldset>
                <Row>
                    
                    <Col sm={9} onClick={form ? null : () => setForm(true)}>
                    </Col>
                    <Col sm={3}>
                        
                        <Button type='submit'>{form ? '저장' : '삭제'}</Button> 
                       
                    </Col>
                </Row>
            </fieldset>
        </Form>
    )
}


