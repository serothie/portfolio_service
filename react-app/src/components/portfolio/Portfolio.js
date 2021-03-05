import React, { createContext, useState, useEffect } from "react";
import axios from "axios"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {setCookie, getCookie, deleteCookie} from "../../utility/user-cookie";
import Education from './Education';
import Award from './Award';
import Project from './Project';
import { Table, Row, Col, Container, Form, Button, Nav, Navbar, FormControl } from 'react-bootstrap';

const apiUrl = 'http://localhost:5000/'

export default function Portfolio() {
    const userEmail = getCookie('user_email')

    const access_token = getCookie('user_token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

    return (
        <Container>
          <Navbar bg="primary" variant="dark">
              <Navbar.Brand href="/">Racer Portfolio Service</Navbar.Brand>
              <Nav className="mr-auto">
                <Nav.Link >Update</Nav.Link>
                <Nav.Link >Search Others</Nav.Link>
                <Nav.Link onClick={() => {
                  deleteCookie('user_token');
                  deleteCookie('user_email')
                }}>Log Out</Nav.Link>
              </Nav>

          </Navbar>
          <Row>
            <Col xs={3}> 
              로그인 회원 정보<br/>
              프로필 이미지<br/>
              프로필 소개
            </Col>
            <Col xs={9}>
                <h3>학력</h3>
                <Education userEmail={userEmail} access_token={access_token}/>
                <h3>수상 이력</h3>
                <Award userEmail = {userEmail} access_token = {access_token}/>
                <h3>프로젝트</h3>
                <Project userEmail = {userEmail} access_token = {access_token}/>
              {/* <Certificate userEmail = {userEmail} access_token = {access_token}/> */}
            </Col>
          </Row>



        </Container>
    )
}

