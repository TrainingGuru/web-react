import React, { Component } from 'react';

import Nav from './Nav';

import axios from 'axios';
import moment from 'moment';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPenToSquare} from "@fortawesome/free-solid-svg-icons/faPenToSquare";
import {faX} from "@fortawesome/free-solid-svg-icons/faX";
import {faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";

import '../css/TrainerManageClients.css';
import { wait } from '@testing-library/user-event/dist/utils';

export default class TrainerManageClients extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            clients: [],
            currentClientID: localStorage.currentID,
            goals: [],
            intake: [],
            isPopupClicked: false,
            isWorkoutPopupClicked: false,
            savedWorkouts: [],
            savedWorkoutDetails: [],
            stepGoal: 0,
            clientDescription: "",
            weeks: [],
            clientWorkouts: [],
            // allClientWorkouts: [],
            workoutWeeks: [],
            currentWeekNumber: 5,
            assignDayNumber: 0,
            daysOfTheWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        }
    }

    handleClientChange = (event) => {
        // console.log(parseInt(event.target.value)+5);
        localStorage.currentID = event.target.value;
        this.setState({currentClientID: event.target.value});
        this.setState({goals: this.getClientGoals(event.target.value)});
        this.setState({intake: this.getClientIntake(event.target.value)});
        this.setState({stepGoal: this.getStepGoal(event.target.value)});
        this.setState({clientDescription: this.getClientDescription(event.target.value)});

        // this.setState({allClientWorkouts: this.getAllClientWorkouts(event.target.value)});

        // this.setState({workoutWeeks: this.getWorkoutWeeks(event.target.value)});

        // this.setState({currentWeekNumber: this.getCurrentWeekNumber(this.state.currentClientID)});
        
        
        // reset week dropdown to first value

        // might be a problem
        this.setState({clientWorkouts: this.getWorkoutsForWeek(event.target.value, this.state.currentWeekNumber)});


    }

    handleWeekChange = (event) => {
        // get new workouts
        this.setState({clientWorkouts: this.getWorkoutsForWeek(this.state.currentClientID, event.target.value)});

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

        // --------------------- Saved Workouts -------------------
        axios.get(`https://traininggurubackend.onrender.com/Trainer/1/AllWorkouts`)
        .then(res =>
        {
            if(res.data)
            {
                console.log("Saved Workouts Data read!")
                this.setState({savedWorkouts: res.data})
            }
            else {
                console.log("Data not Found!")
            }
        })

        // need to get current week number here before doing anything else

        

        // -------------------------- select -------------------------
        const clientSelect = document.getElementById("clients");
        const weekSelect = document.getElementById("weeks");
        // clientSelect.addEventListener('change', function handleChange(event) {
        //     this.setState({currentClientID: event.target.value});
        //     this.setState({goals: this.getClientGoals(event.target.value)});
        //     this.setState({intake: this.getClientIntake(event.target.value)});
        // })

        clientSelect.addEventListener('change', this.handleClientChange);
        weekSelect.addEventListener('change', this.handleWeekChange);
        
        // this.getWorkoutWeeks(this.state.currentClientID);
        this.getCurrentWeekNumber(this.state.currentClientID);
        
        this.getClientGoals(this.state.currentClientID);

        this.getClientIntake(this.state.currentClientID);

        this.getStepGoal(this.state.currentClientID);

        this.getClientDescription(this.state.currentClientID);

        // this.getClientWorkouts(this.state.currentClientID);
        // this.getAllClientWorkouts(this.state.currentClientID);
        this.getWorkoutsForWeek(this.state.currentClientID, this.state.currentWeekNumber);

        
        this.getWeeksDropdownList();

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

    getWeeksDropdownList() {
        // populating an array to fill the dropdown list for 5 weeks starting from current week because any previous can't be edited but viewed in schedule on catchup screen
        var weeksData = [];
        // moment().startOf('isoweek').format('llll')
        var date = "";
        date = moment().startOf('isoweek').format('llll');
        // console.log(date);
        weeksData[0] = date.substring(0,11);

        for(var i = 1; i < 5; i++) {
            date = moment().startOf('isoweek').add(i*7, 'days').format('llll');
            if(date.substring(10,11).includes(",")){
                weeksData[i] = date.substring(0,10);
            } else {
                weeksData[i] = date.substring(0,11);
            }
            
        }
        
        this.setState({weeks: weeksData});
    }

    // getAllClientWorkouts(currentClientID) {
    //     // -------------------------- All Client Workouts ------------------------------
    //     axios.get(`https://traininggurubackend.onrender.com/Client/${currentClientID}/AllWorkouts`)
    //         .then(res =>
    //         {
    //             if(res.data)
    //             {
    //                 console.log("All Client Workouts Data read!")
    //                 this.setState({allClientWorkouts: res.data})
    //             }
    //             else {
    //                 console.log("Data not Found!")
    //             }
    //         })

    // }

    getWorkoutWeeks(currentClientID) {
        // -------------------------- Workout Weeks ------------------------------
        axios.get(`https://traininggurubackend.onrender.com/Client/${currentClientID}/WorkoutWeeks`)
            .then(res =>
            {
                if(res.data)
                {
                    console.log("Workout Weeks Data read!")
                    this.setState({workoutWeeks: res.data})
                }
                else {
                    console.log("Data not Found!")
                }
            })
    }

    getWorkoutsForWeek(currentClientID, weekNumber) {
        // -------------------------- Workouts for certain Week ------------------------------
        axios.get(`https://traininggurubackend.onrender.com/Client/${currentClientID}/Workouts/${weekNumber}`)
            .then(res =>
            {
                if(res.data)
                {
                    console.log("Certain Weeks Workout Data read!")
                    this.setState({clientWorkouts: res.data})
                }
                else {
                    console.log("Data not Found!")
                }
            })
    }

    getCurrentWeekNumber(currentClientID) {
        
    }

    getClientWorkouts(currentClientID) {

    }

    assignWorkout(workoutID) {
        var date = moment().startOf('isoweek').format('L');
        // get value of weeks dropdown
        var weekNumber = document.getElementById("weeks").value;
        // send day as parameter 
        // assignDayNumber is the index of day in array 0 = monday

        // work out the start of the weeks date
        var startOfWeekDate = moment().startOf('isoweek').format('L');
        if(weekNumber == this.state.currentWeekNumber) {
            startOfWeekDate = moment().startOf('isoweek').add(this.state.assignDayNumber, 'days').format('L');
        } else {
            var diff = weekNumber - this.state.currentWeekNumber;
            startOfWeekDate = moment().startOf('isoweek').add(diff*7+this.state.assignDayNumber, 'days').format('L');
        }
        
        // DD/MM/YYYY

        var finalDate = startOfWeekDate.substring(6,10) + "-" + startOfWeekDate.substring(0,2) + "-" + startOfWeekDate.substring(3,5);
        console.log(finalDate);

        // recall get workouts after assign

        // ------------------- Assign Workout -----------------------------------
        axios.post(`https://traininggurubackend.onrender.com/Client/${this.state.currentClientID}/AssignWorkout`, {
                "TrainerWorkoutID": workoutID,
                "Date": finalDate,
                "Week": weekNumber+""
            })
            .then(res =>
            {
                if(res.data)
                {
                    console.log("Workout Assigned!")
                    // this.setState({meetings: res.data})
                    // console.log(res.data)
                }
                else {
                    console.log("Data not Found!")
                }
            })

            this.setState({clientWorkouts: this.getWorkoutsForWeek(this.state.currentClientID, weekNumber)});
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

    getStepGoal(currentClientID) {
        // -------------------------- Step Goal ------------------------------
        axios.get(`https://traininggurubackend.onrender.com/Client/${currentClientID}/StepGoal`)
        .then(res =>
        {
            if(res.data)
            {
                console.log("Step Goal Data read!")
                // console.log(res.data.StepsGoal);
                this.setState({stepGoal: res.data.StepsGoal})
            }
            else {
                console.log("Data not Found!")
            }
        })
    }

    getClientDescription(currentClientID) {
        // -------------------------- Client Description ------------------------------
        axios.get(`https://traininggurubackend.onrender.com/Client/${currentClientID}`)
        .then(res =>
        {
            if(res.data)
            {
                console.log("Client Description Data read!")
                this.setState({clientDescription: res.data.Notes})
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


    render()
    {
        return (
            <div className='manage-clients'>
                <Nav />
                <div className='manage-clients-container'>
                    <div className='assign-workouts'>
                        <div className='assign-workouts-name'>
                            <select id="clients" className='clients-dropdown'>
                                { this.state.clients?.map((client) => {
                                        return <option value={`${client.ClientID}`}>{client.Name}</option>
                                    })
                                }
                            </select>
                        </div>
                        <div>
                            <select id="weeks" className='weeks-dropdown'>
                                <option value={this.state.currentWeekNumber}>w/c {this.state.weeks[0]}</option>
                                <option value={this.state.currentWeekNumber+1}>w/c {this.state.weeks[1]}</option>
                                <option value={this.state.currentWeekNumber+2}>w/c {this.state.weeks[2]}</option>
                                <option value={this.state.currentWeekNumber+3}>w/c {this.state.weeks[3]}</option>
                                <option value={this.state.currentWeekNumber+4}>w/c {this.state.weeks[4]}</option>
                            </select>
                        </div>
                        


                        <div className='assign-workouts-content'>
                            { this.state.daysOfTheWeek?.map((day) => {
                                    var found = false;
                                    var dayNumber = 0;
                                    return <div className='assign-workouts-content-row'>
                                        <div className='assign-workouts-day assign-workout-content'>{day}</div>
                                        { this.state.clientWorkouts?.map((clientWorkout) => {
                                                var d = new Date(clientWorkout.Date);
                                                dayNumber = d.getDay();
                                                if(dayNumber == 0) {
                                                    dayNumber=6;
                                                } else {
                                                    dayNumber -= 1;
                                                }
                                                var workoutDay = this.state.daysOfTheWeek[dayNumber];
                                                // console.log(clientWorkout.Date + " " + workoutDay);
                                                if(day.localeCompare(workoutDay)==0){
                                                    found = true;
                                                    return <div className='assign-workout-content assign-workout-name'>
                                                        <div className='assign-workout-name-content'>{clientWorkout.TrainerWorkout.WorkoutName}</div>
                                                        <div className='assign-workout-name-content'><FontAwesomeIcon className='assign-workout-name-content-edit-icon' onClick={() => {
                                                                this.setState({ isPopupClicked: !this.state.isPopupClicked });
                                                                this.setState({ assignDayNumber: this.state.daysOfTheWeek.indexOf(day) });

                                                            }} icon={faPenToSquare}/></div>
                                                    </div>
                                                }
                                            })
                                        }
                                        {found ? "" : <div className='assign-workout-content assign-workout-button'>
                                            <button className='assign-button' onClick={() => {
                                                    this.setState({ isPopupClicked: !this.state.isPopupClicked });
                                                    this.setState({ assignDayNumber: this.state.daysOfTheWeek.indexOf(day) });
                                                }}>Assign</button>
                                        </div>
                                        }
                                        
                                    </div>
                                })
                            }
                            
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
                        {/* <div>{this.state.stepGoal}</div> */}
                        <div>7,000</div>
                        <FontAwesomeIcon className='manage-clients-edit-icon' icon={faPenToSquare}/>
                    </div>
                    <div className='client-description sections'>
                        <div className='headers'>Client Description</div>
                        <div>{this.state.clientDescription}</div>
                        <div className='client-description-content'>
                            <FontAwesomeIcon className='manage-edit-icon' icon={faPenToSquare}/>
                        </div>
                    </div>
                    <div className='catch-up-notes sections'>
                        <div className='headers'>CatchUp Notes</div>
                        <div className='catch-up-notes-textbox'>
                            <textarea className='catchup-notes-textbox'>
                                Edit Steps goal to 10,000,
                                Add extra cardio session on Sunday,
                                Leave intake goals for another week and reassess
                            </textarea>
                        </div>
                    </div>
                    
                </div>
                <div className={this.state.isPopupClicked ? 'assign-workout-popup sections' : 'hidden'}>
                    <div className='popup-nav'>
                        <div className='headers'>Assign Workout</div>
                        <FontAwesomeIcon onClick={() => this.setState({ isPopupClicked: !this.state.isPopupClicked })} className='assign-workout-popup-close-button' icon={faX}/>
                    </div>
                    <div className='assign-workout-popup-table'>
                        <div className='assign-workout-popup-table-header-row'>
                            <div></div>
                            <div>Workout Name</div>
                            <div>Number of Exercises</div>
                            <div></div>
                        </div>
                        { this.state.savedWorkouts?.map((workout) => {
                            return <div className='assign-workout-popup-table-row'>
                                <div className='workouts'>
                                    <div><FontAwesomeIcon className='expand-icon' onClick={() => {
                                            this.getWorkoutDetails(workout.id);
                                            this.setState({ isWorkoutPopupClicked: !this.state.isWorkoutPopupClicked });
                                        }} icon={faChevronDown}/></div>
                                    <div>{workout.WorkoutName}</div>
                                    <div>6</div>
                                    <div><button onClick={() => {
                                        this.assignWorkout(workout.id)
                                        this.setState({ isPopupClicked: !this.state.isPopupClicked });
                                    }}>Assign</button></div>
                                </div>
                                <div className={this.state.isWorkoutPopupClicked ? 'exercises' : 'hidden'}>
                                    <div className='exercise'>
                                        <div></div>
                                        <div>Exercise Name</div>
                                        <div className='exercise-details'>
                                            <div>Sets:</div>
                                            <div>3</div>
                                            <div>Reps:</div>
                                            <div>10</div>
                                        </div>
                                        <div></div>
                                    </div>
                                </div>
                            </div>
                        }) }
                        <div className={this.state.isWorkoutPopupClicked ? 'workout-details-popup' : 'hidden'}>
                            {this.state.savedWorkoutDetails?.map((workoutDetail) => {
                                return <div>
                                    {/* {workoutDetail.Exercises.forEach(exercise => {
                                        return <div>
                                            <div>{exercise.Name}</div>
                                            <div>{exercise.Type}</div>
                                        </div>
                                    })} */}
                                </div>
                            })}
                        </div>
                    </div>
                    
                </div>
            </div>
        )
    }
}