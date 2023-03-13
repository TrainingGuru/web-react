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
                    <div className='card'>
                        <div className='logo'>
                            <img className='logo-img' src={"https://assets.api.uizard.io/api/cdn/stream/9789bb7f-8141-48f9-87dd-f2ebdadcbec6.png"} alt="logo"/>
                        </div>
                        <div className='header'>
                            <h1 className='header-h1'>Sign In</h1>
                            <div>Please login to use application</div>
                        </div>
                        <form className='form'>
                            <div className='item'>
                                <FontAwesomeIcon className='icon' icon={faEnvelope}/>
                                <input className='input' type="text" placeholder="Enter Email" required autoFocus/>
                            </div>
                            <div className='item'>
                                <FontAwesomeIcon className='icon' icon={faLock}/>
                                <input className='input' type="password" placeholder="Enter Password" required/>
                            </div>
                            <div className='other'>
                                <div className='checkbox'>
                                    <input type="checkbox" id="rememberMeCheckbox"/>
                                    <label for="rememberMeCheckbox">Remember me</label>
                                </div>
                                <a className='a' href="#">Forgot my password</a>
                            </div>
                            <button className='button' type="submit">Sign In</button>
                        </form>
                        <div className='footer'>
                            Don't have an account? <Link to="/registertrainer">Create an account</Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}