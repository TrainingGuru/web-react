import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import Nav from './Nav';

import pieChart from '../pieChart.png'

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faThumbsUp} from "@fortawesome/free-solid-svg-icons/faThumbsUp";
import {faThumbsDown} from "@fortawesome/free-solid-svg-icons/faThumbsDown";
import {faChartSimple} from "@fortawesome/free-solid-svg-icons/faChartSimple";
import {faGear} from "@fortawesome/free-solid-svg-icons/faGear";
import {faPlus} from "@fortawesome/free-solid-svg-icons/faPlus";
import {faPenToSquare} from "@fortawesome/free-solid-svg-icons/faPenToSquare";
import {faX} from "@fortawesome/free-solid-svg-icons/faX";

import { faLessThan, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faGreaterThan } from '@fortawesome/free-solid-svg-icons';


import '../css/TrainerHome.css';
// import { scheduler } from 'timers/promises';

export default class TrainerHome extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            isPopupClicked: false,
            clients: [],
            meetings: [],
            clientValue: 0,
            dateValue: "",
            timeValue: "",
            selectedDate: "",
            count: 0,
            isAddClientPopupClicked: false,
            isEditClientPopupClicked: false,
            displayPopupContainer: false

        }
    }

    componentDidMount()
    {

        
        //------------------------- Clients ----------------------------------------------
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

        // ------------------- Upcoming Meetings -----------------------------------
        axios.get(`https://traininggurubackend.onrender.com/Trainer/1/UpcomingMeetings`)
            .then(res =>
            {
                if(res.data)
                {
                    console.log("Meeting Data read!")
                    this.setState({meetings: res.data})
                    // console.log(res.data)
                    this.getCalendar(res.data);
                }
                else {
                    console.log("Data not Found!")
                }
            })

        const clientSelect = document.getElementById("clients");
        clientSelect.addEventListener('change', this.handleClientChange);

        
    
    }

    getCalendar(meetings) {
        const currentDate = document.querySelector(".current-date"),
        daysTag = document.querySelector(".days"),
        prevNextIcon = document.querySelectorAll(".icons span"),
        eventCurrentDay = document.querySelector(".event-current-day");

        let date = new Date(),
        currYear = date.getFullYear(),
        currMonth = date.getMonth();

        const months = ["January", "February", "March", "April", "May", "June", "July", 
                        "August", "September", "October", "November", "December"];

        const renderCalendar = () => {
            let firstDayofMonth = new Date(currYear, currMonth, 1).getDay(),
            lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(),
            lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay(),
            lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate(),
            currentDay = 1;

            let liTag = "";

            for (let i = firstDayofMonth; i > 0; i--) {
                liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`
            }

            for (let i = 1; i <= lastDateofMonth; i++) {
                let isToday = i === date.getDate() && currMonth === new Date().getMonth()
                            && currYear === new Date().getFullYear() ? "active" : "";
                if(isToday) {
                    currentDay = i;
                }
                liTag += `<li id="${i}" class="${isToday} current-month">${i}`
                
                // console.log(new Date("2023-04-28").getFullYear() === currYear && new Date("2023-04-28").getDate() === i && new Date("2023-04-28").getMonth() === currMonth)
                
                meetings.some((meeting) => 
                    new Date(meeting.Date).getFullYear() === currYear && new Date(meeting.Date).getDate() === i && new Date(meeting.Date).getMonth() === currMonth
                ) && (
                    liTag += `<div class="dot"></div>`
                )

                liTag += `</li>`;

                // console.log(liTag)
            }

            for (let i = lastDayofMonth; i < 6; i++) {
                liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`
            }
            

            // console.log(currMonth)
            currentDate.innerText = `${months[currMonth]} ${currYear}`
            daysTag.innerHTML = liTag;
            eventCurrentDay.innerText = `${months[currMonth]} ${currentDay}, ${currYear}`

            let daysLi = document.querySelectorAll(".days .current-month");

            daysLi.forEach(day => {
                day.addEventListener("click", () => {
                    eventCurrentDay.innerText = `${months[currMonth]} ${day.id}, ${currYear}`
                    // console.log(day.id + ' ' + months[currMonth] + ' ' + currYear);
                    let dateString = `${currYear}-${currMonth+1}-${day.id}`;
                    // console.log(new Date(dateString));
                    // console.log(new Date("2023-04-28").getTime());
                    // console.log(new Date(dateString).getTime());
                    this.setState({ selectedDate:  dateString});
                    day.classList.toggle("selected-day");
                    // console.log(new Date("2023-04-28").getFullYear() === new Date(dateString).getFullYear() && new Date("2023-04-28").getDate() === new Date(dateString).getDate() && new Date("2023-04-28").getMonth() === new Date(dateString).getMonth())
                    
                })
            })

            
        }
        renderCalendar();

        prevNextIcon.forEach(icon => {
            icon.addEventListener("click", () => {
                currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;
                
                // console.log(currMonth)

                if(currMonth < 0 || currMonth > 11) {
                    // console.log("hello")
                    date = new Date(currYear, currMonth);
                    currYear = date.getFullYear();
                    currMonth = date.getMonth();
                    // console.log(currMonth)
                } else {
                    date = new Date();
                }
                
                renderCalendar();
            })
        })
    }

    handleClientChange = (event) => {
        this.setState({clientValue: event.target.value});
    }

    getUpcomingMeetings() {
        // ------------------- Upcoming Meetings -----------------------------------
        axios.get(`https://traininggurubackend.onrender.com/Trainer/1/UpcomingMeetings`)
        .then(res =>
        {
            if(res.data)
            {
                console.log("Meeting Data read!")
                this.setState({meetings: res.data})
                // console.log(res.data)
            }
            else {
                console.log("Data not Found!")
            }
        })
    }
    

    handleSubmit = () => {
        // this.setState({clientValue: document.getElementById("clients").value});
        this.setState({dateValue: document.getElementById("schedule-date").value});
        this.setState({timeValue: document.getElementById("schedule-time").value});

        this.setState({ isPopupClicked: !this.state.isPopupClicked });
        this.getUpcomingMeetings();

        console.log(document.getElementById("clients").value);
        console.log(document.getElementById("schedule-date").value);
        console.log(document.getElementById("schedule-time").value);

        // ------------------- Schedule Meeting -----------------------------------
        axios.post(`https://traininggurubackend.onrender.com/CatchUp/${this.state.clientValue}`, {
                "Date": document.getElementById("schedule-date").value,
                "Time": document.getElementById("schedule-time").value
            })
            .then(res =>
            {
                if(res.data)
                {
                    console.log("Meeting Scheduled!")
                    // this.setState({meetings: res.data})
                    // console.log(res.data)
                    this.getUpcomingMeetings();
                }
                else {
                    console.log("Data not Found!")
                }
            })

        // reload upcoming meetings
    }

    handleMeetingDelete = () => {

    }

    handleAddClientSubmit = () => {
        // this.setState({clientValue: document.getElementById("clients").value});
        // this.setState({nameValue: document.getElementById("new-client-name").value});
        // this.setState({emailValue: document.getElementById("new-client-email").value});

        this.setState({ isAddClientPopupClicked: !this.state.isAddClientPopupClicked });
        


        // ------------------- add new client -----------------------------------
        axios.post(`https://traininggurubackend.onrender.com/Client/Register`, {
                "TrainerID": 1,
                "Name": document.getElementById("new-client-name").value,
                "Email": document.getElementById("new-client-email").value,
                "Password": ""
            })
            .then(res =>
            {
                if(res.data)
                {
                    console.log("New Client Added!")
                    // this.setState({meetings: res.data})
                    // console.log(res.data)
                    // this.getUpcomingMeetings();
                }
                else {
                    console.log("Data not Found!")
                }
            })

        // reload upcoming meetings
    }
    

    // const [clientIntakes, setIntakeData] = useState(null);

    // useEffect(() => {
    //     fetch(`https://traininggurubackend.onrender.com/Client/Trainer/1/NutritionValues`)
    //         .then((response) => response.json())
    //         // .then((actualData) => console.log(actualData[0]))
    //         .then((actualData) => setIntakeData(actualData));
    // }, []);

    // const [clientWorkouts, setWorkoutData] = useState(null);

    // useEffect(() => {
    //     fetch(`https://traininggurubackend.onrender.com/Trainer/1/UpComingWorkouts`)
    //         .then((response) => response.json())
    //         // .then((actualData) => console.log(actualData[0]))
    //         .then((actualData) => setWorkoutData(actualData));
    // }, []);

    render()
    {
        return (
        <div className='trainer-home'>
            <Nav />

            <div className='trainer-home-container'>
                <div className='clients sections'>
                    <div className='headers'>Clients</div>
                    <div className='clients-content poppins'>
                        { this.state.clients?.map((client) => {
                            return <div className='clients-content-entry'>
                                { client.CatchUps[0]?.Rating == 2 ? 
                                    <FontAwesomeIcon className='clients-content-recent-feedback thumbs-up' icon={faThumbsUp}/>
                                    :
                                    client.CatchUps[0]?.Rating == 1 ? 
                                        <FontAwesomeIcon className='clients-content-recent-feedback thumbs-middle' icon={faThumbsUp}/>
                                    :
                                    client.CatchUps[0]?.Rating == 0 ? 
                                        <FontAwesomeIcon className='clients-content-recent-feedback thumbs-down' icon={faThumbsDown}/>
                                    :
                                        <div></div>
                                }
                                {/* <div className='clients-content-recent-feedback thumbs-up'>{client.CatchUps[0]}</div> */}
                                {/* { console.log(client.CatchUps[0]) } */}
                                <div className='clients-content-entry-name'>{client.Name}</div>
                                <Link to="/CatchUp" className='clients-catch-up-link' onClick={() => localStorage.currentID = client.ClientID}><FontAwesomeIcon className='chart-icon' icon={faChartSimple}/></Link>
                                <Link to="/Manage" className='clients-manage-link' onClick={() => localStorage.currentID = client.ClientID}><FontAwesomeIcon className='gear-icon' icon={faGear}/></Link>

                            </div>
                        }) }
                        {/* <div className='clients-content-entry'>
                            <div></div>
                            <div className='clients-content-entry-name'>Jane McAvoy</div>
                            <Link to="/CatchUp" className='clients-catch-up-link' onClick={() => localStorage.currentID = 5}><FontAwesomeIcon className='chart-icon' icon={faChartSimple}/></Link>
                            <Link to="/Manage" className='clients-manage-link' onClick={() => localStorage.currentID = 5}><FontAwesomeIcon className='gear-icon' icon={faGear}/></Link>
                        </div> */}
                    </div>
                    <div className='clients-menu'>
                        <div onClick={() => this.setState({ isAddClientPopupClicked: !this.state.isAddClientPopupClicked })}><FontAwesomeIcon className='clients-add-icon' icon={faPlus}/></div>
                        <div onClick={() => this.setState({ isEditClientPopupClicked: !this.state.isEditClientPopupClicked })}><FontAwesomeIcon className='clients-edit-icon' icon={faPenToSquare}/></div>
                    </div>
                </div>
                <div className='calendar-container sections'>
                    <div className='wrapper'>
                        <header>
                            <p className='current-date'>September 2022</p>
                            <div className='icons'>
                                <span id="prev"><FontAwesomeIcon icon={faLessThan}/></span>
                                <span id="next"><FontAwesomeIcon icon={faGreaterThan}/></span>
                            </div>
                        </header>
                        <div className='calendar'>
                            <ul className='weeks'>
                                <li>Sun</li>
                                <li>Mon</li>
                                <li>Tue</li>
                                <li>Wed</li>
                                <li>Thu</li>
                                <li>Fri</li>
                                <li>Sat</li>
                            </ul>
                            <ul className='days'>
                                
                            </ul>
                        </div>
                    </div>
                    <div className='events-info'>
                        <header>
                            <p>Schedule for <span className='event-current-day'></span>:</p>
                        </header>
                        {/* { console.log(new Date("2023-04-28").getFullYear() === new Date(this.state.selectedDate).getFullYear() && new Date("2023-04-28").getDate() === new Date(this.state.selectedDate).getDate() && new Date("2023-04-28").getMonth() === new Date(this.state.selectedDate).getMonth()) } */}
                        { this.state.meetings.filter((meeting) => 
                            new Date(meeting.Date).getFullYear() === new Date(this.state.selectedDate).getFullYear() && new Date(meeting.Date).getDate() === new Date(this.state.selectedDate).getDate() && new Date(meeting.Date).getMonth() === new Date(this.state.selectedDate).getMonth()
                        ).length > 0 ?

                            this.state.meetings.filter((meeting) => 
                                new Date(meeting.Date).getFullYear() === new Date(this.state.selectedDate).getFullYear() && new Date(meeting.Date).getDate() === new Date(this.state.selectedDate).getDate() && new Date(meeting.Date).getMonth() === new Date(this.state.selectedDate).getMonth()
                            ).map((meeting) => {
                                return <div>
                                    <p>Meeting with {meeting.Client.Name}</p>
                                    <p>{String(meeting.Time).substring(0,5)}</p>
                                </div>
                            }) 
                        :
                        <p>No meetings for today.</p>
                        }
                    </div>
                </div>
                
                <div className='upcoming-meetings sections'>
                    <div className='headers'>Upcoming Meetings</div>
                    <div className='schedule-meeting-button' onClick={() => this.setState({ isPopupClicked: !this.state.isPopupClicked })}>Schedule Meeting</div>
                    <div className='upcoming-meetings-content'>
                        { this.state.meetings?.map((meeting) => {
                            return <div className='upcoming-meeting-entry'>
                                <div className='upcoming-meeting-name'>{meeting.Client.Name}</div>
                                <div className='upcoming-meeting-date'>{meeting.Date}</div>
                                <div className='upcoming-meeting-time'>{String(meeting.Time).substring(0,5)}</div>
                                <div className='upcoming-meeting-delete'><FontAwesomeIcon onClick={this.handleMeetingDelete} icon={faTrash}/></div>
                            </div>
                        }) }
                    </div>
                </div>
            </div>
            <div className={this.state.isPopupClicked ? 'schedule-meeting-popup sections' : 'hidden'}>
                <div className='popup-nav'>
                    <div className='headers popup-header'>Schedule Meeting</div>
                    <FontAwesomeIcon onClick={() => this.setState({ isPopupClicked: !this.state.isPopupClicked })} className='schedule-meeting-popup-close-button' icon={faX}/>
                </div>
                <div className='schedule-meeting-form'>
                    <div className='schedule-meeting-form-item'>
                        <div className='schedule-meeting-form-item-label'>Client Name:</div>
                        <select id="clients">
                            { this.state.clients?.map((client) => {
                                    return <option value={`${client.ClientID}`}>{client.Name}</option>
                                })
                            }
                        </select>
                    </div>
                    <div className='schedule-meeting-form-item'>
                        <div className='schedule-meeting-form-item-label'>Date:</div>
                        <input type="date" id="schedule-date" name="schedule-date"/>
                    </div>
                    <div className='schedule-meeting-form-item'>
                        <div className='schedule-meeting-form-item-label'>Time:</div>
                        <input type="time" id="schedule-time" name="schedule-time"/>
                    </div>
                    
                    <button className='schedule-meeting-submit-button' onClick={this.handleSubmit}>Submit</button>
                </div>
            </div>
            <div className={this.state.isAddClientPopupClicked ? 'popup-container' : this.state.isPopupClicked ? 'popup-container' : this.state.isEditClientPopupClicked ? 'popup-container' : 'hidden'}></div>
            <div className={this.state.isAddClientPopupClicked ? 'add-client-popup sections' : 'hidden'}>
                <div className='popup-nav'>
                    <div className='headers popup-header'>Add Client</div>
                    <FontAwesomeIcon onClick={() => this.setState({ isAddClientPopupClicked: !this.state.isAddClientPopupClicked })} className='add-client-popup-close-button' icon={faX}/>
                </div>
                <div className='add-client-form'>
                    <div className='add-client-form-item'>
                        <div className='add-client-form-item-label'>Client Name:</div>
                        <input type='text' id='new-client-name' name='new-client-name'/>
                    </div>
                    <div className='add-client-form-item'>
                        <div className='add-client-form-item-label'>Email:</div>
                        <input type="email" id="new-client-email" name="new-client-email"/>
                    </div>
                    
                    <button className='add-client-submit-button' onClick={this.handleAddClientSubmit}>Submit</button>
                </div>
            </div>
            <div className={this.state.isEditClientPopupClicked ? 'add-client-popup sections' : 'hidden'}>
                <div className='popup-nav'>
                    <div className='headers popup-header'>Edit Client Info</div>
                    <FontAwesomeIcon onClick={() => this.setState({ isEditClientPopupClicked: !this.state.isEditClientPopupClicked })} className='add-client-popup-close-button' icon={faX}/>
                </div>
                <div className='edit-clients-table'>
                    <div className='edit-clients-table-header-row'>
                        <div>Name</div>
                        <div>E-mail</div>
                        <div></div>
                    </div>
                    {/* map through clients info and add to rows */}
                    <div className='edit-clients-table-row'>
                        <div>Kieran McCormack</div>
                        <div>a@a.com</div>
                        <div><FontAwesomeIcon icon={faPenToSquare}/></div>
                    </div>
                </div>
            </div>
            

        </div>
        )
    }
}