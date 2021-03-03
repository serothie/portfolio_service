import React, { useState, useEffect } from "react";
import axios from "axios"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {setCookie, getCookie, deleteCookie} from "../utility/user-cookie";
import { Table, Row, Col, Container, Form, Button, Nav, Navbar, FormControl } from 'react-bootstrap';

const apiUrl = 'http://localhost:5000/'

function Education(props) {
    const [university, setUniversity] = useState();
    const [major, setMajor] = useState();
    const [degree, setDegree] = useState();
    const [educationInfo, setEducationInfo] = useState();
    const [updating, setUpdating] = useState();
    const [form, setForm] = useState();
    const educations = [];

    useEffect(() => {
        axios.get(apiUrl + 'portfolio/education', {
            params: {
                user_email: props.userEmail
            }
        })
        .then(response => {
            response.data.result.map(function(data) {
                if (props.updating) {
                    educations.push(
                        <tr>
                          <td>{data[1]}</td>
                          <td>{data[2]}</td>
                          <td>{data[3]}</td>
                          <td>
                            <Button name={data[0]} onClick={updateEducation}>수정</Button>
                            <Button name={data[0]} onClick={deleteEducation}>삭제</Button>
                          </td>
                        </tr>
                    );
                    setUpdating(<td>비고</td>);
                    setForm(
                        <>
                        학력 정보 추가
                        <Form onSubmit={submitEducation}>
                        <Form.Group controlId="formBasicUniversity">
                            <Form.Label>학교</Form.Label>
                            <Form.Control type="text" name='university' onChange={(e) => setUniversity(e.target.value)}placeholder="University" />
                        </Form.Group>

                        <Form.Group controlId="formBasicMajor">
                            <Form.Label>전공</Form.Label>
                            <Form.Control type="text" name='major' onChange={(e) => setMajor(e.target.value)}placeholder="Major" />
                        </Form.Group>

                        <Form.Group controlId="formBasicMajor">
                            <Form.Label>학위</Form.Label>
                            <div>
                                <Form.Check inline name='degree' label="학사" type='radio' value='학사' onChange={(e) => setDegree(e.target.value)}/>
                                <Form.Check inline name='degree' label="석사" type='radio' value='석사' onChange={(e) => setDegree(e.target.value)}/>
                                <Form.Check inline name='degree' label="박사" type='radio' value='박사' onChange={(e) => setDegree(e.target.value)}/>
                            </div>
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                        </Form>
                        </>
                    )
                } else {
                    educations.push(
                        <tr>
                          <td>{data[1]}</td>
                          <td>{data[2]}</td>
                          <td>{data[3]}</td>
                        </tr>
                    );
                    setUpdating(null);
                    setForm(null);
                }
            });
            setEducationInfo(educations);
        })
    }, [educationInfo])

    function submitEducation(e) {
        e.preventDefault();
        setUniversity(e.target.university.value);
        setMajor(e.target.major.value);
        setDegree(e.target.degree.value);

        const educationData = {
            university: university,
            major: major,
            degree: degree,
            user_email: props.userEmail
        };

        axios.post(apiUrl+'portfolio/education', educationData, {
            headers: {
                Authorization: `Bearer ${props.access_token}`
            }
        })
    }

    function updateEducation(e) {
        
    }

    function deleteEducation(e) {
        axios.delete(apiUrl+'portfolio/education', {
            params: {
                id: e.target.name
            }
        })
    }

    return (
        <Container>
            학력 정보
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>학교</th>
                  <th>전공</th>
                  <th>학위</th>
                  {updating}
                </tr>
              </thead>
              <tbody>
                {educationInfo}
              </tbody>
            </Table>
            {form}
        </Container>
    )
}

function Award() {
    const [award, setAward] = useState();
    const [details, setDetails] = useState();

    function submitAwardInfo(e) {
        e.preventDefault();
        setAward(e.target.award.value);
        setDetails(e.target.details.value);
        let awardData = {
            award: award,
            details: details
        }
    }

    return(
        <div>
            수상 이력
            <form onSubmit={submitAwardInfo}>
                <label>수상 내역: <input type='text' name='award' onChange = {(e) => setAward(e.target.value)}/></label>
                <label>상세 내역: <input type='textarea' name='details' onChange = {(e) => setDetails(e.target.value)}/></label>
                <input type='submit' value='수상 이력 제출'/>
            </form>
        </div>
    )
}

function Project() {
    const [project, setProject] = useState();
    const [details, setDetails] = useState();
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();

    function submitProjectInfo(e) {
        e.preventDefault();
        setProject(e.target.project.value);
        setDetails(e.target.details.value);
    }

    return(
        <div>
            프로젝트
            <form onSubmit={submitProjectInfo}>
                <label>프로젝트 이름: <input type='text' name='project' onChange={(e) => setProject(e.target.value)}/></label>
                <label>상세 내역: <input type='textarea' name='details' onChange={(e) => setDetails(e.target.value)}/></label>
                프로젝트 기간
                    <div>
                        <label>시작일: <DatePicker selected={startDate} onChange={date => setStartDate(date)}/></label>
                        <label>종료일: <DatePicker selected={endDate} onChange={date => setEndDate(date)}/></label>
                    </div>
                <input type='submit' value='프로젝트 제출' />
            </form>
        </div>
    )
}

function Certificate() {
    const [certificate, setCertificate] = useState();
    const [authority, setAuthority] = useState();
    const [acquisition, setAcquisition] = useState();

    function submitCertificateInfo(e) {
        e.preventDefault();
        setCertificate(e.target.certificate.value);
        setAuthority(e.target.authority.value);
    }

    return(
        <div>
            자격증
            <form onSubmit={submitCertificateInfo}>
                <label>자격증 이름: <input type='text' name='certificate' onChange={(e) => setCertificate(e.target.value)}/></label>
                <label>공급 기관: <input type='text' name='authority' onChange={(e) => setAuthority(e.target.value)}/></label>
                <label>취득 일자: <DatePicker selected={acquisition} onChange={date => setAcquisition(date)}/></label>
                <input type='submit' value='자격증 제출' />
            </form>
        </div>
    )
}

export default function Portfolio() {
    const [userEmail, setUserEmail] = useState();
    const [updating, setUpdating] = useState(false);

    const access_token = getCookie('user_token');

    useEffect(() => {
        axios.get(apiUrl+'protected', {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        })
        .then(response => setUserEmail(response.data.logged_in_as));
    }, [])

    function handleRead(e) {
        e.preventDefault();
        setUpdating(false)
    }

    function handleUpdate(e) {
        e.preventDefault();
        setUpdating(true)
    }

    return (
        <Container>
          <Navbar bg="primary" variant="dark">
              <Navbar.Brand href="/">Racer Portfolio Service</Navbar.Brand>
              <Nav className="mr-auto">
                <Nav.Link onClick={handleRead}>Portfolio</Nav.Link>
                <Nav.Link onClick={handleUpdate}>Update</Nav.Link>
                <Nav.Link >Search</Nav.Link>
                <Nav.Link onClick={() => deleteCookie('user_token')}>Log Out</Nav.Link>
              </Nav>

          </Navbar>
          <Row>
            <Col xs={3}> 
              로그인 회원 정보<br/>
              프로필 이미지<br/>
              프로필 소개
            </Col>
            <Col xs={9}>
              <Education userEmail = {userEmail} access_token = {access_token} updating={updating}/>
              {/* <Award userEmail = {userEmail} access_token = {access_token}/>
              <Project userEmail = {userEmail} access_token = {access_token}/>
              <Certificate userEmail = {userEmail} access_token = {access_token}/> */}
            </Col>
          </Row>



        </Container>
    )
}

