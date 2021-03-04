import React, { useState, useEffect } from "react";
import axios from "axios"
import {setCookie, getCookie, deleteCookie} from "../utility/user-cookie";
import { Container, Form, Button, Nav, Navbar, FormControl } from 'react-bootstrap';
import { BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";

const apiUrl = 'http://localhost:5000/'

var passwordValidator = require('password-validator');
var schema_fullname = new passwordValidator();
var schema_password1 = new passwordValidator();
var schema_password2 = new passwordValidator();
var schema_login = new passwordValidator();

schema_fullname
.has(/[가-힣|A-Z|a-z]/)

schema_password1
.is().min(10)
.has().digits(1)

schema_password2
.is().min(8)
.has().digits(1)
.has(/\W/)

schema_login
.is().min(8)

function SignUp() {
    const [fullname, setFullname] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [check, setCheck] = useState();
    const [signUpMessage, setSignUpMessage] = useState();

    function submitSignUp(e) {
      e.preventDefault();
      setFullname(e.target.fullname.value);
      setEmail(e.target.email.value);
      setPassword(e.target.password.value);
      setCheck(e.target.passwordCheck.value);

      if (!fullname || !schema_fullname.validate(fullname)) {
        setSignUpMessage(<li>올바른 이름을 입력하세요.(한글 또는 영문자)</li>)
      } else if (!email) {
        setSignUpMessage(<li>이메일(ID)을 입력하세요</li>)
      } else if (!password || !check) {
        setSignUpMessage(<li>비밀번호를 입력하세요</li>)
      } else if (password !== check) {
        setSignUpMessage(<li>비밀번호가 일치하지 않습니다.</li>)
      } else if (!(schema_password1.validate(password) || schema_password2.validate(password))) { 
        setSignUpMessage(<li>올바르지 않은 비밀번호 형식입니다.(영문, 숫자, 특수문자 중 2종류 이상 최소 10자리 또는 3종류 이상을 조합하여 최소 8자리)</li>)
      } else {
        let signUpInfo = {
          fullname: fullname,
          email: email,
          password: password
        }
        axios.post(apiUrl+'auth/signup', signUpInfo)
        .then(
          response => {
            if (response.data.result === "registered email") {
              setSignUpMessage(<li>이미 가입된 이메일입니다.</li>)
            } else {
              setSignUpMessage(<li>회원 가입되었습니다. 로그인하세요</li>)
            }
          }
        )
      }
    }
  
    return(
      
      <Container>
        <Form onSubmit = {submitSignUp}>
          <Form.Group controlId="formBasicFullname">
            <Form.Label>Fullname</Form.Label>
            <Form.Control type="text" name="email" onChange={(e) =>setEmail(e.target.value)}placeholder="Your name" />
          </Form.Group>

          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" name='password' onChange={(e) => setPassword(e.target.value)} placeholder="Enter email" />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" name='password' onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
          </Form.Group>

          <Form.Group controlId="formBasicPasswordCheck">
            <Form.Label>Password Check</Form.Label>
            <Form.Control type="password" name='passwordCheck' onChange={(e) => setPassword(e.target.value)} placeholder="Password check" />
          </Form.Group>

          <Form.Text className="text-muted">
              {signUpMessage}
          </Form.Text>

          <Button variant="primary" type="submit">
            Sign Up
          </Button>
        </Form>
      </Container>
    )
  }
  
function LogIn() {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [logInMessage, setLogInMessage] = useState();
  
  function submitLogIn(e) {
    e.preventDefault();
    setEmail(e.target.email.value);
    setPassword(e.target.password.value);
  
    if (!email) {
      setLogInMessage(<li>이메일을 입력하세요</li>)
    } else if (!password) {
      setLogInMessage(<li>비밀번호를 입력하세요</li>)
    } else {
      let logInInfo = {
        email: email,
        password: password
      }
      axios.post(apiUrl+'auth/login', logInInfo)
      .then(response => {
        if (!schema_login.validate(password)) {
          setLogInMessage(<li>비밀번호는 최소 8자리입니다.</li>)
        } else if (response.data.result === 'not registered email') {
          setLogInMessage(<li>등록되지 않은 이메일입니다.</li>)
        } else if (response.data.result === 'wrong password') {
          setLogInMessage(<li>비밀번호를 다시 확인해주세요</li>)
        } else {
          setLogInMessage(<li>로그인되었습니다.</li>);
          setCookie('user_token', response.data.access_token, 1);
        }
      })
    }
  }
    return(
      <Container>
        <Form onSubmit = {submitLogIn}>
          <Form.Group controlId="formBasicEmail"> 
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" name="email" onChange={(e) =>setEmail(e.target.value)} placeholder="Enter email" />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" name='password' onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
          </Form.Group>

          <Form.Text className="text-muted">
              {logInMessage}
          </Form.Text>

          <Button variant="primary" type="submit">
            Log In
          </Button>
        </Form>
      </Container>
    )
  }

export default function User() {
  

  

  return (
    <Container>
      <Router>
      <Navbar bg="primary" variant="dark">
        <Navbar.Brand href="/">Racer Portfolio Service</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="/signup">Sign Up</Nav.Link>
          <Nav.Link href='/login'>Log In</Nav.Link>
        </Nav>
      </Navbar>
      <hr />

      <Switch>
        <Route path="/signup">
          <SignUp />
        </Route>
        <Route path="/login">
          <LogIn />
        </Route>
      </Switch>
      </Router>
    </Container>
  )
}