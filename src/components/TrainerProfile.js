import React, { Component } from 'react';

import Nav from './Nav'

import axios from 'axios';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPenToSquare} from "@fortawesome/free-solid-svg-icons/faPenToSquare";

import '../css/TrainerProfile.css';

export default class TrainerProfile extends Component
{
    constructor(props) {
        super(props);
        this.state = {
            isPopupClicked: false,
            workouts: []
        };
    }

    componentDidMount() {
        // --------------------- Trainer Details -------------------

        // --------------------- Saved Workouts -------------------
        axios.get(`https://traininggurubackend.onrender.com/Trainer/1/AllWorkouts`)
            .then(res =>
            {
                if(res.data)
                {
                    console.log("Saved Workouts Data read!")
                    this.setState({workouts: res.data})
                }
                else {
                    console.log("Data not Found!")
                }
            })
    }

    render()
    {
        return (
            <div className='trainer-profile'>
                <Nav />
                <div className='trainer-profile-container'>
                    <div className='profile'>
                        <div className='profile-info'>
                            <div className='profile-pic'>
                                <img className='profile-pic-image'
                                    src={"https://assets.api.uizard.io/api/cdn/stream/9789bb7f-8141-48f9-87dd-f2ebdadcbec6.png"}
                                    alt="logo"/>
                            </div>
                            <div className='profile-name'><b>Name:</b> Adam Hobbs</div>
                            <div className='profile-description sections'>
                                <div>1 to 1 personal trainer working out of DkIT Sport in Dundalk, County Louth. I am a certified Level 3 Personal Trainer and have a Level 7 Qualification in Nutrition.</div>
                                <div>I am currently open to taking on clients on a 1 to 1 or Online Basis.</div>
                            </div>
                            <div className='profile-edit-icon'>
                                Edit
                                <FontAwesomeIcon icon={faPenToSquare}/>
                            </div>
                        </div>
                        <div className='saved-workouts sections'>
                            <div className='headers'>Saved Workouts</div>
                            { this.state.workouts?.map((workout) => {
                                return <div>
                                        <div>{workout.WorkoutName}</div>
                                    </div>
                            }) }

                        </div>
                        <div onClick={() => this.setState({ isPopupClicked: !this.state.isPopupClicked })} className='profile-edit-icon'>
                            Edit
                            <FontAwesomeIcon icon={faPenToSquare}/>
                        </div>
                    </div>

                    <div className='create-workout'>
                        <div className='create-workout-card'>
                            <div className='create-workout-header'>
                                <h1 className='create-workout-header-h1 create-workout-line'>Create Workout</h1>
                            </div>
                            <form className='create-workout-form'>
                                <div>
                                    <div className='create-workout-form-item create-workout-line'>
                                        <label className='create-workout-item-label'>Name:</label>
                                        <input className='create-workout-item-input' type="text" placeholder="Enter Name" required/>
                                    </div>
                                </div>
                                <div className='create-workout-line'>
                                    <div className='create-workout-exercise'>
                                        <label className='create-workout-exercise-label'>Exercise:</label>
                                        <input className='create-workout-exercise-input' type="text" placeholder="Enter Exercise Name" required/>
                                    </div>
                                    <div className='create-workout-exercise'>
                                        <label className='create-workout-exercise-label'>Sets:</label>
                                        <input className='create-workout-exercise-input' type="text" placeholder="Enter Sets" required/>
                                    </div>
                                    <div className='create-workout-exercise'>
                                        <label className='create-workout-exercise-label'>Reps:</label>
                                        <input className='create-workout-exercise-input' type="text" placeholder="Enter Reps" required/>
                                    </div>
                                
                                    <button className='create-workout-button' type="submit">ADD</button>
                                </div>
                                <div>
                                    <p>Name: Sets: Reps:</p>
                                    <p>Name: Sets: Reps:</p>
                                    <p>Name: Sets: Reps:</p>

                                    <button className='create-workout-button' type="submit">DONE</button>
                                </div>
                                
                            </form>
                        </div>

                    </div>
                </div>
                <div className={this.state.isPopupClicked ? 'saved-workouts-popup sections' : 'hidden'}>
                    <div className='headers'>Saved Workouts</div>
                    <div onClick={() => this.setState({ isPopupClicked: !this.state.isPopupClicked })} className='saved-workouts-popup-close-button'>Close</div>
                </div>
            </div>
        )
    }
}