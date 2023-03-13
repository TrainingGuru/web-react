import React, { Component } from 'react';

import Nav from './Nav';

export default class TrainerHome extends Component
{
    // const [clients, setClients] = useState(null);

    // useEffect(() => {
    //     fetch(`https://traininggurubackend.onrender.com/Trainer/1/Clients`)
    //         .then((response) => response.json())
    //         // .then((actualData) => console.log(actualData[0]))
    //         .then((actualData) => setClients(actualData));
    // }, []);

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
            <div style={styles.trainerHome}>
                <Nav />

                <div style={styles.trainerHome.container}>
                    <div style={{...styles.trainerHome.container.clients, ...styles.trainerHome.container.sections}}>
                        <div style={styles.trainerHome.container.headers}>Clients</div>
                        <div style={styles.trainerHome.container.clients.content}>
                            {/* { clients?.map((client) => {
                                return <div style={styles.trainerHome.container.clients.content.entry}>
                                    <div style={styles.trainerHome.container.clients.content.entry.name}>{client.Name}</div>
                                    <Link to="/clientscatchup">{client.Name}</Link>
                                </div>
                            }) } */}
                        </div>
                    </div>
                    <div style={styles.trainerHome.container.activeToday}>
                        <div style={styles.trainerHome.container.activeToday.text}>
                            <div style={styles.trainerHome.container.activeToday.text.label}>Active Today:</div>
                            <div style={styles.trainerHome.container.activeToday.text.data}>85%</div>
                        </div>
                        
                        <div style={styles.trainerHome.container.activeToday.imgContainer}>
                            <img style={styles.trainerHome.container.activeToday.imgContainer.img}
                                src={pieChart}
                                alt="Pie Chart"/>
                        </div>
                    </div>
                    <div style={{...styles.trainerHome.container.activity, ...styles.trainerHome.container.sections}}>
                        <div style={styles.trainerHome.container.headers}>Activity</div>
                        <div style={styles.trainerHome.container.activity.content}>
                            <img style={styles.trainerHome.container.activity.content.img}
                                src={barChart}
                                alt="Bar Chart"/>
                        
                            <div style={styles.trainerHome.container.activity.content.dropdown}>
                                <select id="clients">
                                    {/* { clients?.map((client) => {
                                        return <option value={"${client.ClientID}"}>{client.Name}</option>
                                    }) } */}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div style={{...styles.trainerHome.container.intake, ...styles.trainerHome.container.sections}}>
                        <div style={styles.trainerHome.container.headers}>Intake</div>
                        <div style={styles.trainerHome.container.intake.content}>
                            {/* { clientIntakes?.map((clientIntake) => {
                                return <div style={styles.trainerHome.container.intake.content.entry}>
                                <div style={styles.trainerHome.container.intake.content.entry.name}>{clientIntake.Name}</div>
                                <div style={styles.trainerHome.container.intake.content.entry.data}>
                                    <div style={styles.trainerHome.container.intake.content.entry.data.currentIntake}>{clientIntake.Nutrition?.CaloriesIntake}</div>
                                    <div style={styles.trainerHome.container.intake.content.entry.data.icon}>/</div>
                                    <div style={styles.trainerHome.container.intake.content.entry.data.targetIntake}>{clientIntake.Nutrition?.TotalCalories}</div>
                                </div>
                            </div>
                            }) } */}
                            
                        </div>
                    </div>

                    <div style={{...styles.trainerHome.container.upcomingWorkouts, ...styles.trainerHome.container.sections}}>
                        <div style={styles.trainerHome.container.headers}>Upcoming Workouts</div>
                        <div style={styles.trainerHome.container.upcomingWorkouts.content}>
                            {/* { clientWorkouts?.map((clientWorkout) => {
                                return <div style={styles.trainerHome.container.upcomingWorkouts.content.entry}>
                                    <div style={styles.trainerHome.container.upcomingWorkouts.content.entry.name}>{clientWorkout.Client.Name}</div>
                                    <div style={styles.trainerHome.container.upcomingWorkouts.content.entry.date}>{clientWorkout.Date}</div>
                                    <div style={styles.trainerHome.container.upcomingWorkouts.content.entry.workout}>{clientWorkout.TrainerWorkout.WorkoutName}</div>
                                </div>
                            }) } */}
                            
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}