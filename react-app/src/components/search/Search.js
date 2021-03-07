import React, { createContext, useState, useEffect } from "react";
import axios from "axios"
import Education from '../portfolio/Education';
import Award from '../portfolio/Award';
import Project from '../portfolio/Project';
import Certificate from '../portfolio/Certificate';
import {setCookie, getCookie, deleteCookie} from "../../utility/user-cookie";
import { ListGroup, ListGroupItem, Card, Row, Col, Container, Form, Button, Nav, Navbar, FormControl } from 'react-bootstrap';

const apiUrl = 'http://localhost:5000/'

var passwordValidator = require('password-validator');
var schema_search = new passwordValidator();

schema_search
.is().min(2)

export function Search(props) {

    function searchUser(e) {
        e.preventDefault();
        if (!schema_search.validate(e.target.searchInfo.value)) {
            alert('검색어는 최소 2글자 이상 입력해야 합니다.')
        } else {
            props.setSearchInfo(e.target.searchInfo.value)
        }
    }   

    return(
        <Form inline onSubmit={(e) => searchUser(e)}>
            <FormControl required={true} name='searchInfo' type="text" placeholder="Search Other Portfolios" className="mr-sm-2" onChange={(e) => props.setSearchInfo(e.target.value)}/>
            <Button onClick={props.setSearchForm}type='submit' variant="light">Search</Button>
        </Form>
    )
}

export function SearchArea(props) {
    const [searchedList, setSearchedList] = useState([]);
    const [viewInfo, setViewInfo] = useState(false);
    const [userEmail, setUserEmail] = useState();

    axios.defaults.headers.common['Authorization'] = `Bearer ${props.access_token}`;

    useEffect(() => {
        axios.get(apiUrl+'search', {
            params: {
                user_name: props.searchInfo
            }
        })
        .then(
            response => setSearchedList(response.data.result)
        )
    }, [])

    function viewUser(user_email) {
        setViewInfo(true);
        setUserEmail(user_email)
    }

    return (
        
        viewInfo
        ?
        <>
        <h3>학력</h3>
        <Education userEmail={userEmail} access_token={props.access_token} onUpdate={false}/>
        <h3>수상 이력</h3>
        <Award userEmail = {userEmail} access_token = {props.access_token} onUpdate={false}/>
        <h3>프로젝트</h3>
        <Project userEmail = {userEmail} access_token = {props.access_token} onUpdate={false}/>
        <h3>자격증</h3>
        <Certificate userEmail = {userEmail} access_token = {props.access_token} onUpdate={false}/>
        </>
        :
        <>
            {searchedList === 'no infos' ? 
            '검색 결과가 없습니다.'
            : 
            searchedList.map(
                users => <SearchForm user_name={users[1]} user_email={users[2]} viewUser={viewUser}/>
            )}
        </>
        
    )
}

function SearchForm(props) {
    return(
        <Card>
        <Card.Img variant="top" src="holder.js/100px180?text=Image cap" />
        <Card.Body>
            <Card.Title>{props.user_name}</Card.Title>
            <Card.Text>
            Some quick example text to build on the card title and make up the bulk of
            the card's content.
            </Card.Text>
        </Card.Body>
        {/* <ListGroup className="list-group-flush">
            <ListGroupItem>Cras justo odio</ListGroupItem>
            <ListGroupItem>Dapibus ac facilisis in</ListGroupItem>
            <ListGroupItem>Vestibulum at eros</ListGroupItem>
        </ListGroup> */}
        <Card.Body>
            <Card.Link onClick={(e) => {e.preventDefault(); props.viewUser(props.user_email)}}>View User Information</Card.Link>
        </Card.Body>
        </Card>
    )
}