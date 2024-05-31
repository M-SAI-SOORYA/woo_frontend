import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Status.css';

export default function Status() {
  const [items, setItems] = useState({});

  // const getCurrentLevelSpecific = (xp) => {
  //   const xpPerLevel = 25;
  //   const level = Math.floor(xp / xpPerLevel);
  //   return level;
  // };

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

  return (
    <div className="cont">
      <div className="card">
        <h1 className="status-title">Status</h1>
        <div className="details-grid">
          
          <p><strong>Name:</strong> Soorya Marri</p>
          <p><strong>Game Level:</strong> {items.currentlevel}</p>
          <p><strong>Title:</strong> {items.title}</p>
          <p><strong>Total XP:</strong> {items.totalXp}</p>
          <p><strong>Job:</strong> {items.job}!</p>
        </div>
      </div>
      <div className="card additional-stats">
        <p><strong>Strength Level:</strong> {items.gymXp}Xp</p>
        <p><strong>Intelligence Level:</strong> {items.todoXp}Xp</p>
        <p><strong>Social Level:</strong> {items.socialXp}Xp</p>
        <p><strong>Health Level:</strong> {items.dietXp}Xp</p>
      </div>
    </div>
  );
}
