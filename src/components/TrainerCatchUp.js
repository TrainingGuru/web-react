import React, { Component } from 'react';

import Nav from './Nav';

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
    render()
    {
        return (
            <div className='catchUp'>
                <Nav />
                
                {/* <select id="clients">
                    { clients?.map((client) => {
                            return <option value={`${client.ClientID}`}>{client.Name}</option>
                        })
                    }
                </select> */}
                <div className='container'>
                    <div className='fitbit-icons'>
                        <div>
                            <FontAwesomeIcon className='icon calBurnt' icon={faFire}/>
                            <div>Calories Burnt</div>
                            <div>4900kcl</div>
                        </div>
                        <div>
                            <FontAwesomeIcon className='icon waterIntake' icon={faDroplet}/>
                            <div>Water Intake</div>
                            <div>13.5L</div>
                        </div>
                        <div>
                            <FontAwesomeIcon className='icon floorsClimbed' icon={faStairs}/>
                            <div>Floors Climbed</div>
                            <div>45 Floors</div>
                        </div>
                        <div>
                            <FontAwesomeIcon className='icon activeMins' icon={faBolt}/>
                            <div>Active Minutes</div>
                            <div>420 Min</div>
                        </div>
                        <div>
                            <FontAwesomeIcon className='icon distTravelled' icon={faRoad}/>
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
                                    <div>{clientIntake?.CaloriesIntake}/{clientIntake?.TotalCalories}cal</div>
                                    <FontAwesomeIcon className='intake-table-edit-icon' icon={faPenToSquare}/>
                                    <div>Protein</div>
                                    <div>{clientIntake?.ProteinIntake}/{clientIntake?.TotalProtein}g</div>
                                    <FontAwesomeIcon className='intake-table-edit-icon' icon={faPenToSquare}/>
                                    <div>Fat</div>
                                    <div>{clientIntake?.FatsIntake}/{clientIntake?.TotalFats}g</div>
                                    <FontAwesomeIcon className='intake-table-edit-icon' icon={faPenToSquare}/>
                                    <div>Carbs</div>
                                    <div>{clientIntake?.CarbohydratesIntake}/{clientIntake?.TotalCarbohydrates}g</div>
                                    <FontAwesomeIcon className='intake-table-edit-icon' icon={faPenToSquare}/>
                                </div>
                                
                            }
                    </div>
                    <div className='progress-chart'>
                        Weight Progress Graph
                    </div>
                    <div className='goals sections'>
                        <div className='headers'>Goals</div>
                            { clientGoals?.map((goal) => {
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
                    <div className='catchup-notes sectiosn'>
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
                                        {   schedule.days?.slice(0,7).map((day) => {
                                                return <div className='slide-content'>
                                                    <div>{day.day}</div>
                                                    <div>{day.date}</div>
                                                    <div>Chest Beginner</div>
                                                    <div onClick={togglePopup}>notes</div>
                                                    <div className={isPopupClicked ? 'popup' : 'hidden'}>
                                                        This is the notes popup!
                                                        <div onClick={togglePopup}>Close</div>
                                                    </div>
                                                </div>
                                            })
                                        }
                                    </div>
                                    <div className='slide'>
                                        {   schedule.days?.slice(7,14).map((day) => {
                                                return <div className='slide-content'>
                                                    <div>{day.day}</div>
                                                    <div>{day.date}</div>
                                                    <div>Chest Beginner</div>
                                                    <div onClick={togglePopup}>notes</div>
                                                </div>
                                            })
                                        }
                                    </div>
                                    <div className='slide'>
                                        {   schedule.days?.slice(14,21).map((day) => {
                                                return <div className='slide-content'>
                                                    <div>{day.day}</div>
                                                    <div>{day.date}</div>
                                                    <div>Chest Beginner</div>
                                                    <div onClick={togglePopup}>notes</div>
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
                            {   clientPBs?.map((PB) => {
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