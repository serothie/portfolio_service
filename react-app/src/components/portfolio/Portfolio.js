import React, { createContext, useState, useEffect } from "react";
import axios from "axios"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {setCookie, getCookie, deleteCookie} from "../../utility/user-cookie";
import Education from './Education';
import Award from './Award';
import Project from './Project';
import Certificate from './Certificate';
import { Search, SearchArea } from '../search/Search';
import UserInfo from '../user/UserInfo';
import { Table, Row, Col, Container, Form, Button, Nav, Navbar, FormControl } from 'react-bootstrap';

const apiUrl = 'http://localhost:5000/'

export default function Portfolio() {
    const userEmail = getCookie('user_email')
    const access_token = getCookie('user_token');

    const [searchForm, setSearchForm] = useState(false);
    const [update, setUpdate] = useState(false);
    const [searchInfo, setSearchInfo] = useState();

    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

    return (
        <Container>
          <Navbar bg="primary" variant="dark">
              <Navbar.Brand href="/">Racer Portfolio Service</Navbar.Brand>
              <Nav className="mr-auto">
                <Nav.Link onClick={() => {setUpdate(false); setSearchForm(false)}}>My Portfolio</Nav.Link>
                <Nav.Link onClick={() => {setUpdate(true); setSearchForm(false)}}>Update</Nav.Link>
                <Nav.Link onClick={() => {
                  deleteCookie('user_token');
                  deleteCookie('user_email')
                }}>Log Out</Nav.Link>
              </Nav>
              <Search access_token={access_token} setSearchForm={setSearchForm} setSearchInfo={setSearchInfo}/>
          </Navbar>
          <Row>
            <Col xs={3}> 
              <UserInfo userEmail={userEmail} access_token={access_token}/>
            </Col>
            <Col xs={9}>
                {searchForm
                ?
                <>
                <SearchArea searchInfo={searchInfo}/>
                </>
                :
                <>
                <h3>학력</h3>
                <Education userEmail={userEmail} access_token={access_token} onUpdate={update}/>
                <h3>수상 이력</h3>
                <Award userEmail = {userEmail} access_token = {access_token} onUpdate={update}/>
                <h3>프로젝트</h3>
                <Project userEmail = {userEmail} access_token = {access_token} onUpdate={update}/>
                <h3>자격증</h3>
                <Certificate userEmail = {userEmail} access_token = {access_token} onUpdate={update}/>
                </>
                }
            </Col>
          </Row>



        </Container>
    )
}

