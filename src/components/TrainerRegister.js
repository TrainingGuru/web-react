import React, { Component } from 'react';

import '../css/TrainerRegister.css';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faEnvelope} from "@fortawesome/free-solid-svg-icons/faEnvelope";
import {faLock} from "@fortawesome/free-solid-svg-icons/faLock";
import {faUser} from "@fortawesome/free-solid-svg-icons/faUser";

import { Link } from "react-router-dom";

export default class TrainerRegister extends Component
{
    render()
    {
        return (
            <div className='trainer-register'>
                <div>
                    <div className='trainer-register-card'>
                        <div className='trainer-register-logo'>
                            <img className='trainer-register-logo-image' src={"https://assets.api.uizard.io/api/cdn/stream/9789bb7f-8141-48f9-87dd-f2ebdadcbec6.png"} alt="logo"/>
                        </div>
                        <div className='trainer-register-header'>
                            <h1 className='trainer-register-header-h1'>Register</h1>
                            <div>Please fill in the below information to register an account</div>
                        </div>
                        <form className='trainer-register-form'>
                            <div className='trainer-register-form-item'>
                                <FontAwesomeIcon className='trainer-register-form-item-icon' icon={faUser}/>
                                <input className='trainer-register-form-item-input' type="text" placeholder="Enter Name" required autoFocus/>
                            </div>
                            <div className='trainer-register-form-item'>
                                <FontAwesomeIcon className='trainer-register-form-item-icon' icon={faEnvelope}/>
                                <input className='trainer-register-form-item-input' type="text" placeholder="Enter Email" required/>
                            </div>
                            <div className='trainer-register-form-item'>
                                <FontAwesomeIcon className='trainer-register-form-item-icon' icon={faLock}/>
                                <input className='trainer-register-form-item-input' type="password" placeholder="Enter Password" required/>
                            </div>
                            <div className='trainer-register-form-item'>
                                <FontAwesomeIcon className='trainer-register-form-item-icon' icon={faLock}/>
                                <input className='trainer-register-form-item-input' type="password" placeholder="Confirm Password" required/>
                            </div>
                            <div className='trainer-register-form-other'>
                                By clicking 'Create Account', you agree to our <a className='trainer-register-a' href="#">Privacy Policy</a>
                            </div>
                            <button className='trainer-register-form-button' type="submit">Create Account</button>
                        </form>
                        <div className='trainer-register-footer'>
                            Already have an account? <Link to="/Login">Sign In</Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}