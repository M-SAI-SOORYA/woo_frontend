import React, { useState,useEffect } from 'react';
import axios from 'axios';

import './Systemm.css'; // Custom CSS file for additional styling
import Swal from 'sweetalert2';
export default function Systemm() {
    // Define state variables for input values
    const [items, setItems] = useState({});
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://system-back-2no1.onrender.com/get/item1');
                setItems(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);
    const [gymInput, setGymInput] = useState('');
    const [todoInput, setTodoInput] = useState('');
    const [dietInput, setDietInput] = useState('');
    const [socialConfidenceInput, setSocialConfidenceInput] = useState('');

    // Define state variables for XP values
    const [gymXp, setGymXp] = useState(0);
    const [todoXp, setToDoXp] = useState(0);
    const [dietXp, setDietXp] = useState(0);
    const [socialXp, setSocialXp] = useState(0);

    // Handle input change for each input field
    const handleInputChange = (event, setInput, setXp, xp) => {
        setInput(event.target.value);
        
        if (event.target.value.toLowerCase() === 'yes') {
            setXp(xp + 25);
        } else if (event.target.value.toLowerCase() === 'no') {
            setXp(xp - 5);
        } else {
            setXp(0);
        }
    };

    // Handle form submission.



    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission behavior
        const prevLevel = items.currentlevel; // Store the current level before the data is submitted
        const prevtitle=items.title;
        try {
            // Send POST request to backend route '/xp' with input data
            const response = await axios.post('https://system-back-2no1.onrender.com/xp', {
                gymXp: gymXp,
                todoXp: todoXp,
                dietXp: dietXp,
                socialXp: socialXp,
            });

            const response2 = await axios.post('https://system-back-2no1.onrender.com/datexp', {
                gymXp: gymXp,
                todoXp: todoXp,
                dietXp: dietXp,
                socialXp: socialXp,
            });

            // Handle successful response from server (if needed)
         
            console.log('XP data saved successfully:', response.data);
            console.log('XP data saved successfully:', response2.data);

            // Fetch updated data after submission
            const updatedItems = await axios.get('https://system-back-2no1.onrender.com/get/item1');
            setItems(updatedItems.data);
          
            // Display the success message for data submission
            Swal.fire({
                title: 'Success!',
                text: 'Your data has been submitted successfully.',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                // After the first popup is closed, check if the user has leveled up
                
                if (updatedItems.data.currentlevel > prevLevel) {
                    Swal.fire({
                        title: 'You Leveled Up!',
                        html: `<strong>You reached Level</strong>: <strong>${updatedItems.data.currentlevel}</strong>`,

                        icon: 'success',
                        confirmButtonText: 'Keep Moving Forward!',
                        customClass: {
                            popup: 'swal2-backdrop-custom'
                        }   
                    });
                }
                
                
            }).then(()=>{
                if (updatedItems.data.rewards !== "No Rewards Right Now") {
                  
                    Swal.fire({
                        title: `Rewards! Level: ${updatedItems.data.currentlevel}`,
                        html: `Congratulations! The <strong>REWARD</strong> is: <strong>${updatedItems.data.rewards}</strong>`,
                      
                        confirmButtonText: 'Awesome!',
                        customClass: {
                            popup: 'swal2-reward-custom'
                        },
                    });
                }
            }).then(()=>{
                if(updatedItems.data.penalties !== "No Penalties Till Now")
                Swal.fire({
                    title:  `Penalty!!  Level: ${updatedItems.data.currentlevel}`,
                    html: `You failed in daily quests so <strong>Penalty</strong> is : <strong>${updatedItems.data.penalties}</strong>`,
                  
                    confirmButtonText: 'Wont Repeat This!',
                    customClass: {
                        popup: 'swal2-reward-custom'
                    },
                });
            }).then(()=>{
                if(updatedItems.data.title !== prevtitle){
                    Swal.fire({
                        title: `Promoted!!  Level: ${updatedItems.data.currentlevel}`,
                        html: `You are now => <strong>${updatedItems.data.title}!!</strong>`,
                      
                        confirmButtonText: 'Alright!',
                        customClass: {
                            popup: 'swal2-reward-custom'
                        },
                    });
                }
            })

        } catch (error) {
            // Handle error
            console.error('Error saving XP data:', error);
        }
    };
    
    return (
        <div className='container my-5'>
            <h1 style={{ textAlign: "center" }}>Welcome Player!</h1>
            <h1 className="text-center mb-5">Always Give Your 100%</h1>

            <form onSubmit={handleSubmit}>
                <div className="input-group input-group-sm mb-3" style={{ width: "100%" }}>
                    <button type="button" className="btn btn-outline-primary">GYM</button>
                    <input
                        type="text"
                        className="form-control"
                        aria-label="Sizing example input"
                        aria-describedby="inputGroup-sizing-sm"
                        value={gymInput}
                        onChange={(event) => handleInputChange(event, setGymInput, setGymXp, gymXp)}
                    />
                </div>

                <div className="input-group input-group-sm mb-3" style={{ width: "100%" }}>
                    <button type="button" className="btn btn-outline-success">TO-DO</button>
                    <input
                        type="text"
                        className="form-control"
                        aria-label="Sizing example input"
                        aria-describedby="inputGroup-sizing-sm"
                        value={todoInput}
                        onChange={(event) => handleInputChange(event, setTodoInput, setToDoXp, todoXp)}
                    />
                </div>

                <div className="input-group input-group-sm mb-3" style={{ width: "100%" }}>
                    <button type="button" className="btn btn-outline-warning">DIET</button>
                    <input
                        type="text"
                        className="form-control"
                        aria-label="Sizing example input"
                        aria-describedby="inputGroup-sizing-sm"
                        value={dietInput}
                        onChange={(event) => handleInputChange(event, setDietInput, setDietXp, dietXp)}
                    />
                </div>

                <div className="input-group input-group-sm mb-3" style={{ width: "100%" }}>
                    <button type="button" className="btn btn-outline-info">SOCIAL-CONFIDENCE</button>
                    <input
                        type="text"
                        className="form-control"
                        aria-label="Sizing example input"
                        aria-describedby="inputGroup-sizing-sm"
                        value={socialConfidenceInput}
                        onChange={(event) => handleInputChange(event, setSocialConfidenceInput, setSocialXp, socialXp)}
                    />
                </div>

                <button type="submit" className="btn btn-primary btn-block mt-4">Submit</button>
            </form>
        </div>
    );
}
