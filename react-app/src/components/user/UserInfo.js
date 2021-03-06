import React, { createContext, useState, useEffect } from "react";
import axios from "axios"
import {setCookie, getCookie, deleteCookie} from "../../utility/user-cookie";
import { Table, Row, Col, Container, Form, Button, Nav, Navbar, FormControl } from 'react-bootstrap';

const apiUrl = 'http://localhost:5000/'

export default function UserInfo(props) {
    const [userName, setUserName] = useState();

    axios.defaults.headers.common['Authorization'] = `Bearer ${props.access_token}`;

    useEffect(() => {
        readUserInfo(props.userEmail)
    }, [])

    function readUserInfo(user) {
        axios.get(apiUrl+'auth/login' , {
            params: {
                email: user
            }
        })
        .then(response => setUserName(response.data.user_name))
    }
    return(
        <div>
            {userName}
        </div>
    )
}