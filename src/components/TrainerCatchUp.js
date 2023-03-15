import React, { Component } from 'react';

import Nav from './Nav';

import axios from 'axios';
import moment from 'moment';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronUp} from "@fortawesome/free-solid-svg-icons/faChevronUp";

import {faFire} from "@fortawesome/free-solid-svg-icons/faFire";
import {faDroplet} from "@fortawesome/free-solid-svg-icons/faDroplet";
import {faStairs} from "@fortawesome/free-solid-svg-icons/faStairs";
import {faBolt} from "@fortawesome/free-solid-svg-icons/faBolt";
import {faRoad} from "@fortawesome/free-solid-svg-icons/faRoad";

import {faCircleCheck} from "@fortawesome/free-solid-svg-icons/faCircleCheck";
import {faCircleXmark} from "@fortawesome/free-solid-svg-icons/faCircleXmark";
import { faMinus } from "@fortawesome/free-solid-svg-icons/faMinus";

import {faPenToSquare} from "@fortawesome/free-solid-svg-icons/faPenToSquare";
import { faLessThan } from '@fortawesome/free-solid-svg-icons';
import { faGreaterThan } from '@fortawesome/free-solid-svg-icons';

import barChart from '../barChart.png'

import '../css/TrainerCatchUp.css';

export default class TrainerCatchUp extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            clients: [],
            currentClientID: 1,
            goals: [],
            intake: [],
            pbs: [],
            schedule: {}
        }
    }

    handleClientChange = (event) => {
        this.setState({currentClientID: event.target.value});
        this.setState({goals: this.getClientGoals(event.target.value)});
        this.setState({intake: this.getClientIntake(event.target.value)});
    }

    componentDidMount()
    {
        // --------------------- Clients -------------------
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
        // fetch(`https://traininggurubackend.onrender.com/Trainer/1/Clients`)
        //     .then((response) => response.json())
        //     // .then((actualData) => console.log(actualData[0]))
        //     .then((actualData) => this.setState({clients: actualData}));

        // -------------------------- select -------------------------
        const clientSelect = document.getElementById("clients");
        clientSelect.addEventListener('change', this.handleClientChange);

        this.getClientGoals(this.state.currentClientID);

        this.getClientIntake(this.state.currentClientID);

        this.getClientPBs(this.state.currentClientID)

    }

    getClientGoals(currentClientID) {
        // -------------------------- goals ------------------------------
        axios.get(`https://traininggurubackend.onrender.com/Goals/${currentClientID}`)
            .then(res =>
            {
                if(res.data)
                {
                    console.log("Goals Data read!")
                    this.setState({goals: res.data})
                }
                else {
                    console.log("Data not Found!")
                }
            })
    }

    getClientIntake(currentClientID) {
        // -------------------------- intake ------------------------------
        axios.get(`https://traininggurubackend.onrender.com/Client/${currentClientID}/NutritionValue`)
        .then(res =>
        {
            if(res.data)
            {
                console.log("Intake Data read!")
                this.setState({intake: res.data})
            }
            else {
                console.log("Data not Found!")
            }
        })
    }

    getClientPBs(currentClientID) {
        // -------------------------- pbs ------------------------------
        axios.get(`https://traininggurubackend.onrender.com/PB/Client/${currentClientID}`)
            .then(res =>
            {
                if(res.data)
                {
                    console.log("PB Data read!")
                    this.setState({pbs: res.data})
                }
                else {
                    console.log("Data not Found!")
                }
            })
    }

    getSchedule() {
        // console.log("-------------------------------------");
        var date = "";
        var dateNum = "";
        var day = "";
        
        var scheduleDays = '{ "days" : [';
        // console.log("------------- Last Week ------------");         0-6
        for(var i = 7; i > 0; i--){
            date = moment().startOf('isoweek').subtract(i, 'days').format('llll');
            day = date.substring(0,3);
            scheduleDays += '{ "day" : "' + day + '",';
            if(date.substring(9,11).includes(",")){
                dateNum = date.substring(9,10);
                if(dateNum.localeCompare("1") === 0){
                    dateNum = dateNum.concat("st");
                } else if(dateNum.localeCompare("2") === 0) {
                    dateNum = dateNum.concat("nd");
                } else if(dateNum.localeCompare("3") === 0) {
                    dateNum = dateNum.concat("rd");
                } else {
                    dateNum = dateNum.concat("th");
                }
            } else {
                dateNum = date.substring(9,11);
                if(dateNum.startsWith("1")){
                    dateNum = dateNum.concat("th");
                } else {
                    if(dateNum.endsWith("1")){
                        dateNum = dateNum.concat("st");
                    } else if(dateNum.endsWith("2")) {
                        dateNum = dateNum.concat("nd");
                    } else if(dateNum.endsWith("3")) {
                        dateNum = dateNum.concat("rd");
                    } else {
                        dateNum = dateNum.concat("th");
                    }
                }
            }
            scheduleDays += ' "date" : "' + dateNum + '"},';
            
            // console.log(day + " " + dateNum);
        }
        // console.log("------------- This Week ------------");         7-13
        for(var i = 0; i < 7; i++){
            date = moment().startOf('isoweek').add(i, 'days').format('llll');
            day = date.substring(0,3);
            scheduleDays += '{ "day" : "' + day + '",';
            if(date.substring(9,11).includes(",")){
                dateNum = date.substring(9,10);
                if(dateNum.localeCompare("1") === 0){
                    dateNum = dateNum.concat("st");
                } else if(dateNum.localeCompare("2") === 0) {
                    dateNum = dateNum.concat("nd");
                } else if(dateNum.localeCompare("3") === 0) {
                    dateNum = dateNum.concat("rd");
                } else {
                    dateNum = dateNum.concat("th");
                }
            } else {
                dateNum = date.substring(9,11);
                if(dateNum.startsWith("1")){
                    dateNum = dateNum.concat("th");
                } else {
                    if(dateNum.endsWith("1")){
                        dateNum = dateNum.concat("st");
                    } else if(dateNum.endsWith("2")) {
                        dateNum = dateNum.concat("nd");
                    } else if(dateNum.endsWith("3")) {
                        dateNum = dateNum.concat("rd");
                    } else {
                        dateNum = dateNum.concat("th");
                    }
                }
                
            }
            scheduleDays += ' "date" : "' + dateNum + '"},';
            
            // console.log(day + " " + dateNum);
        }
        // console.log("------------- Next Week ------------");         14-20
        for(var i = 7; i < 14; i++){
            date = moment().startOf('isoweek').add(i, 'days').format('llll');
            day = date.substring(0,3);
            scheduleDays += '{ "day" : "' + day + '",';
            if(date.substring(9,11).includes(",")){
                dateNum = date.substring(9,10);
                if(dateNum.localeCompare("1") === 0){
                    dateNum = dateNum.concat("st");
                } else if(dateNum.localeCompare("2") === 0) {
                    dateNum = dateNum.concat("nd");
                } else if(dateNum.localeCompare("3") === 0) {
                    dateNum = dateNum.concat("rd");
                } else {
                    dateNum = dateNum.concat("th");
                }
            } else {
                dateNum = date.substring(9,11);
                if(dateNum.startsWith("1")){
                    dateNum = dateNum.concat("th");
                } else {
                    if(dateNum.endsWith("1")){
                        dateNum = dateNum.concat("st");
                    } else if(dateNum.endsWith("2")) {
                        dateNum = dateNum.concat("nd");
                    } else if(dateNum.endsWith("3")) {
                        dateNum = dateNum.concat("rd");
                    } else {
                        dateNum = dateNum.concat("th");
                    }
                }
            }
            scheduleDays += ' "date" : "' + dateNum + '"}';
            if(i!=13){
                scheduleDays += ',';
            }
            
            // console.log(day + " " + dateNum);
        }
        
        scheduleDays += ']}';
        // console.log("-------------------------------------");
        // console.log(JSON.parse(scheduleDays));
        // var schedule = JSON.parse(scheduleDays);
        this.setState({schedule: JSON.parse(scheduleDays)})
    }

    render()
    {
        return (
            <div className='catchUp'>
                <Nav />
                
                <select id="clients">
                    { this.state.clients?.map((client) => {
                            return <option value={`${client.ClientID}`}>{client.Name}</option>
                        })
                    }
                </select>
                <div className='catchUp-container'>
                    <div className='fitbit-icons'>
                        <div>
                            <FontAwesomeIcon className='fitbit-icon calBurnt' icon={faFire}/>
                            <div>Calories Burnt</div>
                            <div>4900kcl</div>
                        </div>
                        <div>
                            <FontAwesomeIcon className='fitbit-icon waterIntake' icon={faDroplet}/>
                            <div>Water Intake</div>
                            <div>13.5L</div>
                        </div>
                        <div>
                            <FontAwesomeIcon className='fitbit-icon floorsClimbed' icon={faStairs}/>
                            <div>Floors Climbed</div>
                            <div>45 Floors</div>
                        </div>
                        <div>
                            <FontAwesomeIcon className='fitbit-icon activeMins' icon={faBolt}/>
                            <div>Active Minutes</div>
                            <div>420 Min</div>
                        </div>
                        <div>
                            <FontAwesomeIcon className='fitbit-icon distTravelled' icon={faRoad}/>
                            <div>Distance Travelled</div>
                            <div>27.1km</div>
                        </div>
                    </div>
                    <div className='steps sections'>
                        <div className='headers'>Steps</div>
                        <div className='steps-content'>
                            <div className='steps-chart-container'>
                                <img className='steps-bar-chart'
                                    src={barChart}
                                    alt="Bar Chart"/>
                            </div>
                            <div className='steps-text'>
                                <div className='steps-label'>Goal:</div>
                                <div className='steps-data'>10,000</div>
                                <div><FontAwesomeIcon className='edit-icon' icon={faPenToSquare}/></div>
                            </div>
                        </div>
                    </div>
                    <div className='intake'>
                        <div className='intake-heading'>Intake</div>
                        { <div className='intake-table'>
                                    <div>Calories</div>
                                    <div>{this.state.intake?.CaloriesIntake}/{this.state.intake?.TotalCalories}cal</div>
                                    <FontAwesomeIcon className='intake-table-edit-icon' icon={faPenToSquare}/>
                                    <div>Protein</div>
                                    <div>{this.state.intake?.ProteinIntake}/{this.state.intake?.TotalProtein}g</div>
                                    <FontAwesomeIcon className='intake-table-edit-icon' icon={faPenToSquare}/>
                                    <div>Fat</div>
                                    <div>{this.state.intake?.FatsIntake}/{this.state.intake?.TotalFats}g</div>
                                    <FontAwesomeIcon className='intake-table-edit-icon' icon={faPenToSquare}/>
                                    <div>Carbs</div>
                                    <div>{this.state.intake?.CarbohydratesIntake}/{this.state.intake?.TotalCarbohydrates}g</div>
                                    <FontAwesomeIcon className='intake-table-edit-icon' icon={faPenToSquare}/>
                                </div>
                                
                            }
                    </div>
                    <div className='progress-chart'>
                        Weight Progress Graph
                    </div>
                    <div className='goals sections'>
                        <div className='headers'>Goals</div>
                            { this.state.goals?.map((goal) => {
                                return <div className='goals-entry'>
                                            {goal.Goal}
                                        </div>
                                }) 
                            }
                    </div>
                    <div className='calorie-summary'>
                        <div>M</div>
                        <div>T</div>
                        <div>W</div>
                        <div>T</div>
                        <div>F</div>
                        <div>S</div>
                        <div>S</div>

                        <FontAwesomeIcon className='check' icon={faCircleCheck}/>
                        <FontAwesomeIcon className='xmark' icon={faCircleXmark}/>
                        <FontAwesomeIcon className='check' icon={faCircleCheck}/>
                        <FontAwesomeIcon className='check' icon={faCircleCheck}/>
                        <FontAwesomeIcon className='check' icon={faCircleCheck}/>
                        <FontAwesomeIcon className='check' icon={faCircleCheck}/>
                        <FontAwesomeIcon className='dash' icon={faMinus}/>

                    </div>
                    <div className='catchup-notes sections'>
                        <div className='headers'>CatchUp Notes</div>
                        <div className='catchup-notes-textbox'>
                            <textarea></textarea>
                        </div>
                    </div>
                    <div className='schedule sections'>
                        {/* <FontAwesomeIcon icon={faLessThan}/> */}
                        <div className='headers'>Schedule</div>
                        {/* <FontAwesomeIcon icon={faGreaterThan}/> */}
                        <div className='carousel'>
                            <div className='button-left'>
                                <FontAwesomeIcon icon={faLessThan}/>
                            </div>
                            <div className='track-container'>
                                <div className='track'>
                                    <div className='slide'>
                                        {   this.state.schedule.days?.slice(0,7).map((day) => {
                                                return <div className='slide-content'>
                                                    <div>{day.day}</div>
                                                    <div>{day.date}</div>
                                                    <div>Chest Beginner</div>
                                                    {/* <div onClick={togglePopup}>notes</div>
                                                    <div className={isPopupClicked ? 'popup' : 'hidden'}>
                                                        This is the notes popup!
                                                        <div onClick={togglePopup}>Close</div>
                                                    </div> */}
                                                </div>
                                            })
                                        }
                                    </div>
                                    <div className='slide'>
                                        {   this.state.schedule.days?.slice(7,14).map((day) => {
                                                return <div className='slide-content'>
                                                    <div>{day.day}</div>
                                                    <div>{day.date}</div>
                                                    <div>Chest Beginner</div>
                                                    {/* <div onClick={togglePopup}>notes</div> */}
                                                </div>
                                            })
                                        }
                                    </div>
                                    <div className='slide'>
                                        {   this.state.schedule.days?.slice(14,21).map((day) => {
                                                return <div className='slide-content'>
                                                    <div>{day.day}</div>
                                                    <div>{day.date}</div>
                                                    <div>Chest Beginner</div>
                                                    {/* <div onClick={togglePopup}>notes</div> */}
                                                </div>
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className='button-right'>
                                <FontAwesomeIcon icon={faGreaterThan}/>
                            </div>
                            <div className='carousel-nav'>
                                <div className='carousel-nav-indicator'></div>
                                <div className='carousel-nav-indicator'></div>
                                <div className='carousel-nav-indicator'></div>
                            </div>
                        </div>
                        
                    </div>
                    <div className='personal-bests sections'>
                        <div className='headers'>Personal Bests</div>
                        <div className='personal-bests-content'>
                            {   this.state.pbs?.map((PB) => {
                                    return <div className='personal-bests-entry'>
                                        <div className='personal-bests-entry-data'>
                                            <div className='personal-bests-exercise'>{PB.Exercise.Name}</div>
                                            <div className='personal-bests-previous'>{PB.LastPB}</div>
                                            <FontAwesomeIcon className='personal-bests-icon' icon={faChevronUp}/>
                                            <div className='personal-bests-new'>{PB.PersonalBest}</div>
                                        </div>
                                    </div>
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}