import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// import Nav from './Nav'

import '../css/TrainerLogin.css';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faEnvelope} from "@fortawesome/free-solid-svg-icons/faEnvelope";
import {faLock} from "@fortawesome/free-solid-svg-icons/faLock";

export default class TrainerLogin extends Component
{
    render()
    {
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
                        <form className='login-form'>
                            <div className='login-item'>
                                <FontAwesomeIcon className='login-icon' icon={faEnvelope}/>
                                <input className='login-input' type="text" placeholder="Enter Email" required autoFocus/>
                            </div>
                            <div className='login-item'>
                                <FontAwesomeIcon className='login-icon' icon={faLock}/>
                                <input className='login-input' type="password" placeholder="Enter Password" required/>
                            </div>
                            <div className='login-other'>
                                <div className='login-checkbox'>
                                    <input type="checkbox" id="rememberMeCheckbox"/>
                                    <label for="rememberMeCheckbox">Remember me</label>
                                </div>
                                <a className='login-a' href="#">Forgot my password</a>
                            </div>
                            <button className='login-button' type="submit"><Link to="/">Sign In</Link></button>
                        </form>
                        <div className='login-footer'>
                            Don't have an account? <Link to="/Register">Create an account</Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}