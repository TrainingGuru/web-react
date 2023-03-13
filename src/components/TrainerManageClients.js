import React, { Component } from 'react';

import Nav from './Nav';

import axios from 'axios';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPenToSquare} from "@fortawesome/free-solid-svg-icons/faPenToSquare";

import '../css/TrainerManageClients.css';

export default class TrainerManageClients extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            clients: [],
            currentClientID: 1,
            goals: [],
            intake: []
        }
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

        // -------------------------- select -------------------------
        const clientSelect = document.getElementById("clients");
        clientSelect.addEventListener('change', function handleChange(event) {
            this.setState({currentClientID: event.target.value});
            this.setState({goals: this.getClientGoals(this.state.currentClientID)});
            this.setState({intake: this.getClientIntake(this.state.currentClientID)});
        })

        this.getClientGoals(this.state.currentClientID);

        this.getClientIntake(this.state.currentClientID);
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

    render()
    {
        return (
            <div className='manage-clients'>
                <Nav />
                <div className='manage-clients-container'>
                    <div className='assign-workouts'>
                        <div className='assign-workouts-name'>
                            <select id="clients">
                                { this.state.clients?.map((client) => {
                                        return <option value={`${client.ClientID}`}>{client.Name}</option>
                                    })
                                }
                            </select>
                        </div>
                        <div className='assign-workouts-content'>
                            <div className='assign-workouts-day'>Monday</div>
                            <div>
                                <select id="workouts">
                                    <option value={"Unassigned"}>Unassigned</option>
                                    <option value={"Legs"}>Legs Advanced</option>
                                    <option value={"Chest"}>Chest Beginner</option>
                                    <option value={"Cardio"}>Cardio Beginner</option>
                                </select>
                            </div>
                            <div className='assign-workouts-day'>Tuesday</div>
                            <div>
                                <select id="workouts">
                                    <option value={"Unassigned"}>Unassigned</option>
                                    <option value={"Legs"}>Legs</option>
                                    <option value={"Chest"}>Chest</option>
                                    <option value={"Cardio"}>Cardio</option>
                                </select>
                            </div>
                            <div className='assign-workouts-day'>Wednesday</div>
                            <div>
                                <select id="workouts">
                                    <option value={"Unassigned"}>Unassigned</option>
                                    <option value={"Legs"}>Legs</option>
                                    <option value={"Chest"}>Chest</option>
                                    <option value={"Cardio"}>Cardio</option>
                                </select>
                            </div>
                            <div className='assign-workouts-day'>Thursday</div>
                            <div>
                                <select id="workouts">
                                    <option value={"Unassigned"}>Unassigned</option>
                                    <option value={"Legs"}>Legs</option>
                                    <option value={"Chest"}>Chest</option>
                                    <option value={"Cardio"}>Cardio</option>
                                </select>
                            </div>
                            <div className='assign-workouts-day'>Friday</div>
                            <div>
                                <select id="workouts">
                                    <option value={"Unassigned"}>Unassigned</option>
                                    <option value={"Legs"}>Legs</option>
                                    <option value={"Chest"}>Chest</option>
                                    <option value={"Cardio"}>Cardio</option>
                                </select>
                            </div>
                            <div className='assign-workouts-day'>Saturday</div>
                            <div>
                                <select id="workouts">
                                    <option value={"Unassigned"}>Unassigned</option>
                                    <option value={"Legs"}>Legs</option>
                                    <option value={"Chest"}>Chest</option>
                                    <option value={"Cardio"}>Cardio</option>
                                </select>
                            </div>
                            <div className='assign-workouts-day'>Sunday</div>
                            <div>
                                <select id="workouts">
                                    <option value={"Unassigned"}>Unassigned</option>
                                    <option value={"Legs"}>Legs</option>
                                    <option value={"Chest"}>Chest</option>
                                    <option value={"Cardio"}>Cardio</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <select id="weeks">
                                <option value={"Mon30Jan"}>w/c Mon 30 Jan</option>
                                <option value={"Mon06Feb"}>w/c Mon 06 Feb</option>
                                <option value={"Mon13Feb"}>w/c Mon 13 Feb</option>
                                <option value={"Mon20Feb"}>w/c Mon 20 Feb</option>
                                <option value={"Mon27Feb"}>w/c Mon 27 Feb</option>
                                <option value={"Mon06Mar"}>w/c Mon 06 Mar</option>
                            </select>
                        </div>
                    </div>
                    <div className='manage-clients-intake'>
                        <div className='manage-clients-intake-heading'>Intake</div>
                        { <div className='manage-clients-intake-table'>
                                    <div>Calories</div>
                                    <div>{this.state.intake?.CaloriesIntake}/{this.state.intake?.TotalCalories}cal</div>
                                    <FontAwesomeIcon className='manage-clients-edit-icon' icon={faPenToSquare}/>
                                    <div>Protein</div>
                                    <div>{this.state.intake?.ProteinIntake}/{this.state.intake?.TotalProtein}g</div>
                                    <FontAwesomeIcon className='manage-clients-edit-icon' icon={faPenToSquare}/>
                                    <div>Fat</div>
                                    <div>{this.state.intake?.FatsIntake}/{this.state.intake?.TotalFats}g</div>
                                    <FontAwesomeIcon className='manage-clients-edit-icon' icon={faPenToSquare}/>
                                    <div>Carbs</div>
                                    <div>{this.state.intake?.CarbohydratesIntake}/{this.state.intake?.TotalCarbohydrates}g</div>
                                    <FontAwesomeIcon className='manage-clients-edit-icon' icon={faPenToSquare}/>
                                </div>
                                
                            }
                    </div>
                    <div className='manage-clients-steps sections'>
                        <div className='headers'>Steps Goal</div>
                        <FontAwesomeIcon className='manage-clients-edit-icon' icon={faPenToSquare}/>
                    </div>
                    <div className='client-description sections'>
                        <div className='headers'>Client Description</div>
                        <div className='client-description-content'>
                            <FontAwesomeIcon className='manage-edit-icon' icon={faPenToSquare}/>
                        </div>
                    </div>
                    <div className='catch-up-notes sections'>
                        <div className='headers'>CatchUp Notes</div>
                        <div className='catch-up-notes-textbox'>
                            <textarea></textarea>
                        </div>
                    </div>
                    
                </div>
            </div>
        )
    }
}