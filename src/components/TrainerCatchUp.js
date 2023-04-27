import React, { Component } from 'react';

import Nav from './Nav';
import { Link } from 'react-router-dom';

import axios from 'axios';
import moment from 'moment';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronUp, faChevronDown, faLock } from "@fortawesome/free-solid-svg-icons";

import {faFire} from "@fortawesome/free-solid-svg-icons/faFire";
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
            weight: [],
            schedule: {},
            isPopupClicked: false,
            meetingStarted: false,
            isStartMeetingPopupClicked: false,
            isSubmitMeetingPopupClicked: false,
            clientWorkouts: [],
            clientWorkoutsPrevWeek: [],
            clientWorkoutsNextWeek: [],
            clientWorkoutNotes: [],
            workoutName: "",
            clientName: "",
            currentWeekNumber: 5,
            daysOfTheWeek: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        }
    }

    handleClientChange = (event) => {
        // console.log(parseInt(event.target.value)+5);
        localStorage.currentID = event.target.value;
        this.setState({currentClientID: event.target.value});
        this.setState({goals: this.getClientGoals(event.target.value)});
        this.setState({intake: this.getClientIntake(event.target.value)});
        
        this.setState({calHistory: this.getClientCalHistory(event.target.value)});
        // this.setState({calHistory7Days: this.getCalorieSummary7Days()});

        this.setState({catchupHistory: this.getClientCatchUpHistory(event.target.value)});
        this.setState({pbs: this.getClientPBs(event.target.value)});
        this.setState({weight: this.getClientWeight(event.target.value)});

        this.setState({clientWorkouts: this.getWorkoutsForWeek(event.target.value, this.state.currentWeekNumber)});
        this.setState({clientWorkoutsPrevWeek: this.getWorkoutsForPrevWeek(event.target.value, this.state.currentWeekNumber-1)});
        this.setState({clientWorkoutsNextWeek: this.getWorkoutsForNextWeek(event.target.value, this.state.currentWeekNumber+1)});
    }

    componentDidMount()
    {
        // const script = document.createElement("script");

        // script.src = "../js/TrainerCatchUpCarousel.js";
        // script.async = true;

        // document.body.appendChild(script);

        // console.log(this.props.match.params.id);

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

        // console.log(track.style.left);

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

            // console.log(nextSlide);
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

            // console.log(nextSlide);
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
            });
        // fetch(`https://traininggurubackend.onrender.com/Trainer/1/Clients`)
        //     .then((response) => response.json())
        //     // .then((actualData) => console.log(actualData[0]))
        //     .then((actualData) => this.setState({clients: actualData}));

        // -------------------------- select -------------------------
        const clientSelect = document.getElementById("clients");
        // console.log(clientSelect);
        // clientSelect.value = this.state.currentClientID;
        // console.log(clientSelect.value);
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

        

        // this.setTextboxHeight('catchup-notes');

        this.fitbitData();

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

    getClientName(currentClientID) {
        // -------------------------- client name ------------------------------
        axios.get(`https://traininggurubackend.onrender.com/Client/${currentClientID}/Name`)
            .then(res =>
            {
                if(res.data)
                {
                    console.log("Goals Data read!")
                    this.setState({clientName: res.data.Name})
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

    getClientWeight(currentClientID) {
        // -------------------------- weight ------------------------------
        axios.get(`https://traininggurubackend.onrender.com/ClientWeight/${currentClientID}`)
            .then(res =>
            {
                if(res.data)
                {
                    console.log("Weight Data read!")
                    this.setState({weight: res.data})
                }
                else {
                    console.log("Data not Found!")
                }
            })
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
                }
                else {
                    console.log("Data not Found!")
                }
            })

            // let mondaysDate = moment().startOf('isoweek').format();
            // let mondaysDateString = mondaysDate.substring(0, 10);
    }

    getClientNotesForOneWorkout(clientWorkoutID) {
        // -------------------------- catchup History ------------------------------
        axios.get(`https://traininggurubackend.onrender.com/Client/WorkoutNote/${clientWorkoutID}`)
            .then(res =>
            {
                if(res.data)
                {
                    console.log("workout notes Data read!")
                    console.log(res.data)
                    if(res.data.Notes === null) {
                        this.setState({clientWorkoutNotes: JSON.parse('{ "Notes" : "No Notes to Display" }') })    
                    } else {
                        this.setState({clientWorkoutNotes: res.data})
                    }
                    
                }
                else {
                    console.log("Data not Found!")
                }
            })
    }

    getCalorieSummary7Days(calHistory) {
        var calorieSummaryString = '['
        var dayNumber = 0;
        for(let i = 5; i>=0; i--) {
            var d = new Date(calHistory[i]?.Date);
            // console.log(d)
            dayNumber = d.getDay();
            if(dayNumber == 0) {
                dayNumber = 6;
            } else {
                dayNumber -= 1;
            }
            // console.log(dayNumber)
            var dayString = this.state.daysOfTheWeek[dayNumber]?.substring(0,1);
            // console.log(dayString);
            calorieSummaryString += '{ "Day": "' + dayString + '", "CaloriesHit": ' + calHistory[i]?.CaloriesHit + '},';
        }

        dayNumber++;
        calorieSummaryString += '{ "Day": "' + this.state.daysOfTheWeek[dayNumber]?.substring(0,1) + '", "CaloriesHit": "dash"}';

        calorieSummaryString += ']';
        
        this.setState({ calHistory7Days: JSON.parse(calorieSummaryString) })
        console.log(this.state.calHistory7Days);
    }

    // setTextboxHeight(fieldID) {
    //     document.getElementById(fieldID).style.height = document.getElementById(fieldID).scrollHeight+'px';
    // }

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

    fitbitData(){
    let myHeaders = new Headers();
    myHeaders.append("Authorization", "Basic MjM5OTRMOjhjNGJiZjE1M2M4OTRiMjIyM2ZmODBmMGRiZmI3YmEy");
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append("Cookie", "JSESSIONID=0E7DFB9921C5414C1BFE58216ED818AD.fitbit1; fct=9db8e060df1748829e7113b43979bf81");

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow'
    };

    
    // const [fitbitResult, setResult] = useState(null);

    // const [accessToken, setAccessToken] = useState(null);
    // const [refreshToken, setRefreshToken] = useState("1916ed6ab1c9f415ef76ecc1c8ef5cf44563416b6f510f0e7fc3b56b0a650126");

    // fetch(`https://api.fitbit.com/oauth2/token?grant_type=refresh_token&refresh_token=`+refreshToken, requestOptions)
    //     .then(response => response.json())
    //     // .then(result => console.log(result))
    //     .then(result => {
    //         setAccessToken(result["access_token"]);
    //         setRefreshToken(result["refresh_token"]);
    //     })
    //     // .then(result => )
    //     .catch(error => console.log('error', error));

    let accessToken = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMzk5NEwiLCJzdWIiOiI5VDNRVkQiLCJpc3MiOiJGaXRiaXQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOiJyc29jIHJzZXQgcm94eSBycHJvIHJudXQgcnNsZSByYWN0IHJyZXMgcmxvYyByd2VpIHJociBydGVtIiwiZXhwIjoxNjc5NDMxMTg0LCJpYXQiOjE2Nzk0MDIzODR9.uactQfqAOdHORJd_eIApsuJmGCBzENTT8TxFcibHJYo";

    // console.log("Access: " + accessToken);
    // console.log("Refresh: " + refreshToken);

    // workout dates for last 7 days 
    // function Last7Days () {
    //     var result = [];
    //     for (var i=0; i<7; i++) {
    //         var d = new Date();
    //         d.setDate(d.getDate() - i);
    //         result.push( d ); //.formatDate("YYYY-MM-DD")
    //     }

    //     // console.log(result)

    //     return(result.join(','));
    // }

    // var result = Last7Days();

    var sevenDaysAgo = moment().subtract(7, 'days').format();
    sevenDaysAgo = sevenDaysAgo.substring(0, 10);
    var today1 = moment().format();
    today1 = today1.substring(0, 10);

    // console.log("7:" + sevenDaysAgo)

    
    const getFitbitData = async () => {
        //     let accessToken = await getAccessToken(authorizationCode);
        //     // const date =  new Date(2023, 0, 29);
        //     // const today = date.toISOString().substring(0, 10);			// may need
            
            
            // Steps data 
            const stepsResponse = await fetch(`https://api.fitbit.com/1/user/-/activities/steps/date/${sevenDaysAgo}/${today1}.json`, {
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
                
            })
            // calories
            const calorieResponse = await fetch(`https://api.fitbit.com/1/user/-/activities/calories/date/${sevenDaysAgo}/${today1}.json`, {
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            })
            // water
            const waterResponse = await fetch(`https://api.fitbit.com/1/user/-/foods/log/water/date/2023-02-03.json`, {
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            })
            // floors 
            const floorsResponse = await fetch(`https://api.fitbit.com/1/user/-/activities/floors/date/${sevenDaysAgo}/${today1}.json`, {
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            })
            // active mintues 
            const activeminsResponse = await fetch(`https://api.fitbit.com/1/user/-/activities/minutesLightlyActive/date/${sevenDaysAgo}/${today1}.json`, {
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            })
                
            // distance travelled
            const distanceResponse = await fetch(`https://api.fitbit.com/1/user/-/activities/distance/date/${sevenDaysAgo}/${today1}.json`, {
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            })
            
            
            
            // Wait for all responses to finish
            const [stepsData, calorieData, waterData,floorsData, activeminsData, distanceData] = await Promise.all([stepsResponse.json(), calorieResponse.json(), waterResponse.json(),floorsResponse.json(), activeminsResponse.json(),distanceResponse.json()]);
            if (stepsResponse.status === 200 && calorieResponse.status === 200 && waterResponse.status === 200 && floorsResponse.status === 200 && activeminsResponse.status === 200 && distanceResponse.status === 200) {
                
                // console.log("Cal first value: " +JSON.stringify(calorieData["activities-calories"][0].value))
                
                // Get the avg calories
                var avgCals = 0;
                for (var i=0; i<7; i++) {
                    // console.log(i+":" + calorieData["activities-calories"][i].value);
                    avgCals = avgCals + parseFloat(calorieData["activities-calories"][i].value);
                }
                // console.log("totCals: " + avgCals)
                avgCals = avgCals/7.0;
                
                // Get the avg floors climbed
                var avgFloors = 0;
                for (var i=0; i<7; i++) {
                    avgFloors += parseFloat(floorsData["activities-floors"][i].value);
                }
                avgFloors = avgFloors/7.0;
                
                // Get the avg active minutes
                var avgMins = 0;
                for (var i=0; i<7; i++) {
                    avgMins += parseFloat(activeminsData["activities-minutesLightlyActive"][i].value);
                }
                avgMins = avgMins/7.0;
                
                // Get the avg distance
                var avgDist = 0;
                for (var i=0; i<7; i++) {
                    avgDist += parseFloat(distanceData["activities-distance"][i].value);
                }
                avgDist = avgDist/7.0;
                
                // Get water data
                var water = waterData.summary.water;
                
                // Get Steps Data
                // will return an array of data and value pairs
                
                // console.log("avgCals=" + avgCals.toFixed(2) + ", avgDist="+avgDist.toFixed(2)+",avgFloors=" +avgFloors.toFixed(2)+", avgMins="+ avgMins.toFixed(2)+", water="+ water.toFixed(2));
    
                return avgCals, avgDist, avgFloors, avgMins, water, stepsData;
            } else {
                // console.log(stepsResponse.status+", "+ calorieResponse.status+", "+ waterResponse.status +", "+ floorsResponse.status+", "+activeminsResponse.status +", "+ distanceResponse.status)
                // console.log("HEELOO")
                return {value: false};
            }
        };
    
        
        // const data = getFitbitData();
        // console.log(data);
    
    
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
                            <FontAwesomeIcon className='lock' icon={faLock}/>
                        </div>
                        <select id="clients" value={this.state.currentClientID} className={this.state.meetingStarted ? "hidden" : 'client-heading-dropdown'}>
                            { this.state.clients?.map((client) => {
                                    return <option className='clients-dropdown-name' value={`${client.ClientID}`}>{client.Name}</option>
                                })
                            }
                        </select>
                        <Link to="/Manage" className='clients-manage-link'><FontAwesomeIcon className='gear-icon' icon={faGear}/></Link>
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
                        <div className='headers'>Client Weight</div>
                        <img className='progress-chart-image'
                            src={progressChart}
                            alt="Progress Chart"/>
                    </div>
                    <div className='fitbit-icons'>
                        <div>
                            <FontAwesomeIcon className='fitbit-icon calBurnt' icon={faFire}/>
                            <div className='fitbit-content'>
                                <div className='fitbit-data'>
                                    <div className='fitbit-data-heading'>Calories Burnt</div>
                                    <div>1500kcl</div>
                                </div>
                                <FontAwesomeIcon className='down-icon' icon={faChevronDown}/>
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
                        <div>
                            <FontAwesomeIcon className='fitbit-icon floorsClimbed' icon={faStairs}/>
                            <div className='fitbit-content'>
                                <div className='fitbit-data'>
                                    <div className='fitbit-data-heading'>Floors Climbed</div>
                                    <div>5 Floors</div>
                                </div>
                                <FontAwesomeIcon className='up-icon' icon={faChevronUp}/>
                            </div>
                        </div>
                        <div>
                            <FontAwesomeIcon className='fitbit-icon activeMins' icon={faBolt}/>
                            <div className='fitbit-content'>
                                <div className='fitbit-data'>
                                    <div className='fitbit-data-heading'>Active Minutes</div>
                                    <div>40 Min</div>
                                </div>
                                <FontAwesomeIcon className='up-icon' icon={faChevronUp}/>
                            </div>
                        </div>
                        <div>
                            <FontAwesomeIcon className='fitbit-icon steps-icon' icon={faShoePrints}/>
                            <div className='fitbit-content'>
                                <div className='fitbit-data'>
                                    <div className='fitbit-data-heading'>Steps</div>
                                    <div>2.1km</div>
                                </div>
                                <FontAwesomeIcon className='up-icon' icon={faChevronUp}/>
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
                                            { history.CaloriesHit ? <FontAwesomeIcon className='check' icon={faCheck}/> : !history.CaloriesHit ? <FontAwesomeIcon className='xmark' icon={faX}/> : history.CaloriesHit.localeCompare("dash") === 0 ? <FontAwesomeIcon className='dash' icon={faMinus}/> : <div></div> }
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
                        <div className='headers'>Weekly Checkin Rankings</div>
                        <div className='feedback-summary-table'>
                            
                            <div className='feedback-summary-day'>1</div>
                            <div className='feedback-summary-day'>2</div>
                            <div className='feedback-summary-day'>3</div>
                            <div className='feedback-summary-day'>4</div>
                            <div className='feedback-summary-day'>5</div>
                            <div className='feedback-summary-day'>6</div>
                            <div className='feedback-summary-day'>7</div>

                            
                            <div className='feedback-summary-icon'><FontAwesomeIcon className='thumbs-up' icon={faThumbsUp}/></div>
                            <div className='feedback-summary-icon'><FontAwesomeIcon className='thumbs-down' icon={faThumbsDown}/></div>
                            <div className='feedback-summary-icon'><FontAwesomeIcon className='thumbs-up' icon={faThumbsUp}/></div>
                            <div className='feedback-summary-icon'><FontAwesomeIcon className='thumbs-up' icon={faThumbsUp}/></div>
                            <div className='feedback-summary-icon'><FontAwesomeIcon className='thumbs-down' icon={faThumbsDown}/></div>
                            <div className='feedback-summary-icon'><FontAwesomeIcon className='thumbs-down' icon={faThumbsDown}/></div>
                            <div className='feedback-summary-icon'><FontAwesomeIcon className='dash' icon={faMinus}/></div>

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
                                                        // console.log(clientWorkout.Date + " " + workoutDay);
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
                                                        // console.log(clientWorkout.Date + " " + workoutDay);
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
                                                        // console.log(clientWorkout.Date + " " + workoutDay);
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
                    {this.state.meetingStarted ? 
                        <div className='cancel-submit-buttons-container'>
                            <button className='cancel-meeting-button meeting-buttons' onClick={() => this.setState({ meetingStarted: !this.state.meetingStarted })}>Cancel</button>
                            <button className='submit-meeting-button meeting-buttons' onClick={() => this.setState({ isSubmitMeetingPopupClicked: !this.state.isSubmitMeetingPopupClicked })}>Submit</button>
                        </div> 
                        : 
                        <button className='start-meeting-button meeting-buttons' onClick={() => {
                            this.setState({ isStartMeetingPopupClicked: !this.state.isStartMeetingPopupClicked })
                            this.setState({ clientName: this.getClientName(this.state.currentClientID) })
                        }}>Start Meeting</button>}
                </div>
                <div className={this.state.isStartMeetingPopupClicked ? 'start-meeting-confirmation-popup sections' : 'hidden'}>
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
                        <input type='radio' name='feedback' id="thumbs-up"/>
                        <label for="thumbs-up"><FontAwesomeIcon className='thumbs-up' icon={faThumbsUp}/></label>

                        <input type='radio' name='feedback' id="thumbs-middle"/>
                        <label for="thumbs-middle"><FontAwesomeIcon className='thumbs-middle' icon={faThumbsUp}/></label>

                        <input type='radio' name='feedback' id="thumbs-down"/>
                        <label for="thumbs-down"><FontAwesomeIcon className='thumbs-down' icon={faThumbsDown}/></label>

                    </div>
                    <div className='submit-catchup-notes catchup-notes-textbox-container' id='catchup-notes-container'>
                        <textarea className='catchup-notes-textbox' id='catchup-notes'></textarea>
                    </div>
                    <div className='submit-meeting-confirmation-button'>
                        <button className='submit-meeting-button meeting-buttons' onClick={() => {
                            this.setState({ isSubmitMeetingPopupClicked: !this.state.isSubmitMeetingPopupClicked });
                            this.setState({ meetingStarted: !this.state.meetingStarted });
                            /* Submit details */
                        }}>Submit</button>
                    </div>
                </div>
                <div className={this.state.isPopupClicked ? 'workout-notes-popup sections' : 'hidden' }>
                    <div className='popup-nav'>
                        <div className='headers'>{this.state.workoutName}</div>
                        <FontAwesomeIcon onClick={() => this.setState({ isPopupClicked: !this.state.isPopupClicked })} className='workout-notes-popup-close-button' icon={faX}/>
                    </div>
                    <div>{this.state.clientWorkoutNotes?.Notes}</div>
                </div>
            </div>
        )
    }
}