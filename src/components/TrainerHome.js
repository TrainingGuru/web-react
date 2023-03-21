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
            clientValue: "",
            dateValue: "",
            timeValue: ""

        }
    }

    componentDidMount()
    {
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
                }
                else {
                    console.log("Data not Found!")
                }
            })

        
    
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
        this.setState({clientValue: document.getElementById("clients").value});
        this.setState({dateValue: document.getElementById("schedule-date").value});
        this.setState({timeValue: document.getElementById("schedule-time").value});

        this.setState({ isPopupClicked: !this.state.isPopupClicked });
        this.getUpcomingMeetings();

        console.log(document.getElementById("clients").value);
        console.log(document.getElementById("schedule-date").value);
        console.log(document.getElementById("schedule-time").value);

        // ------------------- Schedule Meeting -----------------------------------
        axios.post(`https://traininggurubackend.onrender.com/CatchUp/${this.state.clientValue}`, {
                "Date": this.state.dateValue,
                "Time": this.state.timeValue
            })
            .then(res =>
            {
                if(res.data)
                {
                    console.log("Meeting Scheduled!")
                    // this.setState({meetings: res.data})
                    // console.log(res.data)
                }
                else {
                    console.log("Data not Found!")
                }
            })
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
                    <div className='clients-content'>
                        { this.state.clients?.map((client) => {
                            return <div className='clients-content-entry'>
                                <FontAwesomeIcon className='clients-content-recent-feedback thumbs-up' icon={faThumbsUp}/>
                                {/* <div className='clients-content-recent-feedback thumbs-up'>{client.CatchUps["Rating"]}</div> */}
                                {/* { console.log(client.CatchUps) } */}
                                <div className='clients-content-entry-name'>{client.Name}</div>
                                <Link to="/CatchUp" className='clients-catch-up-link' onClick={() => localStorage.currentID = client.ClientID}><FontAwesomeIcon className='chart-icon' icon={faChartSimple}/></Link>
                                <Link to="/Manage" className='clients-manage-link' onClick={() => localStorage.currentID = client.ClientID}><FontAwesomeIcon className='gear-icon' icon={faGear}/></Link>

                            </div>
                        }) }
                    </div>
                    <div className='clients-menu'>
                        <FontAwesomeIcon className='clients-add-icon' icon={faPlus}/>
                        <FontAwesomeIcon className='clients-edit-icon' icon={faPenToSquare}/>
                    </div>
                </div>
                <div className='activeToday'>
                    <div className='activeToday-text'>
                        <div className='activeToday-text-label'>Active Today:</div>
                        <div className='activeToday-text-data'>85%</div>
                    </div>
                    
                    <div className='activeToday-imgContainer'>
                        <img className='activeToday-pieChart'
                            src={pieChart}
                            alt="Pie Chart"/>
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
                                <div className='upcoming-meeting-time'>{meeting.Time}</div>
                            </div>
                        }) }
                    </div>
                </div>
            </div>
            <div className={this.state.isPopupClicked ? 'schedule-meeting-popup sections' : 'hidden'}>
                <div className='popup-nav'>
                    <div className='headers'>Schedule Meeting</div>
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

        </div>
        )
    }
}