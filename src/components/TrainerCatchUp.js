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
                    <div style={styles.trainerClients.container.fitbitIcons}>
                        <div>
                            <FontAwesomeIcon style={{...styles.trainerClients.container.fitbitIcons.icon, ...styles.trainerClients.container.fitbitIcons.icon.calBurnt}} icon={faFire}/>
                            <div>Calories Burnt</div>
                            <div>4900kcl</div>
                        </div>
                        <div>
                            <FontAwesomeIcon style={{...styles.trainerClients.container.fitbitIcons.icon, ...styles.trainerClients.container.fitbitIcons.icon.waterIntake}} icon={faDroplet}/>
                            <div>Water Intake</div>
                            <div>13.5L</div>
                        </div>
                        <div>
                            <FontAwesomeIcon style={{...styles.trainerClients.container.fitbitIcons.icon, ...styles.trainerClients.container.fitbitIcons.icon.floorsClimbed}} icon={faStairs}/>
                            <div>Floors Climbed</div>
                            <div>45 Floors</div>
                        </div>
                        <div>
                            <FontAwesomeIcon style={{...styles.trainerClients.container.fitbitIcons.icon, ...styles.trainerClients.container.fitbitIcons.icon.activeMins}} icon={faBolt}/>
                            <div>Active Minutes</div>
                            <div>420 Min</div>
                        </div>
                        <div>
                            <FontAwesomeIcon style={{...styles.trainerClients.container.fitbitIcons.icon, ...styles.trainerClients.container.fitbitIcons.icon.distTravelled}} icon={faRoad}/>
                            <div>Distance Travelled</div>
                            <div>27.1km</div>
                        </div>
                    </div>
                    <div style={{...styles.trainerClients.container.steps, ...styles.trainerClients.container.sections}}>
                        <div style={styles.trainerClients.container.headers}>Steps</div>
                        <div style={styles.trainerClients.container.steps.content}>
                            <div style={styles.trainerClients.container.steps.content.imgContainer}>
                                <img style={styles.trainerClients.container.steps.content.imgContainer.img}
                                    src={barChart}
                                    alt="Bar Chart"/>
                            </div>
                            <div style={styles.trainerClients.container.steps.content.text}>
                                <div style={styles.trainerClients.container.steps.content.text.label}>Goal:</div>
                                <div style={styles.trainerClients.container.steps.content.text.data}>10,000</div>
                                <div><FontAwesomeIcon style={styles.trainerClients.container.steps.content.text.editIcon} icon={faPenToSquare}/></div>
                            </div>
                        </div>
                    </div>
                    <div style={styles.trainerClients.container.intake}>
                        <div style={styles.trainerClients.container.intake.heading}>Intake</div>
                        { <div style={styles.trainerClients.container.intake.table}>
                                    <div>Calories</div>
                                    <div>{clientIntake?.CaloriesIntake}/{clientIntake?.TotalCalories}cal</div>
                                    <FontAwesomeIcon style={styles.trainerClients.container.intake.table.editIcon} icon={faPenToSquare}/>
                                    <div>Protein</div>
                                    <div>{clientIntake?.ProteinIntake}/{clientIntake?.TotalProtein}g</div>
                                    <FontAwesomeIcon style={styles.trainerClients.container.intake.table.editIcon} icon={faPenToSquare}/>
                                    <div>Fat</div>
                                    <div>{clientIntake?.FatsIntake}/{clientIntake?.TotalFats}g</div>
                                    <FontAwesomeIcon style={styles.trainerClients.container.intake.table.editIcon} icon={faPenToSquare}/>
                                    <div>Carbs</div>
                                    <div>{clientIntake?.CarbohydratesIntake}/{clientIntake?.TotalCarbohydrates}g</div>
                                    <FontAwesomeIcon style={styles.trainerClients.container.intake.table.editIcon} icon={faPenToSquare}/>
                                </div>
                                
                            }
                    </div>
                    <div style={styles.trainerClients.container.progressChart}>
                        Weight Progress Graph
                    </div>
                    <div style={{...styles.trainerClients.container.goals, ...styles.trainerClients.container.sections}}>
                        <div style={styles.trainerClients.container.headers}>Goals</div>
                            { clientGoals?.map((goal) => {
                                return <div style={styles.trainerClients.container.goals.entry}>
                                            {goal.Goal}
                                        </div>
                                }) 
                            }
                    </div>
                    <div style={styles.trainerClients.container.calorieSummary}>
                        <div>M</div>
                        <div>T</div>
                        <div>W</div>
                        <div>T</div>
                        <div>F</div>
                        <div>S</div>
                        <div>S</div>

                        <FontAwesomeIcon style={styles.trainerClients.container.calorieSummary.icon.check} icon={faCircleCheck}/>
                        <FontAwesomeIcon style={styles.trainerClients.container.calorieSummary.icon.xmark} icon={faCircleXmark}/>
                        <FontAwesomeIcon style={styles.trainerClients.container.calorieSummary.icon.check} icon={faCircleCheck}/>
                        <FontAwesomeIcon style={styles.trainerClients.container.calorieSummary.icon.check} icon={faCircleCheck}/>
                        <FontAwesomeIcon style={styles.trainerClients.container.calorieSummary.icon.check} icon={faCircleCheck}/>
                        <FontAwesomeIcon style={styles.trainerClients.container.calorieSummary.icon.check} icon={faCircleCheck}/>
                        <FontAwesomeIcon style={styles.trainerClients.container.calorieSummary.icon.dash} icon={faMinus}/>

                    </div>
                    <div style={{...styles.trainerClients.container.catchUpNotes, ...styles.trainerClients.container.sections}}>
                        <div style={styles.trainerClients.container.headers}>CatchUp Notes</div>
                        <div style={styles.trainerClients.container.catchUpNotes.textBox}>
                            <textarea></textarea>
                        </div>
                    </div>
                    <div style={{...styles.trainerClients.container.schedule, ...styles.trainerClients.container.sections}}>
                        {/* <FontAwesomeIcon icon={faLessThan}/> */}
                        <div style={styles.trainerClients.container.headers}>Schedule</div>
                        {/* <FontAwesomeIcon icon={faGreaterThan}/> */}
                        <div style={styles.trainerClients.container.schedule.content.carousel}>
                            <div style={styles.trainerClients.container.schedule.content.carousel.button.left}>
                                <FontAwesomeIcon icon={faLessThan}/>
                            </div>
                            <div style={styles.trainerClients.container.schedule.content.carousel.trackContainer}>
                                <div style={styles.trainerClients.container.schedule.content.carousel.trackContainer.track}>
                                    <div style={styles.trainerClients.container.schedule.content.carousel.trackContainer.track.slide}>
                                        {   schedule.days?.slice(0,7).map((day) => {
                                                return <div style={styles.trainerClients.container.schedule.content.carousel.trackContainer.track.slide.content}>
                                                    <div>{day.day}</div>
                                                    <div>{day.date}</div>
                                                    <div>Chest Beginner</div>
                                                    <div onClick={togglePopup}>notes</div>
                                                    <div style={isPopupClicked ? styles.trainerClients.container.schedule.content.popup : styles.trainerClients.container.schedule.content.hidden}>
                                                        This is the notes popup!
                                                        <div onClick={togglePopup}>Close</div>
                                                    </div>
                                                </div>
                                            })
                                        }
                                    </div>
                                    <div style={styles.trainerClients.container.schedule.content.carousel.trackContainer.track.slide}>
                                        {   schedule.days?.slice(7,14).map((day) => {
                                                return <div style={styles.trainerClients.container.schedule.content.carousel.trackContainer.track.slide.content}>
                                                    <div>{day.day}</div>
                                                    <div>{day.date}</div>
                                                    <div>Chest Beginner</div>
                                                    <div onClick={togglePopup}>notes</div>
                                                </div>
                                            })
                                        }
                                    </div>
                                    <div style={styles.trainerClients.container.schedule.content.carousel.trackContainer.track.slide}>
                                        {   schedule.days?.slice(14,21).map((day) => {
                                                return <div style={styles.trainerClients.container.schedule.content.carousel.trackContainer.track.slide.content}>
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
                            <div style={styles.trainerClients.container.schedule.content.carousel.button.right}>
                                <FontAwesomeIcon icon={faGreaterThan}/>
                            </div>
                            <div style={styles.trainerClients.container.schedule.content.carousel.nav}>
                                <div style={styles.trainerClients.container.schedule.content.carousel.nav.indicator}></div>
                                <div style={styles.trainerClients.container.schedule.content.carousel.nav.indicator}></div>
                                <div style={styles.trainerClients.container.schedule.content.carousel.nav.indicator}></div>
                            </div>
                        </div>
                        
                    </div>
                    <div style={{...styles.trainerClients.container.personalBests, ...styles.trainerClients.container.sections}}>
                        <div style={styles.trainerClients.container.headers}>Personal Bests</div>
                        <div style={styles.trainerClients.container.personalBests.content}>
                            {   clientPBs?.map((PB) => {
                                    return <div style={styles.trainerClients.container.personalBests.content.entry}>
                                        <div style={styles.trainerClients.container.personalBests.content.entry.data}>
                                            <div style={styles.trainerClients.container.personalBests.content.entry.data.exercise}>{PB.Exercise.Name}</div>
                                            <div style={styles.trainerClients.container.personalBests.content.entry.data.previous}>{PB.LastPB}</div>
                                            <FontAwesomeIcon style={styles.trainerClients.container.personalBests.content.entry.data.icon} icon={faChevronUp}/>
                                            <div style={styles.trainerClients.container.personalBests.content.entry.data.new}>{PB.PersonalBest}</div>
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