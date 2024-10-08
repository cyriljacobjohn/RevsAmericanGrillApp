import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Manager from './Pages/manager';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Server from './Pages/server';
import Customer from './Pages/customer';
import { GoogleOAuthProvider } from '@react-oauth/google';

const googleClientId = "862219696784-jgurkbjugk2pm4k1pppsi7ah0o40q0gg.apps.googleusercontent.com"; //process.env.REACT_APP_GOOGLE_CLIENT_ID;

ReactDOM.render(
  <BrowserRouter>
    {/* <App /> */}
    <Routes>
      <Route exact path="/" element={<GoogleOAuthProvider clientId={googleClientId}><App /></GoogleOAuthProvider>}/>
      <Route path="/manager" element={<Manager />}/>
      <Route path="/server" element={<Server />}/>
      <Route path="/customer" element={<Customer />}/>
    </Routes>
  </BrowserRouter>,
  // <App />,
  // <a>test</a>,
  document.getElementById("root")
);

  
