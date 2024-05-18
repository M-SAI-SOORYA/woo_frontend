import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function History() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/get/items');
                setItems(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <table className="table table-striped table-bordered table-hover table-condesed">
                <thead className="thead-dark">
                    <tr>
                        <th scope="col">#</th>
                        {/* <th scope="col">Gym XP</th>
                        <th scope="col">Todo XP</th>
                        <th scope="col">Diet XP</th>
                        <th scope="col">Social XP</th> */}
                        <th scope="col">Date</th>
                        <th scope="col">Title</th>
                        <th scope="col">Current Level</th>
                        <th scope="col">Total XP</th>
                        <th scope="col">Rewards</th>
                        <th scope="col">Penalties</th>
                        <th scope="col">Job</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index) => (
                        <tr key={item._id}>
                            <th scope="row">{index + 1}</th>
                            {/* <td>{item.gymXp}</td>
                            <td>{item.todoXp}</td>
                            <td>{item.dietXp}</td>
                            <td>{item.socialXp}</td> */}
                            <td>{item.dater}</td>
                            <td>{item.title}</td>
                            <td>{item.currentlevel}</td>
                            <td>{item.totalXp}</td>
                            <td>{item.rewards}</td>
                            <td>{item.penalties}</td>
                            <td>{item.job}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
