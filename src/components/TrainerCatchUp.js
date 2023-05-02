import React, { Component } from 'react';

import Nav from './Nav';
import { Link, Navigate } from 'react-router-dom';

import axios from 'axios';
import moment from 'moment';
import { encode } from 'base-64';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronUp, faChevronDown, faLock } from "@fortawesome/free-solid-svg-icons";

import {faFire, height} from "@fortawesome/free-solid-svg-icons/faFire";
import {faDroplet} from "@fortawesome/free-solid-svg-icons/faDroplet";
import {faStairs} from "@fortawesome/free-solid-svg-icons/faStairs";
import {faBolt} from "@fortawesome/free-solid-svg-icons/faBolt";
import {faShoePrints} from "@fortawesome/free-solid-svg-icons/faShoePrints";
import {faGear} from "@fortawesome/free-solid-svg-icons/faGear";

import {faCheck} from "@fortawesome/free-solid-svg-icons/faCheck";
import {faX} from "@fortawesome/free-solid-svg-icons/faX";
import { faMinus } from "@fortawesome/free-solid-svg-icons/faMinus";

import {faPenToSquare} from "@fortawesome/free-solid-svg-icons/faPenToSquare";
import { faLessThan, faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { faGreaterThan } from '@fortawesome/free-solid-svg-icons';

import barChart from '../barChart.png'
import progressChart from '../progress-chart.png'

import Plotly from 'plotly.js-dist';

import '../css/TrainerCatchUp.css';

export default class TrainerCatchUp extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            clients: [],
            currentClientID: localStorage.currentID,
            goals: [],
            intake: [],
            pbs: [],
            calHistory: [],
            calHistory7Days: [],
            catchupHistory: [],
            displayCatchupHistory: [],
            weight: [],
            schedule: {},
            isPopupClicked: false,
            meetingStarted: false,
            isStartMeetingPopupClicked: false,
            isSubmitMeetingPopupClicked: false,
            isFitbitPopupClicked: false,
            clientWorkouts: [],
            clientWorkoutsPrevWeek: [],
            clientWorkoutsNextWeek: [],
            clientWorkoutNotes: [],
            workoutName: "",
            clientName: "",
            currentWeekNumber: 6,
            trainerID: sessionStorage.getItem("TrainerID"),
            daysOfTheWeek: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            daysOfTheWeekShort: ["M", "T", "W", "T", "F", "S", "S"],
            avgFitbitCaloriesBurntData: 0,
            avgFitbitFloorsClimbedData: 0,
            avgFitbitActiveMinutesData: 0,
            avgFitbitStepsData: 0,
            isMeetingScheduled: false,
            meetings: [],
            currentCatchupMeetingID: 0,
            calorieData: {},
            floorsData: {},
            activeminsData: {},
            stepsData: {},
            fitbitDataLoaded: false,
            iconClicked: ""
        }
    }

    handleClientChange = (event) => {
        localStorage.currentID = event.target.value;
        this.setState({currentClientID: event.target.value});
        this.setState({goals: this.getClientGoals(event.target.value)});
        this.setState({intake: this.getClientIntake(event.target.value)});
        this.setState({calHistory7Days: []})
        this.setState({calHistory: this.getClientCalHistory(event.target.value)});
        // this.setState({calHistory7Days: this.getCalorieSummary7Days()});
        this.setState({displayCatchupHistory: []})
        this.setState({catchupHistory: this.getClientCatchUpHistory(event.target.value)});
        this.setState({pbs: this.getClientPBs(event.target.value)});
        this.getClientWeightGraph([])
        this.setState({weight: this.getClientWeight(event.target.value)});

        this.setState({clientWorkouts: this.getWorkoutsForWeek(event.target.value, this.state.currentWeekNumber)});
        this.setState({clientWorkoutsPrevWeek: this.getWorkoutsForPrevWeek(event.target.value, this.state.currentWeekNumber-1)});
        this.setState({clientWorkoutsNextWeek: this.getWorkoutsForNextWeek(event.target.value, this.state.currentWeekNumber+1)});
        this.setState({isMeetingScheduled: false})
        this.checkMeetingSchedule(event.target.value)

       

        this.setState({avgFitbitCaloriesBurntData: 0})
        this.setState({avgFitbitFloorsClimbedData: 0})
        this.setState({avgFitbitActiveMinutesData: 0})
        this.setState({avgFitbitStepsData: 0})

        this.setState({calorieData: {}})
        this.setState({floorsData: {}})
        this.setState({activeminsData: {}})
        this.setState({stepsData: {}})

        this.setState({ fitbitDataLoaded: false })

        this.fitbitData(event.target.value);



    }

    checkMeetingSchedule(currentClientID) {
        console.log("Check meeting Scheduled")
        // ------------------- Upcoming Meetings -----------------------------------
        axios.get(`https://traininggurubackend.onrender.com/Trainer/${this.state.trainerID}/UpcomingMeetings`)
        .then(res =>
        {
            if(res.data)
            {
                console.log("Meeting Data read!")
                this.setState({meetings: res.data})

                let today = new Date();

                // if meetings has date for today
                    // if that meeting has client id of currentClientID
                        // set true
                res.data.some((meeting) => {
                    if((new Date(meeting.Date).getFullYear() < new Date().getFullYear()) || (new Date(meeting.Date).getMonth() < new Date().getMonth()) || (new Date(meeting.Date).getMonth() === new Date().getMonth() && new Date(meeting.Date).getDate() < new Date().getDate())){
                        // if meeting date has passed 
                        // submit the meeting with no notes or feedback - rating 3 - dash
                        this.submitBlankCatchupMeeting(meeting.id)
                    }
                    else if (new Date(meeting.Date).getFullYear() === new Date().getFullYear() && new Date(meeting.Date).getDate() === new Date().getDate() && new Date(meeting.Date).getMonth() === new Date().getMonth()) {
                        
                        if(meeting.Client.ClientID === parseInt(currentClientID)) {
                            
                            this.setState({isMeetingScheduled: true})
                            
                            this.setState({currentCatchupMeetingID: meeting.id})
                        }
                    }
                })
                
            }
            else if(res.status === 404){
                console.log("No Upcoming Meetings Scheduled!");
                // var meetings = [];
                // this.getCalendar(meetings);
                // document.querySelector(".upcoming-meetings-content").innerText = "No Upcoming Meetings Scheduled!";
            }
            else {
                console.log("Data not Found!")
            }
        })
    }

    componentDidMount()
    {

        const track = document.querySelector('.track');
        const slides = Array.from(track.children);
        const nextButton = document.querySelector('.button-right');
        const prevButton = document.querySelector('.button-left');
        const dotsNav = document.querySelector('.carousel-nav');
        const dots = Array.from(dotsNav.children);

        const slideWidth = slides[0].getBoundingClientRect().width;

        const setSlidePosition = (slide, index) => {
            slide.style.left = slideWidth * index + 'px';
        }
        slides.forEach(setSlidePosition);

        const moveToSlide = (track, currentSlide, targetSlide) => {
            track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
            currentSlide.classList.remove('current-slide');
            targetSlide.classList.add('current-slide');
        }

        const updateDots = (currentDot, targetDot) => {
            currentDot.classList.remove('nav-current-slide');
            targetDot.classList.add('nav-current-slide');
        }

        const hideShowArrows = (slides, prevButton, nextButton, targetIndex) => {
            if(targetIndex === 0) {
                prevButton.classList.add('hidden');
                nextButton.classList.remove('hidden');
            } else if (targetIndex === slides.length-1) {
                nextButton.classList.add('hidden');
                prevButton.classList.remove('hidden');
            } else {
                nextButton.classList.remove('hidden');
                prevButton.classList.remove('hidden');
            }
        }

        const centerCarousel = () => {
            const currentSlide = track.querySelector('.current-slide');
            const nextSlide = currentSlide.nextElementSibling;

            const currentDot = dotsNav.querySelector('.nav-current-slide');
            const nextDot = currentDot.nextElementSibling;
            const nextIndex = slides.findIndex(slide => slide === nextSlide);

            moveToSlide(track, currentSlide, nextSlide);
            updateDots(currentDot, nextDot);
            hideShowArrows(slides, prevButton, nextButton, nextIndex);
        }
        centerCarousel();

        nextButton.addEventListener('click', e => {
            const currentSlide = track.querySelector('.current-slide');
            const nextSlide = currentSlide.nextElementSibling;

            const currentDot = dotsNav.querySelector('.nav-current-slide');
            const nextDot = currentDot.nextElementSibling;
            const nextIndex = slides.findIndex(slide => slide === nextSlide);

            moveToSlide(track, currentSlide, nextSlide);
            updateDots(currentDot, nextDot);
            hideShowArrows(slides, prevButton, nextButton, nextIndex);
        })

        prevButton.addEventListener('click', e => {
            const currentSlide = track.querySelector('.current-slide');
            const prevSlide = currentSlide.previousElementSibling;
            
            const currentDot = dotsNav.querySelector('.nav-current-slide');
            const prevDot = currentDot.previousElementSibling;

            const prevIndex = slides.findIndex(slide => slide === prevSlide);

            moveToSlide(track, currentSlide, prevSlide);
            updateDots(currentDot, prevDot);
            hideShowArrows(slides, prevButton, nextButton, prevIndex);
        })

        dotsNav.addEventListener('click', e => {
            const targetDot = e.target.closest('button');

            if (!targetDot) return;

            const currentSlide = track.querySelector('.current-slide');
            const currentDot = dotsNav.querySelector('.nav-current-slide');
            const targetIndex = dots.findIndex(dot => dot === targetDot);

            const targetSlide = slides[targetIndex];

            moveToSlide(track, currentSlide, targetSlide);
            updateDots(currentDot, targetDot);

            hideShowArrows(slides, prevButton, nextButton, targetIndex);
        })

        // --------------------- Clients -------------------
        axios.get(`https://traininggurubackend.onrender.com/Trainer/${this.state.trainerID}/Clients`)
            .then(res =>
            {
                if(res.data)
                {
                    console.log("Client Data read!")
                    this.setState({clients: res.data})
                }
                else if(res.status === 404){
                    console.log("No Clients Found!");
                    // var meetings = [];
                    // this.getCalendar(meetings);
                    document.querySelector(".clients-dropdown").innerText = "No Clients Found!";
                }
                else {
                    console.log("Data not Found!")
                }
            });
        // -------------------------- select -------------------------
        const clientSelect = document.getElementById("clients");
        clientSelect.addEventListener('change', this.handleClientChange);

        this.getClientGoals(this.state.currentClientID);
        this.getClientIntake(this.state.currentClientID);
        this.getClientPBs(this.state.currentClientID);
        
        this.getClientCalHistory(this.state.currentClientID);
        // this.getCalorieSummary7Days();

        this.getClientWeight(this.state.currentClientID);
        this.getClientCatchUpHistory(this.state.currentClientID);
        this.getSchedule();

        this.getWorkoutsForWeek(this.state.currentClientID, this.state.currentWeekNumber);
        this.getWorkoutsForPrevWeek(this.state.currentClientID, this.state.currentWeekNumber-1);
        this.getWorkoutsForNextWeek(this.state.currentClientID, this.state.currentWeekNumber+1);

        this.setState({isMeetingScheduled: false})
        this.checkMeetingSchedule(this.state.currentClientID)

        // this.setTextboxHeight('catchup-notes');

        this.fitbitData(this.state.currentClientID);


    }

    getClientGoals(currentClientID) {
        // -------------------------- goals ------------------------------
        axios.get(`https://traininggurubackend.onrender.com/Goals/${currentClientID}`)
            .then(res =>
            {
                if(res.status === 404){
                    console.log("No Goals Found!");
                    document.querySelector(".goals").innerHTML += `<div class="goals-entry">No Upcoming Meetings Scheduled!</div>`;
                }
                else if(res.data)
                {
                    console.log("Goals Data read!")
                    this.setState({goals: res.data})
                }
                else {
                    console.log("Data not Found!")
                }
            })
    }

    getClientName(currentClientID) {
        // -------------------------- client name ------------------------------
        axios.get(`https://traininggurubackend.onrender.com/Client/${currentClientID}/Name`)
            .then(res =>
            {
                if(res.data)
                {
                    console.log("Client Name Data read!")
                    this.setState({clientName: res.data.Name})
                }
                else if(res.status === 404){
                    console.log("Client Name not Found!");
                    document.querySelector(".start-meeting-confirmation-name").innerText += "Client Name not Found!";
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
                    console.log("Current Weeks Workout Data read!")
                    this.setState({clientWorkouts: res.data})
                    
                }
                else if(res.status === 404){
                    console.log("Workouts for this week not Found!");
                    
                }
                else {
                    console.log("Data not Found!")
                }
            })
    }

    getWorkoutsForPrevWeek(currentClientID, weekNumber) {
        // -------------------------- Workouts for certain Week ------------------------------
        axios.get(`https://traininggurubackend.onrender.com/Client/${currentClientID}/Workouts/${weekNumber}`)
            .then(res =>
            {
                if(res.data)
                {
                    console.log("Previous Weeks Workout Data read!")
                    this.setState({clientWorkoutsPrevWeek: res.data})
                    
                }
                else if(res.status === 404){
                    console.log("Workouts for Previous week not Found!");
                    
                }
                else {
                    console.log("Data not Found!")
                }
            })
    }

    getWorkoutsForNextWeek(currentClientID, weekNumber) {
        // -------------------------- Workouts for certain Week ------------------------------
        axios.get(`https://traininggurubackend.onrender.com/Client/${currentClientID}/Workouts/${weekNumber}`)
            .then(res =>
            {
                if(res.data)
                {
                    console.log("Next Weeks Workout Data read!")
                    this.setState({clientWorkoutsNextWeek: res.data})
                    
                }
                else if(res.status === 404){
                    console.log("Workouts for Next week not Found!");
                    
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
            else if(res.status === 404){
                console.log("Intake Data not Found!");
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
                else if(res.status === 404){
                    console.log("Client PB Data not Found!");
                    document.querySelector(".personal-bests-content").innerText += "No PBs to Display";
                }
                else {
                    console.log("Data not Found!")
                }
            })
    }

    getClientWeight(currentClientID) {
        // -------------------------- weight ------------------------------
        axios.get(`https://traininggurubackend.onrender.com/ClientWeight/${currentClientID}`)
            .then(res =>
            {
                if(res.data)
                {
                    console.log("Weight Data read!")
                    this.setState({weight: res.data})
                    this.getClientWeightGraph(res.data)
                }
                else if(res.status === 404){
                    console.log("Client Weight Data not Found!");
                    document.querySelector(".plot-container").innerText += "No Weight Entries to Display";
                }
                else {
                    console.log("Data not Found!")
                }
            })
    }

    

    getClientWeightGraph(weightData) {
        var graphDiv = document.getElementById("progress-chart-container")
        // getting 404 from weight endpoint
        if(weightData.length != 0) {
            var xDateArray = []
            var yWeightArray = []
            yWeightArray[0] = 0.0

            // fill arrays
            let j = 0;
            for(let i = weightData.length-1; i >= 0; i--) {
                xDateArray[j] = weightData[i].Date;
                yWeightArray[j] = weightData[i].Weight;
                j++;
            }

            const data = [{
                x: xDateArray,
                y: yWeightArray,
                mode: "markers"
            }];

            const config = {
                displayModeBar: false,
            };

            const layout = {
                autosize: false,
                width: 500,
                height: 350,
                xaxis: {title: 'Date'},
                yaxis: {title: 'Weight (kg)'},
                paper_bgcolor: 'rgba(0, 0, 0, 0)',
                plot_bgcolor: 'rgba(0, 0, 0, 0)'
            }
            Plotly.newPlot(graphDiv, data, layout, config); // , layout
        } else {
            graphDiv.innerHTML = ``
        }
    }

    getClientCalHistory(currentClientID) {
        // -------------------------- cal History ------------------------------
        axios.get(`https://traininggurubackend.onrender.com/Nutrition/${currentClientID}/CalHistory`)
            .then(res =>
            {
                if(res.data)
                {
                    console.log("cal History Data read!")

                    this.setState({calHistory: res.data});

                    this.getCalorieSummary7Days(res.data);
                }
                else {
                    console.log("Data not Found!")
                }
            })

            // let mondaysDate = moment().startOf('isoweek').format();
            // let mondaysDateString = mondaysDate.substring(0, 10);
    }

    getClientCatchUpHistory(currentClientID) {
        // -------------------------- catchup History ------------------------------
        axios.get(`https://traininggurubackend.onrender.com/CatchUp/${currentClientID}`)
            .then(res =>
            {
                if(res.data)
                {
                    console.log("catchup History Data read!")
                    this.setState({catchupHistory: res.data})
                    this.getDisplayCatchupHistory(res.data)
                    
                }
                else {
                    console.log("Data not Found!")
                }
            })

            // let mondaysDate = moment().startOf('isoweek').format();
            // let mondaysDateString = mondaysDate.substring(0, 10);
    }

    // <div className='feedback-summary-icon'><FontAwesomeIcon className='thumbs-up' icon={faThumbsUp}/></div>
    
    // <div className='feedback-summary-week'>1</div>

    getDisplayCatchupHistory(catchupHistory) {
        let catchupObject = {}
        if(catchupHistory.length < 7){
            for (let i = catchupHistory.length-1; i >= 0; i--) {
                catchupObject = {}
                catchupObject["Week"] = catchupHistory[i].Week
                catchupObject["Icon-Number"] = catchupHistory[i].Rating
                
                this.state.displayCatchupHistory.push(catchupObject)
                

            }
            for(let i = catchupHistory.length+1; i <= 7; i++) {
                catchupObject = {}
                catchupObject["Week"] = i
                catchupObject["Icon-Number"] = 3

                this.state.displayCatchupHistory.push(catchupObject)
                this.setState({displayCatchupHistory: this.state.displayCatchupHistory})
            }
        } else if (catchupHistory.length > 7) {
            for (let i = catchupHistory.length-1; i >= catchupHistory.length-7; i--) {
                catchupObject = {}
                catchupObject["Week"] = catchupHistory[i].Week
                catchupObject["Icon-Number"] = catchupHistory[i].Rating

                this.state.displayCatchupHistory.push(catchupObject)
                this.setState({displayCatchupHistory: this.state.displayCatchupHistory})
            }
        } else {
            for (let i = catchupHistory.length-1; i >= 0; i--) {
                catchupObject = {}
                catchupObject["Week"] = catchupHistory[i].Week
                catchupObject["Icon-Number"] = catchupHistory[i].Rating

                this.state.displayCatchupHistory.push(catchupObject)
                this.setState({displayCatchupHistory: this.state.displayCatchupHistory})
            }
        }
        
    }

    // getDisplayCatchupHistory(catchupHistory) {
    //     const weeksTag = document.getElementById("feedback-weeks");
    //     let weeksDiv = ""
    //     const iconsTag = document.getElementById("feedback-icons");
    //     let iconsDiv = ""
    //     if(catchupHistory.length < 7){
    //         for(let i = 0; i < catchupHistory.length; i++) {
    //             weeksDiv += `<div class='feedback-summary-week'>${catchupHistory[i].Week}</div>`
    //             iconsDiv += `<div class='feedback-summary-icon'>`
    //             if(catchupHistory[i].Rating === 0) {
    //                 // thumbs down
    //                 iconsDiv += `<FontAwesomeIcon class='thumbs-down' icon={faThumbsDown}/>`
    //             } else if(catchupHistory[i].Rating === 1) {
    //                 // middle thumb
    //                 iconsDiv += `<FontAwesomeIcon class='thumbs-middle' icon={faThumbsUp}/>`
    //             } else if (catchupHistory[i].Rating === 2) {
    //                 // Thumbs up
    //                 iconsDiv += `<FontAwesomeIcon class='thumbs-up' icon={faThumbsUp}/>`
    //             } else {
    //                 // dash
    //                 iconsDiv += `<FontAwesomeIcon class='dash' icon={faThumbsUp}/>`
    //             }
    //             iconsDiv += `</div>`
    //         }
    //         for(let i = catchupHistory.length+1; i <= 7; i++) {
    //             weeksDiv += `<div class='feedback-summary-week'>${i}</div>`
    //             iconsDiv += `<div class='feedback-summary-icon'><FontAwesomeIcon class='dash' icon={faThumbsUp}/></div>`
    //         }
    //     } else if (catchupHistory.length > 7) {
    //         for(let i = catchupHistory.length-7; i < catchupHistory.length; i++) {
    //             weeksDiv += `<div class='feedback-summary-week'>${catchupHistory[i].Week}</div>`
    //             iconsDiv += `<div class='feedback-summary-icon'>`
    //             if(catchupHistory[i].Rating === 0) {
    //                 // thumbs down
    //                 iconsDiv += `<FontAwesomeIcon class='thumbs-down' icon={faThumbsDown}/>`
    //             } else if(catchupHistory[i].Rating === 1) {
    //                 // middle thumb
    //                 iconsDiv += `<FontAwesomeIcon class='thumbs-middle' icon={faThumbsUp}/>`
    //             } else if (catchupHistory[i].Rating === 2) {
    //                 // Thumbs up
    //                 iconsDiv += `<FontAwesomeIcon class='thumbs-up' icon={faThumbsUp}/>`
    //             } else {
    //                 // dash
    //                 iconsDiv += `<FontAwesomeIcon class='dash' icon={faThumbsUp}/>`
    //             }
    //             iconsDiv += `</div>`
    //         }
    //     } else {
    //         for(let i = 0; i < catchupHistory.length; i++) {
    //             weeksDiv += `<div class='feedback-summary-week'>${catchupHistory[i].Week}</div>`
    //             iconsDiv += `<div class='feedback-summary-icon'>`
    //             if(catchupHistory[i].Rating === 0) {
    //                 // thumbs down
    //                 iconsDiv += `<FontAwesomeIcon class='thumbs-down' icon={faThumbsDown}/>`
    //             } else if(catchupHistory[i].Rating === 1) {
    //                 // middle thumb
    //                 iconsDiv += `<FontAwesomeIcon class='thumbs-middle' icon={faThumbsUp}/>`
    //             } else if (catchupHistory[i].Rating === 2) {
    //                 // Thumbs up
    //                 iconsDiv += `<FontAwesomeIcon class='thumbs-up' icon={faThumbsUp}/>`
    //             } else {
    //                 // dash
    //                 iconsDiv += `<FontAwesomeIcon class='dash' icon={faThumbsUp}/>`
    //             }
    //             iconsDiv += `</div>`
    //         }
    //     }

    //     weeksTag.innerHTML = weeksDiv;
    //     iconsTag.innerHTML = iconsDiv;
    // }

    getClientNotesForOneWorkout(clientWorkoutID) {
        // -------------------------- catchup History ------------------------------
        axios.get(`https://traininggurubackend.onrender.com/Client/WorkoutNote/${clientWorkoutID}`)
            .then(res =>
            {
                if(res.data)
                {
                    const notesTag = document.querySelector(".workout-notes-content")

                    let notesContentTag = "";
                    console.log("workout notes Data read!")
                    if(res.data.Notes === null) {
                        notesContentTag += `<div class="no-client-workout-notes">No Notes to Display</div>`
                    } else {
                        let myArray = res.data.Notes.split("\n")
                        myArray = myArray.filter((entry) => {
                            return entry.localeCompare("") != 0
                        })
                        for(let i = 0; i < myArray.length; i++){
                            myArray[i] = myArray[i].split(": ")
                        }

                        
                        
                        // User Notes:
                        notesContentTag += `<div class="workout-notes-user-notes">`
                        notesContentTag += `<div class="headings">${myArray[0][0]}: </div>`
                        notesContentTag += `<div>${myArray[0][1]}</div>`
                        notesContentTag += `</div>`

                        // Workout:
                        notesContentTag += `<div class="workout-notes-workout-name">`
                        notesContentTag += `<div class="headings">${myArray[1][0]}: </div>`
                        notesContentTag += `<div>${myArray[1][1]}</div>`
                        notesContentTag += `</div>`


                        notesContentTag += `<div class="workout-notes-exercises">`
                        notesContentTag += `<div class="workout-notes-exercises-headers">`
                        notesContentTag += `<div>Exercise</div>`
                        notesContentTag += `<div>Completed</div>`
                        notesContentTag += `<div>Weight Used</div>`
                        notesContentTag += `</div>`
                        for(let j = 2; j < myArray.length; j++) {
                            notesContentTag += `<div class="workout-notes-exercise-details">`
                            // Exercise:
                            notesContentTag += `<div class="workout-notes-exercise">`
                            // notesContentTag += `<div>${myArray[j][0]}: </div>`
                            notesContentTag += `<div>${myArray[j][1]}</div>`
                            notesContentTag += `</div>`
                            j++;
                            // Completed: 
                            notesContentTag += `<div class="workout-notes-completed">`
                            // notesContentTag += `<div>${myArray[j][0]}: </div>`
                            notesContentTag += `<div>${myArray[j][1]}</div>`
                            notesContentTag += `</div>`
                            j++;
                            // Weight Used:
                            notesContentTag += `<div class="workout-notes-weight-used">`
                            // notesContentTag += `<div>${myArray[j][0]}: </div>`
                            notesContentTag += `<div>${myArray[j][1]}</div>`
                            notesContentTag += `</div>`

                            notesContentTag += `</div>`
                        }
                        
                        notesContentTag += `</div>`

                        

                        // myArray = myArray.split(": ")
                        // I know 0, 1 is user notes and notes
                        // End of 1 is workout: and 2 is workout title
                        // Then till the end is Exercise: exercise name, completed yes, weight used x
                        this.setState({clientWorkoutNotes: myArray})
                    }
                    notesTag.innerHTML = notesContentTag;
                    
                }
                else {
                    console.log("Data not Found!")
                }
            })
    }

    getCalorieSummary7Days(calHistory) {
        // compare against last 7 days array
        let last7Days = [] // [0] = "2023-04-30"
        let date = moment().subtract(6, 'days').format('L');
        for(let i = 0; i < 7; i++) {
            date = moment().subtract(6-i, 'days').format('L');
            last7Days[i] = date.substring(6,) + "-" + date.substring(0,2) + "-" + date.substring(3,5)
        }

        let calorieObject = {}
    
        last7Days.forEach((day) => {
            calorieObject = {}
            if(calHistory.filter(row => row.Date.localeCompare(day) === 0).length > 0) {
                // day exists - find that days result
                calHistory.filter(row => row.Date.localeCompare(day) === 0).map((history) => {
                    calorieObject = {}
                    let dayNumber = new Date(history.Date).getDay();
                    if(dayNumber == 0) {
                        dayNumber=6;
                    } else {
                        dayNumber -= 1;
                    }
                    var caloreDay = this.state.daysOfTheWeekShort[dayNumber];
                    calorieObject["Day"] = caloreDay

                    if(history.CaloriesHit) {
                        calorieObject["Icon-Number"] = 1
                    } else if(!history.CaloriesHit) {
                        calorieObject["Icon-Number"] = 0
                    } else {
                        calorieObject["Icon-Number"] = 2
                    }
                    // 0 - X
                    // 1 - tick
                    // 2 - dash
                })
                this.state.calHistory7Days.push(calorieObject)
            } else {
                // day doesn't exist
                calorieObject = {}
                let dayNumber = new Date(day).getDay();
                if(dayNumber == 0) {
                    dayNumber=6;
                } else {
                    dayNumber -= 1;
                }
                var caloreDay = this.state.daysOfTheWeekShort[dayNumber];
                calorieObject["Day"] = caloreDay

                calorieObject["Icon-Number"] = 2

                this.state.calHistory7Days.push(calorieObject)
            }
        })

        this.setState({ calHistory7Days: this.state.calHistory7Days })
        


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
        // console.log("hello")
        // console.log(JSON.stringify(this.state.schedule));
    }

    

    fitbitData = async (currentClientID) => {
        const clientId = '2395P3';
        const clientSecret = '9a7b2ea21730dc04d115cb52c799ecf1';

        const responseFitBit = await this.GetFitbitToken(currentClientID);
        console.log(responseFitBit)

        if (responseFitBit.value) {
            const fitbitData = await this.getNewTokens(responseFitBit.fitbitToken, clientId, clientSecret)
            
            

            if (fitbitData.refreshToken) {
                await this.updateFitbitToken(await currentClientID, fitbitData.refreshToken)
                
                

                const responseDataFitBit = await this.getFitbitData(fitbitData.accessToken);
                console.log("responseDataFitBit" + JSON.stringify(responseDataFitBit))
                if (responseDataFitBit.avgCals && responseDataFitBit.avgFloors && responseDataFitBit.avgMins && responseDataFitBit.avgSteps) {
                    this.setState({avgFitbitCaloriesBurntData: responseDataFitBit.avgCals})
                    this.setState({avgFitbitFloorsClimbedData: responseDataFitBit.avgFloors})
                    this.setState({avgFitbitActiveMinutesData: responseDataFitBit.avgMins})
                    this.setState({avgFitbitStepsData: responseDataFitBit.avgSteps})

                    this.setState({ fitbitDataLoaded: true })
                }
            }

            this.render()

        } else {
            //no data
            console.log("No Fitbit Data!")
        }
    }

    getNewTokens = async (refreshToken, clientId, clientSecret) => {
        const response = await fetch("https://api.fitbit.com/oauth2/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": "Basic " + encode(`${clientId}:${clientSecret}`)
            },
            body:
                "grant_type=refresh_token" +
                "&refresh_token=" + refreshToken
        });

        console.log(response)
    
        console.log(response.status === 200)
        if (response.status === 200) {
            const json = await response.json();
            const accessToken = json["access_token"];
            const refreshToken = json["refresh_token"];
            return {accessToken: accessToken, refreshToken: refreshToken};
        } else {
            console.log("Failed to get new access token and refresh token");
            return {};
        }
    };

    updateFitbitToken = async (clientId, fitbitToken) => {
        // updateFitbitToken: async (clientId, fitbitToken) => {
            const url = `https://traininggurubackend.onrender.com/Client/${clientId}/FitbitToken`;
            const options = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                    body: JSON.stringify({FitbitToken: fitbitToken})
            };
        
            try {
                const response = await fetch(url, options);
                const result = await response.json();
                console.log(result);
                return result;
            } catch (error) {
                console.log('Error updating Fitbit token:', error);
                return null;
            }
        }

    
    getFitbitData = async (accessToken) => {

        var sevenDaysAgo = moment().subtract(7, 'days').format();
        sevenDaysAgo = sevenDaysAgo.substring(0, 10);
        var today = moment().format();
        today = today.substring(0, 10);

        // const date = new Date();
        // const today = date.toISOString().substring(0, 10);
    
        // Steps data 
        const stepsResponse = await fetch(`https://api.fitbit.com/1/user/-/activities/steps/date/${sevenDaysAgo}/${today}.json`, {
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
            
        })
        // calories
        const calorieResponse = await fetch(`https://api.fitbit.com/1/user/-/activities/calories/date/${sevenDaysAgo}/${today}.json`, {
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        })
        // floors 
        const floorsResponse = await fetch(`https://api.fitbit.com/1/user/-/activities/floors/date/${sevenDaysAgo}/${today}.json`, {
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        })
        // active mintues 
        const activeminsResponse = await fetch(`https://api.fitbit.com/1/user/-/activities/minutesLightlyActive/date/${sevenDaysAgo}/${today}.json`, {
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        })
            
    
        // Wait for all responses to finish
        const [stepsData, calorieData,floorsData, activeminsData] = await Promise.all([stepsResponse.json(), calorieResponse.json(), floorsResponse.json(), activeminsResponse.json()]);
        
        console.log(calorieData)

        if (stepsResponse.status === 200 && calorieResponse.status === 200 && floorsResponse.status === 200 && activeminsResponse.status === 200) {
            
            this.setState({calorieData: calorieData})
            this.setState({floorsData: floorsData})
            this.setState({activeminsData: activeminsData})
            this.setState({stepsData: stepsData})

            // console.log(floorsData)
            // console.log(activeminsData)
            // console.log(stepsData)

            // console.log("Cal first value: " +JSON.stringify(calorieData["activities-calories"][0].value))
            
            // Get the avg calories
            var avgCals = 0;
            for (var i=1; i<8; i++) {
                // console.log(i+":" + calorieData["activities-calories"][i].value);
                avgCals = avgCals + parseInt(calorieData["activities-calories"][i].value);
            }
            
            // console.log("totCals: " + avgCals)
            avgCals = parseInt(avgCals/7);

            // console.log("avgCals: " + parseInt(avgCals))
            
            // Get the avg floors climbed
            var avgFloors = 0;
            for (var i=1; i<8; i++) {
                avgFloors += parseInt(floorsData["activities-floors"][i].value);
            }
            avgFloors = parseInt(avgFloors/7);
            
            // Get the avg active minutes
            var avgMins = 0;
            for (var i=1; i<8; i++) {
                avgMins += parseInt(activeminsData["activities-minutesLightlyActive"][i].value);
            }
            avgMins = parseInt(avgMins/7);
            
            
            // Get avg Steps Data
            var avgSteps = 0;
            for (var i=1; i<8; i++) {
                avgSteps += parseInt(stepsData["activities-steps"][i].value);
            }
            avgSteps = parseInt(avgSteps/7);
            // will return an array of data and value pairs
            
            // console.log("avgCals=" + avgCals.toFixed(2) + ", avgDist="+avgDist.toFixed(2)+",avgFloors=" +avgFloors.toFixed(2)+", avgMins="+ avgMins.toFixed(2)+", water="+ water.toFixed(2));

            return {
                avgCals, 
                avgFloors, 
                avgMins, 
                avgSteps
            };
        } else {
            // console.log(stepsResponse.status+", "+ calorieResponse.status+", "+ waterResponse.status +", "+ floorsResponse.status+", "+activeminsResponse.status +", "+ distanceResponse.status)
            // console.log("HEELOO")
            return {value: false};
        }
    };

    displayFitbitBreakdown(iconClicked){
        // var sixDaysAgo = moment().subtract(6, 'days').format();
        // sixDaysAgo = sixDaysAgo.substring(0, 10);
        // var today = moment().format();
        // today = today.substring(0, 10);
        // console.log("*****************************************")
        console.log("Display fitbit data breakdown")
        if(!this.state.fitbitDataLoaded) {
            // console.log("in no fitbit data")
            const fitbitTag = document.querySelector(".fitbit-popup-content");
    
            
            let fitbitHTML = `<div class="fitbit-popup-content-entry-headings">
                                <div class="fitbit-entry-date-heading">Date:</div>
                                <div class="fitbit-entry-value-heading">Value:</div>
                            </div>`
    
            // let dates = []
    
            for(let i = 0; i < 7; i++){
                fitbitHTML += `<div class="fitbit-popup-content-entry">`
                var date = moment().subtract(6-i, 'days').format().substring(0,10);
                fitbitHTML += `<div class="fitbit-entry-date">${date.substring(8,)}-${date.substring(5,7)}</div>`
            
    
                if(iconClicked === "calories burned") {
                    fitbitHTML += `<div class="fitbit-entry-value">1500</div>`
                } else if(iconClicked === "floors climbed") {
                    fitbitHTML += `<div class="fitbit-entry-value">5</div>`
                } else if(iconClicked === "active minutes") {
                    fitbitHTML += `<div class="fitbit-entry-value">40</div>`
                } else if(iconClicked === "steps") {
                    fitbitHTML += `<div class="fitbit-entry-value">7100</div>`
                }
                
                
                fitbitHTML += `</div>`
            }
    
            
    
            fitbitTag.innerHTML = fitbitHTML
        } else if (this.state.fitbitDataLoaded) {
            // console.log("in fitbit data")
            const fitbitTag = document.querySelector(".fitbit-popup-content");

            let fitbitHTML = `<div class="fitbit-popup-content-entry-headings">
                                <div class="fitbit-entry-date-heading">Date:</div>
                                <div class="fitbit-entry-value-heading">Value:</div>
                            </div>`

            if(iconClicked === "calories burned" && this.state.fitbitDataLoaded) {
                this.state.calorieData["activities-calories"].map((data) => {
                    fitbitHTML += `<div class='fitbit-popup-content-entry'>
                                <div class='fitbit-entry-date'>${data.dateTime.substring(8,) + "-" + data.dateTime.substring(5,7)}</div>
                                <div class='fitbit-entry-value'>${data.value}</div>
                            </div>`
                })
            }
            else if(iconClicked === "floors climbed" && this.state.fitbitDataLoaded){
                this.state.floorsData["activities-floors"].map((data) => {
                    fitbitHTML += `<div class='fitbit-popup-content-entry'>
                                <div class='fitbit-entry-date'>${data.dateTime.substring(8,) + "-" + data.dateTime.substring(5,7)}</div>
                                <div class='fitbit-entry-value'>${data.value}</div>
                            </div>`
                })
            }
            else if(iconClicked === "active minutes" && this.state.fitbitDataLoaded) {
                this.state.activeminsData["activities-minutesLightlyActive"].map((data) => {
                    fitbitHTML += `<div class='fitbit-popup-content-entry'>
                                <div class='fitbit-entry-date'>${data.dateTime.substring(8,) + "-" + data.dateTime.substring(5,7)}</div>
                                <div class='fitbit-entry-value'>${data.value}</div>
                            </div>`
                })
            }
            else if(iconClicked === "steps" && this.state.fitbitDataLoaded) {
                this.state.stepsData["activities-steps"].map((data) => {
                    fitbitHTML += `<div class='fitbit-popup-content-entry'>
                                <div class='fitbit-entry-date'>${data.dateTime.substring(8,) + "-" + data.dateTime.substring(5,7)}</div>
                                <div class='fitbit-entry-value'>${data.value}</div>
                            </div>`
                })
            }
        
        

        
            fitbitTag.innerHTML = fitbitHTML
        }


    }

    GetFitbitToken = async (clientId) => {
    // GetFitbitToken: async (clientId) => {
        const myHeaders = new Headers();
        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        const response = await fetch(`https://traininggurubackend.onrender.com/Client/${clientId}/FitbitToken`, requestOptions);



        if (response.status === 200) {
            const responseJson = await response.json();
            const fitbitToken = responseJson.FitbitToken;
            if (!fitbitToken || fitbitToken === "false" || responseJson.hasOwnProperty("error")) {
                return {value: false};
            } else {
                return {value: true, fitbitToken};
            }
        } else {
            return {value: false};
        }
    }

    handleSubmitMeeting = () => {
        const radioValue = document.querySelector('input[type = radio]:checked').value;

        const catchUpNotes = document.getElementById("catchup-notes").value;

        // ------------------- Submit CatchUp Meetings -----------------------------------
        axios.put(`https://traininggurubackend.onrender.com/CatchUp/${this.state.currentCatchupMeetingID}`, {
                "Notes": catchUpNotes,
                "Rating": radioValue,
                "Week": this.state.currentWeekNumber
            })
            .then(res =>
            {
                if(res.data)
                {
                    console.log("Client Details Updated!")
                    // this.setState({meetings: res.data})
                    // console.log(res.data)
                    this.getClients(this.state.trainerID);
                }
                else {
                    console.log("Client Details Updated!")
                }
            })

    }

    submitBlankCatchupMeeting(meetingID) {
        // ------------------- Submit CatchUp Meetings -----------------------------------
        axios.put(`https://traininggurubackend.onrender.com/CatchUp/${meetingID}`, {
                "Notes": "",
                "Rating": 3,
                "Week": this.state.currentWeekNumber
            })
            .then(res =>
            {
                if(res.data)
                {
                    console.log("Client Details Updated!")
                    this.getClients(this.state.trainerID);
                }
                else {
                    console.log("Client Details Updated!")
                }
            })
    }

    render()
    {
        return (
            
            
                <div className='catchUp'>
                    <Nav />
                    <div className='catchUp-container'>
                        <div className='goals catchup-sections'>
                            <div className='headers'>Goals</div>
                                { this.state.goals?.map((goal) => {
                                    return <div className='goals-entry'>
                                                {goal.Goal}
                                            </div>
                                    }) 
                                }
                        </div>
                        <div className='clients-dropdown'>
                            <div className={this.state.meetingStarted ? "client-name-meeting-started" : "hidden"}>
                                <div className='clients-locked-name'>{this.state.clientName}</div>
                            </div>
                            <select id="clients" value={this.state.currentClientID} className={this.state.meetingStarted ? "hidden" : 'client-heading-dropdown'}>
                                { this.state.clients?.map((client) => {
                                    return <option className='clients-dropdown-name' value={`${client.ClientID}`}>{client.Name}</option>
                                })
                            }
                            </select>
                            {this.state.meetingStarted ? <FontAwesomeIcon className='lock' icon={faLock}/> 
                            :
                            <Link to="/Manage" className='clients-manage-link'><FontAwesomeIcon className='gear-icon' icon={faGear}/></Link>
                            }
                        </div>
                        <div className='intake catchup-sections'>
                            <div className='headers'>Todays Intake</div>
                            { <div className='intake-table'>
                                        <div className='intake-table-heading'>Calories</div>
                                        <div className='intake-table-data'>{this.state.intake?.CaloriesIntake}/{this.state.intake?.TotalCalories}cal</div>
                                        <div className='intake-table-heading'>Protein</div>
                                        <div className='intake-table-data'>{this.state.intake?.ProteinIntake}/{this.state.intake?.TotalProtein}g</div>
                                        <div className='intake-table-heading'>Fat</div>
                                        <div className='intake-table-data'>{this.state.intake?.FatsIntake}/{this.state.intake?.TotalFats}g</div>
                                        <div className='intake-table-heading'>Carbs</div>
                                        <div className='intake-table-data'>{this.state.intake?.CarbohydratesIntake}/{this.state.intake?.TotalCarbohydrates}g</div>
                                    </div>
                                    
                                }
                        </div>
                        <div className='progress-chart catchup-sections'>
                            <div className='headers progress-chart-header'>Client Weight</div>
                            {/* <img className='progress-chart-image'
                                src={progressChart}
                                alt="Progress Chart"/> */}
                            <div id='progress-chart-container'>

                            </div>
                        </div>
                        <div className='fitbit-icons'>
                            {console.log("Calorie Data: " + JSON.stringify(this.state.calorieData))}
                            <div className='cal-burnt-container' onClick={() => {
                                this.setState({iconClicked: "calories burned"})
                                this.setState({isFitbitPopupClicked: !this.state.isFitbitPopupClicked})
                                this.displayFitbitBreakdown("calories burned")
                            }}>
                                <FontAwesomeIcon className='fitbit-icon calBurnt' icon={faFire}/>
                                <div className='fitbit-content'>
                                    <div className='fitbit-data'>
                                        <div className='fitbit-data-heading'>Calories Burned</div>
                                        {console.log(this.state.avgFitbitCaloriesBurntData)}
                                        { this.state.avgFitbitCaloriesBurntData != 0 ?
                                            <div>{this.state.avgFitbitCaloriesBurntData}kcl</div>
                                        :
                                        this.state.currentClientID != 5 ?
                                            <div>1500kcl</div>
                                        :
                                            <div>Please</div>
                                        }
                                        
                                    </div>
                                    { this.state.avgFitbitCaloriesBurntData != 0 ?
                                    <FontAwesomeIcon className='down-icon' icon={faChevronDown}/>
                                    : ""}
                                </div>
                            </div>
                            {/* <div>
                                <FontAwesomeIcon className='fitbit-icon waterIntake' icon={faDroplet}/>
                                <div className='fitbit-content'>
                                    <div className='fitbit-data'>
                                        <div>Water Intake</div>
                                        <div>1.5L</div>
                                    </div>
                                    <FontAwesomeIcon className='down-icon' icon={faChevronDown}/>
                                </div>
                            </div> */}
                            <div className='floors-climbed-container' onClick={() => {
                                this.setState({iconClicked: "floors climbed"})
                                this.setState({isFitbitPopupClicked: !this.state.isFitbitPopupClicked})
                                this.displayFitbitBreakdown("floors climbed")
                            }}>
                                <FontAwesomeIcon className='fitbit-icon floorsClimbed' icon={faStairs}/>
                                <div className='fitbit-content'>
                                    <div className='fitbit-data'>
                                        <div className='fitbit-data-heading'>Floors Climbed</div>
                                        { this.state.avgFitbitFloorsClimbedData != 0 ?
                                            <div>{this.state.avgFitbitFloorsClimbedData} Floors</div>
                                        :
                                        this.state.currentClientID != 5 ?
                                            <div>5 Floors</div>
                                        :
                                            <div>Connect</div>
                                        }
                                    </div>
                                    { this.state.avgFitbitFloorsClimbedData != 0 ?
                                    <FontAwesomeIcon className='up-icon' icon={faChevronUp}/>
                                    : ""}
                                </div>
                            </div>
                            <div className='active-mins-container' onClick={() => {
                                this.setState({iconClicked: "active minutes"})
                                this.setState({isFitbitPopupClicked: !this.state.isFitbitPopupClicked})
                                this.displayFitbitBreakdown("active minutes")
                            }}>
                                <FontAwesomeIcon className='fitbit-icon activeMins' icon={faBolt}/>
                                <div className='fitbit-content'>
                                    <div className='fitbit-data'>
                                        <div className='fitbit-data-heading'>Active Minutes</div>
                                        { this.state.avgFitbitActiveMinutesData != 0 ?
                                            <div>{this.state.avgFitbitActiveMinutesData} Mins</div>
                                        :
                                        this.state.currentClientID != 5 ?
                                            <div>40 Mins</div>
                                        :
                                            <div>Your</div>
                                        }
                                    </div>
                                    { this.state.avgFitbitActiveMinutesData != 0 ?
                                    <FontAwesomeIcon className='up-icon' icon={faChevronUp}/>
                                    : ""}
                                </div>
                            </div>
                            <div className='steps-container' onClick={() => {
                                this.setState({iconClicked: "steps"})
                                this.setState({isFitbitPopupClicked: !this.state.isFitbitPopupClicked})
                                this.displayFitbitBreakdown("steps")
                            }}>
                                <FontAwesomeIcon className='fitbit-icon steps-icon' icon={faShoePrints}/>
                                <div className='fitbit-content'>
                                    <div className='fitbit-data'>
                                        <div className='fitbit-data-heading'>Steps</div>
                                        { this.state.avgFitbitStepsData != 0 ?
                                            <div>{this.state.avgFitbitStepsData} Steps</div>
                                        :
                                        this.state.currentClientID != 5 ?
                                            <div>7100 Steps</div>
                                        :
                                            <div>Fitbit</div>
                                        }
                                    </div>
                                    { this.state.avgFitbitStepsData != 0 ?
                                    <FontAwesomeIcon className='up-icon' icon={faChevronUp}/>
                                    : ""}
                                </div>
                            </div>
                        </div>
                        <div className='calorie-summary catchup-sections'>
                            <div className='headers'>Current Week Intake</div>
                            <div className='calorie-summary-table'>
                                { this.state.calHistory7Days?.map((history) => {

                                    return <div>
                                            <div className='calorie-summary-day'>{history.Day}</div>
                                            <div className='calorie-summary-icon'>
                                                { history["Icon-Number"] === 0 ? 
                                                    <FontAwesomeIcon className='xmark' icon={faX}/> 
                                                : 
                                                history["Icon-Number"] === 1 ? 
                                                    <FontAwesomeIcon className='check' icon={faCheck}/> 
                                                : 
                                                    <FontAwesomeIcon className='dash' icon={faMinus}/> }
                                            </div>
                                        </div>
                                    }) 
                                }
                            </div>
                            

                            {/* { this.state.calHistory?.map((history) => {

                                return <div className='calorie-summary-icon'>
                                            { history.CaloriesHit ? <FontAwesomeIcon className='check' icon={faCheck}/> : <FontAwesomeIcon className='xmark' icon={faX}/> }
                                        </div>
                                }) 
                            } */}


                            {/* <div className='calorie-summary-icon'><FontAwesomeIcon className='check' icon={faCheck}/></div>
                            <div className='calorie-summary-icon'><FontAwesomeIcon className='xmark' icon={faX}/></div>
                            <div className='calorie-summary-icon'><FontAwesomeIcon className='check' icon={faCheck}/></div>
                            <div className='calorie-summary-icon'><FontAwesomeIcon className='check' icon={faCheck}/></div>
                            <div className='calorie-summary-icon'><FontAwesomeIcon className='dash' icon={faMinus}/></div>
                            <div className='calorie-summary-icon'><FontAwesomeIcon className='dash' icon={faMinus}/></div>
                            <div className='calorie-summary-icon'><FontAwesomeIcon className='dash' icon={faMinus}/></div> */}

                        </div>
                        <div className='feedback-summary catchup-sections'>
                            <div className='headers checkin-header'>Weekly Checkin Rankings</div>
                            <div className='feedback-summary-table'>
                                <div className='feedback-summary-table-weeks-row' id='feedback-weeks'>
                                    {/* <div className='feedback-summary-week'>1</div>*/}
                                    { this.state.displayCatchupHistory.map((feedback) => {
                                        return <div className='feedback-summary-week'>{feedback["Week"]}</div>
                                    }) }
                                </div>
                                <div className='feedback-summary-table-feedback-row' id='feedback-icons'>
                                    {/* <div className='feedback-summary-icon'><FontAwesomeIcon className='thumbs-up' icon={faThumbsUp}/></div>
                                    <div className='feedback-summary-icon'><FontAwesomeIcon className='thumbs-down' icon={faThumbsDown}/></div>
                                    <div className='feedback-summary-icon'><FontAwesomeIcon className='dash' icon={faMinus}/></div> */}
                                    { this.state.displayCatchupHistory.map((feedback) => {
                                        return feedback["Icon-Number"] === 0 ?
                                            <div className='feedback-summary-icon'><FontAwesomeIcon className='thumbs-down' icon={faThumbsDown}/></div>
                                        :
                                        feedback["Icon-Number"] === 1 ?
                                            <div className='feedback-summary-icon'><FontAwesomeIcon className='thumbs-middle' icon={faThumbsUp}/></div>
                                        :
                                        feedback["Icon-Number"] === 2 ?
                                            <div className='feedback-summary-icon'><FontAwesomeIcon className='thumbs-up' icon={faThumbsUp}/></div>
                                        :
                                            <div className='feedback-summary-icon'><FontAwesomeIcon className='dash' icon={faMinus}/></div>
                                    }) }
                                </div>
                                
                                


                                

                            </div>
                            
                        </div>
                        <div className='personal-bests catchup-sections'>
                            <div className='headers'>Personal Bests</div>
                            <div className='personal-bests-content'>
                                {   this.state.pbs?.map((PB) => {
                                        return <div className='personal-bests-entry'>
                                            <div className='personal-bests-entry-data'>
                                                <div className='personal-bests-exercise'>{PB.Exercise.Name}</div>
                                                <div className='personal-bests-previous'>{PB.LastPB}</div>
                                                <FontAwesomeIcon className='up-icon' icon={faChevronUp}/>
                                                <div className='personal-bests-new'>{PB.PersonalBest}</div>
                                            </div>
                                        </div>
                                    })
                                }
                            </div>
                        </div>
                        <div className='schedule catchup-sections'>
                            {/* <FontAwesomeIcon icon={faLessThan}/> */}
                            <div className='headers schedule-header'>Schedule</div>
                            {/* <FontAwesomeIcon icon={faGreaterThan}/> */}
                            <div className='carousel'>
                                <div className='button-left hidden'>
                                    <FontAwesomeIcon icon={faLessThan}/>
                                </div>
                                <div className='track-container'>
                                    <ul className='track'>
                                        <li className='slide current-slide'>
                                            {   this.state.schedule.days?.slice(0,7).map((day) => {
                                                    var found = false;
                                                    var dayNumber = 0;
                                                    return <div className='slide-content'>
                                                        <div className='slide-content-day'>{day.day}</div>
                                                        <div className='slide-content-date'>{day.date}</div>
                                                        { this.state.clientWorkoutsPrevWeek?.map((clientWorkout) => {
                                                            var d = new Date(clientWorkout.Date);
                                                            dayNumber = d.getDay();
                                                            if(dayNumber == 0) {
                                                                dayNumber=6;
                                                            } else {
                                                                dayNumber -= 1;
                                                            }
                                                            var workoutDay = this.state.daysOfTheWeek[dayNumber];
                                                            if(day.day.localeCompare(workoutDay)==0){
                                                                found = true;
                                                                return <div><div className='slide-content-workout'>{clientWorkout.TrainerWorkout.WorkoutName}</div>
                                                                <div className='see-notes' onClick={() => {
                                                                    this.setState({ isPopupClicked: !this.state.isPopupClicked });
                                                                    this.setState({ clientWorkoutNotes: this.getClientNotesForOneWorkout(clientWorkout.ClientWorkoutID) });
                                                                    this.setState({ workoutName: clientWorkout.TrainerWorkout.WorkoutName });
                                                                }}>See notes</div></div>
                                                            } 
                                                            })
                                                        }
                                                        

                                                        {/* <div>Chest Beginner</div>
                                                        <div onClick={() => this.setState({ isPopupClicked: !this.state.isPopupClicked })}>notes</div>
                                                        <div className={this.state.isPopupClicked ? 'popup' : 'hidden'}>
                                                            This is the notes popup!
                                                            <div onClick={() => this.setState({ isPopupClicked: !this.state.isPopupClicked })}>Close</div>
                                                        </div> */}
                                                    </div>
                                                })
                                            }
                                        </li>
                                        <li className='slide'>
                                            {   this.state.schedule.days?.slice(7,14).map((day) => {
                                                    var found = false;
                                                    var dayNumber = 0;
                                                    return <div className='slide-content'>
                                                        <div className='slide-content-day'>{day.day}</div>
                                                        <div className='slide-content-date'>{day.date}</div>
                                                        { this.state.clientWorkouts?.map((clientWorkout) => {
                                                            var d = new Date(clientWorkout.Date);
                                                            dayNumber = d.getDay();
                                                            if(dayNumber == 0) {
                                                                dayNumber=6;
                                                            } else {
                                                                dayNumber -= 1;
                                                            }
                                                            var workoutDay = this.state.daysOfTheWeek[dayNumber];
                                                            if(day.day.localeCompare(workoutDay)==0){
                                                                found = true;
                                                                return <div><div className='slide-content-workout'>{clientWorkout.TrainerWorkout.WorkoutName}</div>
                                                                <div className='see-notes' onClick={() => {
                                                                    this.setState({ isPopupClicked: !this.state.isPopupClicked });
                                                                    this.setState({ clientWorkoutNotes: this.getClientNotesForOneWorkout(clientWorkout.ClientWorkoutID) });
                                                                    this.setState({ workoutName: clientWorkout.TrainerWorkout.WorkoutName });
                                                                }}>See notes</div></div>
                                                            }
                                                            })
                                                        }
                                                        

                                                        {/* <div>Chest Beginner</div>
                                                        <div onClick={() => this.setState({ isPopupClicked: !this.state.isPopupClicked })}>notes</div>
                                                        <div className={this.state.isPopupClicked ? 'popup' : 'hidden'}>
                                                            This is the notes popup!
                                                            <div onClick={() => this.setState({ isPopupClicked: !this.state.isPopupClicked })}>Close</div>
                                                        </div> */}
                                                    </div>
                                                })
                                            }
                                        </li>
                                        <li className='slide'>
                                            {   this.state.schedule.days?.slice(14,21).map((day) => {
                                                    var found = false;
                                                    var dayNumber = 0;
                                                    return <div className='slide-content'>
                                                        <div className='slide-content-day'>{day.day}</div>
                                                        <div className='slide-content-date'>{day.date}</div>
                                                        { this.state.clientWorkoutsNextWeek?.map((clientWorkout) => {
                                                            var d = new Date(clientWorkout.Date);
                                                            dayNumber = d.getDay();
                                                            if(dayNumber == 0) {
                                                                dayNumber=6;
                                                            } else {
                                                                dayNumber -= 1;
                                                            }
                                                            var workoutDay = this.state.daysOfTheWeek[dayNumber];
                                                            if(day.day.localeCompare(workoutDay)==0){
                                                                found = true;
                                                                return <div><div className='slide-content-workout'>{clientWorkout.TrainerWorkout.WorkoutName}</div>
                                                                <div className='see-notes' onClick={() => {
                                                                    this.setState({ isPopupClicked: !this.state.isPopupClicked });
                                                                    this.setState({ clientWorkoutNotes: this.getClientNotesForOneWorkout(clientWorkout.ClientWorkoutID) });
                                                                    this.setState({ workoutName: clientWorkout.TrainerWorkout.WorkoutName });
                                                                }}>See notes</div></div>
                                                            }
                                                            })
                                                        }
                                                        

                                                        {/* <div>Chest Beginner</div>
                                                        <div onClick={() => this.setState({ isPopupClicked: !this.state.isPopupClicked })}>notes</div>
                                                        <div className={this.state.isPopupClicked ? 'popup' : 'hidden'}>
                                                            This is the notes popup!
                                                            <div onClick={() => this.setState({ isPopupClicked: !this.state.isPopupClicked })}>Close</div>
                                                        </div> */}
                                                    </div>
                                                })
                                            }
                                        </li>
                                    </ul>
                                </div>
                                <div className='button-right'>
                                    <FontAwesomeIcon icon={faGreaterThan}/>
                                </div>
                                <div className='carousel-nav'>
                                    <button className='carousel-nav-indicator nav-current-slide'></button>
                                    <button className='carousel-nav-indicator'></button>
                                    <button className='carousel-nav-indicator'></button>
                                </div>
                            </div>
                            
                        </div>
                        
                    </div>
                    <div className='catch-up-meeting-form'>
                        {/* <div id='is-meeting-scheduled-alert'></div> */}
                        
                        { this.state.isMeetingScheduled ?
                            this.state.meetingStarted ? 
                                <div className='cancel-submit-buttons-container'>
                                    <button className='cancel-meeting-button meeting-buttons' onClick={() => this.setState({ meetingStarted: !this.state.meetingStarted })}>Cancel</button>
                                    <button className='submit-meeting-button meeting-buttons' onClick={() => this.setState({ isSubmitMeetingPopupClicked: !this.state.isSubmitMeetingPopupClicked })}>Submit</button>
                                </div> 
                                : 
                                <button className='start-meeting-button meeting-buttons' onClick={() => {
                                    this.setState({ isStartMeetingPopupClicked: !this.state.isStartMeetingPopupClicked })
                                    this.setState({ clientName: this.getClientName(this.state.currentClientID) })
                                }}>Start Meeting</button>
                        :
                            <></>
                        }
                        
                    </div>
                    <div className={this.state.isStartMeetingPopupClicked ? 'start-meeting-confirmation-popup sections' : 'hidden'}>
                        <div className='popup-nav'>
                            <FontAwesomeIcon onClick={() => this.setState({ isStartMeetingPopupClicked: !this.state.isStartMeetingPopupClicked })} className='start-meeting-popup-close-button' icon={faX}/>
                        </div>
                        <div className='start-meeting-confirmation-popup-content'>
                            <div className='start-meeting-confirmation-text'>Start Meeting With</div>
                            {/* <div className='start-meeting-confirmation-name'>{ document.getElementById("clients").value }</div> */}
                            <div className='start-meeting-confirmation-name'>{this.state.clientName}</div>
                        </div>
                        <div className='start-meeting-confirmation-button'><button className='start-meeting-button meeting-buttons confirmation-button' onClick={() => {
                            this.setState({ isStartMeetingPopupClicked: !this.state.isStartMeetingPopupClicked });
                            this.setState({ meetingStarted: !this.state.meetingStarted });

                        }}>Start Meeting</button></div>
                    </div>
                    <div className={this.state.isSubmitMeetingPopupClicked ? 'submit-meeting-popup sections' : 'hidden'}>
                        <div className='submit-meeting-icons'>
                            {/* <div className='submit-meeting-icon'><FontAwesomeIcon className='thumbs-up' icon={faThumbsUp}/></div>
                            <div className='submit-meeting-icon'><FontAwesomeIcon className='face-thinking' icon={faThumbsUp}/></div>
                            <div className='submit-meeting-icon'><FontAwesomeIcon className='thumbs-down' icon={faThumbsDown}/></div> */}
                            <input type='radio' name='feedback' id="thumbs-up" value={2}/>
                            <label className='thumbs-radio' htmlFor="thumbs-up"><FontAwesomeIcon className='thumbs-up' icon={faThumbsUp}/></label>

                            <input type='radio' name='feedback' id="thumbs-middle" value={1}/>
                            <label className='thumbs-radio' htmlFor="thumbs-middle"><FontAwesomeIcon className='thumbs-middle' icon={faThumbsUp}/></label>

                            <input type='radio' name='feedback' id="thumbs-down" value={0}/>
                            <label className='thumbs-radio' htmlFor="thumbs-down"><FontAwesomeIcon className='thumbs-down' icon={faThumbsDown}/></label>

                        </div>
                        <div className='submit-catchup-notes catchup-notes-textbox-container' id='catchup-notes-container'>
                            <textarea className='catchup-notes-textbox' id='catchup-notes' placeholder='Enter Catch Up notes in here...'></textarea>
                        </div>
                        <div className='submit-meeting-confirmation-button'>
                            <button className='cancel-submit-meeting-button meeting-buttons' onClick={() => this.setState({ isSubmitMeetingPopupClicked: !this.state.isSubmitMeetingPopupClicked })}>Cancel</button>
                            <button className='submit-meeting-button meeting-buttons' onClick={() => {
                                this.setState({ isSubmitMeetingPopupClicked: !this.state.isSubmitMeetingPopupClicked });
                                this.setState({ meetingStarted: !this.state.meetingStarted });
                                /* Submit details */
                                this.handleSubmitMeeting()
                            }}>Submit</button>
                        </div>
                    </div>
                    <div className={this.state.isPopupClicked ? 'popup-container' : this.state.isSubmitMeetingPopupClicked ? 'popup-container' : this.state.isStartMeetingPopupClicked ? 'popup-container' : this.state.isFitbitPopupClicked ? 'popup-container' : 'hidden'}></div>
                    <div className={this.state.isPopupClicked ? 'workout-notes-popup sections' : 'hidden' }>
                        <div className='popup-nav'>
                            <div className='headers'>{this.state.workoutName}</div>
                            <FontAwesomeIcon onClick={() => this.setState({ isPopupClicked: !this.state.isPopupClicked })} className='workout-notes-popup-close-button' icon={faX}/>
                        </div>
                        {/* loop through notes array */}
                        
                        <div className='workout-notes-content'>
                            {/* used daysTag from calendar  */}
                        </div>
                    </div>
                    <div className={this.state.isFitbitPopupClicked ? 'fitbit-popup sections' : 'hidden' }>
                        <div className='popup-nav'>
                            <div className='headers fitbit-popup-header'>{this.state.iconClicked}</div>
                            <FontAwesomeIcon onClick={() => {
                                this.setState({ isFitbitPopupClicked: !this.state.isFitbitPopupClicked })
                            }} className='fitbit-popup-close-button' icon={faX}/>
                        </div>
                        <div className='fitbit-popup-content'>
                            
                            
                            
                        </div>
                    </div>
                </div>
        )
    }
}