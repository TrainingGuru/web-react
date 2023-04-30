import React, { Component } from 'react';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';

// import Nav from './Nav'

import '../css/TrainerLogin.css';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faEnvelope} from "@fortawesome/free-solid-svg-icons/faEnvelope";
import {faLock} from "@fortawesome/free-solid-svg-icons/faLock";

export default class TrainerLogin extends Component
{

    handleLogin = () => {
        // console.log("handleLogin")
        const alertTag = document.getElementById("alert");
        let alertText = ""
        if(document.getElementById("login-email").value === "" || document.getElementById("login-password").value === ""){
            alertText += "Please enter your details"
        } else {
            alertText = ""
        }
        alertTag.innerText = alertText;
        if(alertText === "") {
            // ------------------- Login -----------------------------------
            axios.post(`https://traininggurubackend.onrender.com/Trainer/Login`, {
                    "Email": document.getElementById("login-email").value,
                    "Password": document.getElementById("login-password").value
                })
                .then(res =>
                {
                    if(res.data)
                    {
                        console.log("Logged In!");
                        // this.setState({meetings: res.data})
                        // console.log(res.data)
                        this.setSessionDetails(res.data.TrainerID);
    
                        // this.render();
                        window.location.reload();
                    }
                    else {
                        console.log("Data not Found!")
                    }
                })

        }

        
    }

    setSessionDetails(trainerID) {
        sessionStorage.setItem("LoggedIn", "true")
        sessionStorage.setItem("TrainerID", trainerID)
    }


    render()
    {
        // console.log("In Render!")
        return (
            <div className='login'>
                <div>
                    <div className='login-card'>
                        <div className='login-logo'>
                            <img className='login-logo-img' src={"https://assets.api.uizard.io/api/cdn/stream/9789bb7f-8141-48f9-87dd-f2ebdadcbec6.png"} alt="logo"/>
                        </div>
                        <div className='login-header'>
                            <h1 className='login-header-h1'>Sign In</h1>
                            <div>Please login to use application</div>
                        </div>
                        <div id='alert'></div>
                        <div className='login-form'>
                            <div className='login-item'>
                                <FontAwesomeIcon className='login-icon' icon={faEnvelope}/>
                                <input id='login-email' className='login-input' type="text" placeholder="Enter Email" required autoFocus/>
                            </div>
                            <div className='login-item'>
                                <FontAwesomeIcon className='login-icon' icon={faLock}/>
                                <input id='login-password' className='login-input' type="password" placeholder="Enter Password" required/>
                            </div>
                            <div className='login-other'>
                                <div className='login-checkbox'>
                                    <input type="checkbox" id="rememberMeCheckbox"/>
                                    <label for="rememberMeCheckbox">Remember me</label>
                                </div>
                                <a className='login-a' href="#">Forgot my password</a>
                            </div>
                            <button className='login-button' onClick={this.handleLogin}>Sign In</button>
                        </div>
                        <div className='login-footer'>
                            Don't have an account? <Link to="/Register">Create an account</Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}