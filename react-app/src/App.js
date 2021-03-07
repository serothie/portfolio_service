import React, { useState, useEffect } from "react";
import './App.css';
import User from './components/user/User'
import Portfolio from './components/portfolio/Portfolio'
import {setCookie, getCookie, deleteCookie} from "./utility/user-cookie";
import 'bootstrap/dist/css/bootstrap.min.css';
import { navBar } from 'react-bootstrap';
import { BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";

function App() {
  const [mainIsUser, setMainIsUser] = useState(true);

  useEffect(() => {
    if (getCookie('user_token')) {
      setMainIsUser(false) 
    } else {
      setMainIsUser(true)
    }
  }, [mainIsUser])

  return (
    <div>
      {mainIsUser ? <User /> : <Portfolio />}
    </div>
  );
}

export default App;

