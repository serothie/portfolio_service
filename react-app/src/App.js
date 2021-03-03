import React, { useState, useEffect } from "react";
import './App.css';
import User from './components/User'
import Portfolio from './components/Portfolio'
import {setCookie, getCookie, deleteCookie} from "./utility/user-cookie";
import 'bootstrap/dist/css/bootstrap.min.css';
import { navBar } from 'react-bootstrap';

function App() {
  const [main, setMain] = useState(<User />);

  useEffect(() => {
    if (getCookie('user_token')) {
      setMain(<Portfolio />)
    } else {
      setMain(<User />)
    }
  }, [])

  return (
    <div>
      {main}
    </div>
  );
}

export default App;

