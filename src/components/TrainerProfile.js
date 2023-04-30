import React, { Component } from 'react';

import Nav from './Nav'

import axios from 'axios';

import {Link, Navigate} from "react-router-dom";

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPenToSquare} from "@fortawesome/free-solid-svg-icons/faPenToSquare";
import {faRightFromBracket} from "@fortawesome/free-solid-svg-icons/faRightFromBracket";
import {faX} from "@fortawesome/free-solid-svg-icons/faX";
import {faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";

import '../css/TrainerProfile.css';

export default class TrainerProfile extends Component
{
    constructor(props) {
        super(props);
        this.state = {
            isPopupClicked: false,
            workouts: [],
            trainerDetails: [],
            savedWorkoutDetails: [],
            currentWorkoutID: 0,
            workoutName: "",
            trainerID: sessionStorage.getItem("TrainerID"),
            exercises: []
        };
        
    }

    componentDidMount() {
        // --------------------- Trainer Details -------------------
        axios.get(`https://traininggurubackend.onrender.com/Trainer/${this.state.trainerID}`)
            .then(res =>
            {
                if(res.data)
                {
                    console.log("Trainer Details Data read!")
                    this.setState({trainerDetails: res.data})
                }
                else {
                    console.log("Data not Found!")
                }
            })

            this.getSavedWorkouts(this.state.trainerID)
        
    }

    getSavedWorkouts(trainerID){
        // --------------------- Saved Workouts -------------------
        axios.get(`https://traininggurubackend.onrender.com/Trainer/${trainerID}/AllWorkouts`)
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

    getWorkoutDetails(workoutId) {
        // -------------------------- Workout Details ------------------------------
        axios.get(`https://traininggurubackend.onrender.com/Client/Workout/${workoutId}`)
        .then(res =>
        {
            if(res.data)
            {
                console.log("WorkoutDetails Data read!")
                this.setState({savedWorkoutDetails: res.data})
            }
            else {
                console.log("Data not Found!")
            }
        })
    }

    handleAddExercise = () => {
        // add to this.state.exercises
        let exerciseObject = {}
        exerciseObject["ExName"] = document.getElementById("exercise-name-input").value
        exerciseObject["Sets"] = document.getElementById("exercise-sets-input").value
        exerciseObject["Reps"] = document.getElementById("exercise-reps-input").value

        this.state.exercises.push(exerciseObject)

        this.setState({ exercises: this.state.exercises })

        document.getElementById("exercise-name-input").value = ""
        document.getElementById("exercise-sets-input").value = ""
        document.getElementById("exercise-reps-input").value = ""
    }

    handleAddWorkout = () => {
        const workoutNameInput = document.getElementById("workout-name-input").value

        // ------------------- Create Workout -----------------------------------
        axios.post(`https://traininggurubackend.onrender.com/Trainer/TrainerWorkout`, {
                "TrainerID": this.state.trainerID,
                "WorkoutName": workoutNameInput,
                "Exercises": this.state.exercises
            })
            .then(res =>
            {
                if(res.data)
                {
                    console.log("Workout Created!")
                    // this.setState({meetings: res.data})
                    // console.log(res.data)
                    this.getSavedWorkouts(this.state.trainerID);
                    document.getElementById("workout-name-input").value = ""
                    this.setState({ exercises: [] })
                }
                else {
                    console.log("Data not Found!")
                }
            })


        // clear exercises state
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
                            <div className='profile-name sections'>{this.state.trainerDetails.Name}</div>
                            <div className='profile-description sections'>
                                <div>{this.state.trainerDetails.Description}</div>
                            </div>
                            <div className='profile-icons'>  
                                <div className='profile-edit-icon'>
                                    <div>Edit</div>
                                    <FontAwesomeIcon icon={faPenToSquare}/>
                                </div>
                                <Link to="/Logout" className='profile-logout-icon'>
                                    <div>Logout</div>
                                    <FontAwesomeIcon icon={faRightFromBracket}/>
                                </Link>
                            </div>
                            
                        </div>
                        <div className='saved-workouts sections'>
                            <div className='headers'>Saved Workouts</div>
                            <div className='saved-workouts-content'>
                                { this.state.workouts?.map((workout) => {
                                    return <div className='saved-workouts-content-row'>
                                            <div className='workout-name'>{workout.WorkoutName}</div>
                                            <div>Number of exercises:</div>
                                        </div>
                                }) }
                            </div>
                            
                            <div onClick={() => this.setState({ isPopupClicked: !this.state.isPopupClicked })} className='saved-workouts-edit-icon'>
                                <div>Edit</div>
                                <FontAwesomeIcon icon={faPenToSquare}/>
                            </div>

                        </div>
                    </div>

                    <div className='create-workout'>
                        <div className='create-workout-card'>
                            <div className='create-workout-header'>
                                <h1 className='create-workout-header-h1 create-workout-line'>Create Workout</h1>
                            </div>
                            <div className='create-workout-form'>
                                <div>
                                    <div className='create-workout-form-item create-workout-line'>
                                        <label className='create-workout-item-label'>Name:</label>
                                        <input className='create-workout-item-input' type="text" id='workout-name-input' placeholder="Enter Name" required/>
                                    </div>
                                </div>
                                <div>
                                    <div className='create-workout-line'>
                                        <div className='create-workout-exercise'>
                                            <label className='create-workout-exercise-label'>Exercise:</label>
                                            <input className='create-workout-exercise-input' type="text" id='exercise-name-input' placeholder="Enter Exercise Name" required/>
                                        </div>
                                        <div className='create-workout-exercise'>
                                            <label className='create-workout-exercise-label'>Sets:</label>
                                            <input className='create-workout-exercise-input' type="number" id='exercise-sets-input' placeholder="Enter Sets" required/>
                                        </div>
                                        <div className='create-workout-exercise'>
                                            <label className='create-workout-exercise-label'>Reps:</label>
                                            <input className='create-workout-exercise-input' type="number" id='exercise-reps-input' placeholder="Enter Reps" required/>
                                        </div>
                                    
                                        <button className='create-exercise-button' onClick={this.handleAddExercise}>ADD</button>
                                    </div>
                                    <div>
                                        <div className='exercises-header-row'>
                                            <div>Name</div>
                                            <div>Sets</div>
                                            <div>Reps</div>
                                        </div>
                                        { this.state.exercises.map((exercise) => {
                                            return <div className='exercise'>
                                                <div>{exercise.ExName}</div>
                                                <div>{exercise.Sets}</div>
                                                <div>{exercise.Reps}</div>
                                            </div>
                                        }) }

                                        
                                    </div>
                                </div>
                                <div className='create-workout-button-container'><button className='create-workout-button' onClick={this.handleAddWorkout}>DONE</button></div>
                                
                            </div>
                        </div>

                    </div>
                </div>
                <div className={this.state.isPopupClicked ? 'popup-container' : 'hidden'}></div>
                <div className={this.state.isWorkoutPopupClicked ? 'workout-details-popup-container' : 'hidden'}></div>
                <div className={this.state.isPopupClicked ? 'saved-workouts-popup sections' : 'hidden'}>
                    <div className='popup-nav'>
                        <div className='headers'>Saved Workouts</div>
                        <FontAwesomeIcon onClick={() => this.setState({ isPopupClicked: !this.state.isPopupClicked })} className='schedule-meeting-popup-close-button' icon={faX}/>
                    </div>
                    <table className='saved-workouts-popup-table'>
                        <thead>
                            <tr>
                                <th></th>
                                <th>Workout Name</th>
                                <th>Number of Exercises</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            { this.state.workouts?.map((workout) => {
                                return <tr>
                                    <td><FontAwesomeIcon className='expand-icon' onClick={() => {
                                            this.getWorkoutDetails(workout.id);
                                            this.setState({currentWorkoutId: workout.id})
                                            this.setState({ workoutName: workout.WorkoutName });
                                            this.setState({ isWorkoutPopupClicked: !this.state.isWorkoutPopupClicked });
                                        }} icon={faChevronDown}/></td>
                                    <td>{workout.WorkoutName}</td>
                                    <td>6</td>
                                    <td><button>Edit</button></td>
                                    <td><button>Delete</button></td>
                                </tr>
                            }) }
                        </tbody>
                    </table>
                    
                </div>
                <div className={this.state.isWorkoutPopupClicked ? 'workout-details-popup sections' : 'hidden'}>
                    <div className='popup-nav'>
                        <div className='headers'>{this.state.workoutName}</div>
                        <FontAwesomeIcon onClick={() => this.setState({ isWorkoutPopupClicked: !this.state.isWorkoutPopupClicked })} className='workout-details-popup-close-button' icon={faX}/>
                    </div>
                    <div className='workout-details-popup-table-header-row'>
                        <div>Exercise Name</div>
                        <div>Exercise Type</div>
                        <div>Sets</div>
                        <div>Reps</div>
                    </div>
                    {this.state.savedWorkoutDetails?.map((workoutDetail) => {
                        // this.setState({currentWorkoutId: workoutDetail.TrainerWorkoutID})
                        return <div className='workout-details-popup-table-row'>
                            <div>{workoutDetail.Exercises[0].Name}</div>
                            <div>{workoutDetail.Exercises[0].Type}</div>
                            <div>{workoutDetail.Sets}</div>
                            <div>{workoutDetail.Reps}</div>
                        </div>
                    })}
                    
                </div>
            </div>
        )
    }
}