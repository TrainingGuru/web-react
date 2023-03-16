import React, { Component, useState } from 'react';

import {Link} from "react-router-dom";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faBars, faHouseChimney, faPeopleGroup, faUser, faX, faClipboardList, faChartSimple} from "@fortawesome/free-solid-svg-icons";

import axios from 'axios';

export default class CatchUpNav extends Component
{
    constructor(props) {
        super(props);
        this.state = {
            isMenuClicked: false,
            clients: []
        };
    }

    componentDidMount()
    {
        axios.get(`https://traininggurubackend.onrender.com/Trainer/1/Clients`)
            .then(res =>
            {
                if(res.data)
                {
                    console.log("Client Data read!")
                    this.setState({clients: res.data})
                }
                else {
                    console.log("Data not Found!")
                }
            })
    }

    render()
    {
        return (
            <div className='nav-container'>
                <nav className='navbar'>
                    <div className='burger-menu' onClick={() => this.setState({ isMenuClicked: !this.state.isMenuClicked })}>
                        {this.state.isMenuClicked ? <FontAwesomeIcon className='burger-menu-icon' icon={faX}/> : <FontAwesomeIcon className='burger-menu-icon' icon={faBars}/>}
                    </div>
                    <div className='client-heading'>
                        <select id="clients">
                            { this.state.clients?.map((client) => {
                                    return <option value={`${client.ClientID}`}>{client.Name}</option>
                                })
                            }
                        </select>
                    </div>
                    
                    <div className='nav-logo-catch-up'>
                        <img className='nav-logo-image'
                            src={"https://assets.api.uizard.io/api/cdn/stream/9789bb7f-8141-48f9-87dd-f2ebdadcbec6.png"}
                            alt="logo"/>
                    </div>
                    
                </nav>

                <div className={this.state.isMenuClicked? 'nav-menu visible' : 'nav-menu hidden'}>
                    <div className='nav-link nav-button'>
                        <FontAwesomeIcon className='nav-list-icon' icon={faHouseChimney}/>
                        <Link to="/" className='nav-a' onClick={() => this.setState({ isMenuClicked: !this.state.isMenuClicked })}>HOME</Link>
                    </div>
                    <div className='nav-link'>
                        <FontAwesomeIcon className='nav-list-icon' icon={faPeopleGroup}/>
                        <Link to="/CatchUp" className='nav-a' onClick={() => this.setState({ isMenuClicked: !this.state.isMenuClicked })}>CLIENTS</Link>
                        <div className='nav-submenu'>
                            <div className='nav-submenu-link nav-button'>
                                <FontAwesomeIcon className='nav-list-icon' icon={faChartSimple}/>
                                <Link to="/CatchUp" className='nav-submenu-a' onClick={() => this.setState({ isMenuClicked: !this.state.isMenuClicked })}>CATCH UP</Link>
                            </div>
                            <div className='nav-submenu-link nav-button'>
                                <FontAwesomeIcon className='nav-list-icon' icon={faClipboardList}/>
                                <Link to="/Manage" className='nav-submenu-a' onClick={() => this.setState({ isMenuClicked: !this.state.isMenuClicked })}>MANAGE</Link>
                            </div>
                        </div>
                    </div>
                    <div className='nav-link nav-button'>
                        <FontAwesomeIcon className='nav-list-icon' icon={faUser}/>
                        <Link to="/Profile" className='nav-a' onClick={() => this.setState({ isMenuClicked: !this.state.isMenuClicked })}>PROFILE</Link>
                    </div>
                </div>
            </div>
        )
    }
}