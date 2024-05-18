import React, { useState } from 'react';
import axios from 'axios';

import './Systemm.css'; // Custom CSS file for additional styling
import Swal from 'sweetalert2';
export default function Systemm() {
    // Define state variables for input values
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
    
    
    // const getCurrentLevel = (totxp) => {
    //     const xpPerLevel = 100;
    //     const level = Math.floor(totxp / xpPerLevel);
    //     return level;
    // };
  
    
    const handleSubmit = async (event) => {
        event.preventDefault(); 
        // Prevent default form submission behavior
        
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
        } catch (error) {
            // Handle error
            console.error('Error saving XP data:', error);
        }
    };

    // Calculate current level based on total XP
   
    const pop = () => {
        Swal.fire({
            title: 'Success!',
            text: 'Your data has been submitted successfully.',
            icon: 'success',
            confirmButtonText: 'OK'
        });
    };
    return (
        <div className='container my-5'>
            <h1 style={{textAlign:"center"}}>Welcome Player!</h1>
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

                <button type="submit" className="btn btn-primary btn-block mt-4" onClick={pop}>Submit</button>
            </form>
        </div>
    );
}
