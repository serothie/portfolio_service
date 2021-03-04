import React, { useState, useEffect } from "react";
import axios from "axios"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {setCookie, getCookie, deleteCookie} from "../utility/user-cookie";
import { Table, Row, Col, Container, Form, Button, Nav, Navbar, FormControl } from 'react-bootstrap';

const apiUrl = 'http://localhost:5000/'

function Education(props) {
    // const [university, setUniversity] = useState();
    // const [major, setMajor] = useState();
    // const [degree, setDegree] = useState();
    const educationInfo = [];
    const [education, setEducation] = useState();
    axios.defaults.headers.common['Authorization'] = `Bearer ${props.access_token}`;

    useEffect(() => {
        axios.get(apiUrl+'portfolio/education', {
            params: {
                user_email : props.userEmail
            }
        })
        .then(response => {
            response.data.result.map(
                (data) => {
                    educationInfo.push(
                        <EducationForm key={data[0]} form={false} university={data[1]} major={data[2]} degree={data[3]} />
                    );
                    setEducation(educationInfo);
                }
            )
        })
    }, [])


    // function createEducation(e) {
    //     e.preventDefault();
    //     setUniversity(e.target.university.value);
    //     setMajor(e.target.major.value);
    //     setDegree(e.target.degree.value)
    //     const educationData = {
    //         university: university,
    //         major: major,
    //         degree: degree,
    //         user_email: props.userEmail
    //     }

    //     axios.post(apiUrl+'portfolio/education', educationData)
    // }

    // function updateEducation(target) {
        
    // }
 
    // function deleteEducation(target) {
    //     axios.delete(apiUrl+'portfolio/education', {
    //         params: {
    //             id: target
    //         }
    //     })
    // }

    return (
        <Container>
            {education}
            <EducationForm form={true}/>
        </Container>
    )
}

function EducationForm(props) {
    const [university, setUniversity] = useState();
    const [major, setMajor] = useState();
    const [degree, setDegree] = useState();
    const [form, setForm] = useState(props.form);

    return (
        <Form id={props.id} onClick={form ? null : () => setForm(true)}>
            <Form.Group as={Row} >
                <Form.Label column sm={2}>대학</Form.Label>
                <Col sm={10}>
                    <Form.Control  type='text' name='university' value={form ? null : props.university} placeholder='University' onChange={(e) => setUniversity(e.target.value)}/>
                </Col>
            </Form.Group>
    
            <Form.Group as={Row}>
                <Form.Label column sm={2}>전공</Form.Label>
                <Col sm={10}>
                    <Form.Control  type='text' name='major' value={form ? null : props.major} placeholder='Major' onChange={(e) => setMajor(e.target.value)}/>
                </Col>
            </Form.Group>
    
            <fieldset>
                <Form.Group as={Row} >
                    <Form.Label column sm={2}>
                        학위
                    </Form.Label>
                    <Col sm={7}>
                        
                        <div>
                        <Form.Check inline type='radio' name='degree' label='학사' value='학사' onChange={(e) => setDegree(e.target.value)} />
                        <Form.Check inline type='radio' name='degree' label='석사' value='석사' onChange={(e) => setDegree(e.target.value)} />
                        <Form.Check inline type='radio' name='degree' label='박사' value='박사' onChange={(e) => setDegree(e.target.value)} />
                        </div>
                    
                        
                        
                    </Col>
                    <Col sm={3}>
                        
                        <Button type='submit'>{form ? '저장' : '삭제'}</Button> 
                       
                    </Col>
                </Form.Group>
            </fieldset>
        </Form>
    )
}

// function Award() {
//     const [award, setAward] = useState();
//     const [details, setDetails] = useState();

//     function submitAwardInfo(e) {
//         e.preventDefault();
//         setAward(e.target.award.value);
//         setDetails(e.target.details.value);
//         let awardData = {
//             award: award,
//             details: details
//         }
//     }

//     return(
//         <div>
//             수상 이력
//             <form onSubmit={submitAwardInfo}>
//                 <label>수상 내역: <input type='text' name='award' onChange = {(e) => setAward(e.target.value)}/></label>
//                 <label>상세 내역: <input type='textarea' name='details' onChange = {(e) => setDetails(e.target.value)}/></label>
//                 <input type='submit' value='수상 이력 제출'/>
//             </form>
//         </div>
//     )
// }

// function Project() {
//     const [project, setProject] = useState();
//     const [details, setDetails] = useState();
//     const [startDate, setStartDate] = useState();
//     const [endDate, setEndDate] = useState();

//     function submitProjectInfo(e) {
//         e.preventDefault();
//         setProject(e.target.project.value);
//         setDetails(e.target.details.value);
//     }

//     return(
//         <div>
//             프로젝트
//             <form onSubmit={submitProjectInfo}>
//                 <label>프로젝트 이름: <input type='text' name='project' onChange={(e) => setProject(e.target.value)}/></label>
//                 <label>상세 내역: <input type='textarea' name='details' onChange={(e) => setDetails(e.target.value)}/></label>
//                 프로젝트 기간
//                     <div>
//                         <label>시작일: <DatePicker selected={startDate} onChange={date => setStartDate(date)}/></label>
//                         <label>종료일: <DatePicker selected={endDate} onChange={date => setEndDate(date)}/></label>
//                     </div>
//                 <input type='submit' value='프로젝트 제출' />
//             </form>
//         </div>
//     )
// }

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

export default function Portfolio() {
    const [userEmail, setUserEmail] = useState();

    const access_token = getCookie('user_token');

    useEffect(() => {
        axios.get(apiUrl+'protected', {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        })
        .then(response => setUserEmail(response.data.logged_in_as));
    }, [])

    return (
        <Container>
          <Navbar bg="primary" variant="dark">
              <Navbar.Brand href="/">Racer Portfolio Service</Navbar.Brand>
              <Nav className="mr-auto">
                <Nav.Link >My Portfolio</Nav.Link>
                <Nav.Link >Search Others</Nav.Link>
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
              <Education userEmail = {userEmail} access_token = {access_token}/>
              {/* <Award userEmail = {userEmail} access_token = {access_token}/>
              <Project userEmail = {userEmail} access_token = {access_token}/>
              <Certificate userEmail = {userEmail} access_token = {access_token}/> */}
            </Col>
          </Row>



        </Container>
    )
}

