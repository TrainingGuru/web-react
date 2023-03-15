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





import '../css/TrainerHome.css';

export default class TrainerHome extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            clients: []
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
                    {/* <div style={styles.trainerHome.container.intake.content}>
                        
                        
                    </div> */}
                </div>
            </div>

        </div>
        )
    }
}