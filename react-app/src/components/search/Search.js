import React, { createContext, useState, useEffect } from "react";
import axios from "axios"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {setCookie, getCookie, deleteCookie} from "../../utility/user-cookie";
import { Table, Row, Col, Container, Form, Button, Nav, Navbar, FormControl } from 'react-bootstrap';

const apiUrl = 'http://localhost:5000/'

export function Search(props) {

    function searchUser(e) {
        e.preventDefault();
        props.setSearchInfo(e.target.searchInfo.value)
    }   

    return(
        <Form inline onSubmit={(e) => searchUser(e)}>
            <FormControl required={true} name='searchInfo' type="text" placeholder="Search Other Portfolios" className="mr-sm-2" onChange={(e) => props.setSearchInfo(e.target.value)}/>
            <Button onClick={props.setSearchForm}type='submit' variant="light">Search</Button>
        </Form>
    )
}

export function SearchArea(props) {

    axios.defaults.headers.common['Authorization'] = `Bearer ${props.access_token}`;

    return (
        <div>
            searchedInfo
        </div>
    )
}