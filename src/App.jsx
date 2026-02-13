import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
    const [tasks, setTasks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [aiResponse, setAiResponse] = useState('');
    const [selectedTask, setSelectedTask] = useState(null);

    useEffect(() => {
        // Load tasks from local storage or an API
        const loadTasks = () => {
            const storedTasks = localStorage.getItem('tasks');
            setTasks(storedTasks ? JSON.parse(storedTasks) : []);
        };
        loadTasks();
    }, []);

    const handleAddTask = (task) => {
        const newTasks = [...tasks, task];
        setTasks(newTasks);
        localStorage.setItem('tasks', JSON.stringify(newTasks));
    };

    const handleDeleteTask = (taskToDelete) => {
        const newTasks = tasks.filter(task => task !== taskToDelete);
        setTasks(newTasks);
        localStorage.setItem('tasks', JSON.stringify(newTasks));
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleAIIntegration = async (task) => {
        const response = await axios.post('https://api.gemini.com/ai-response', { task });
        setAiResponse(response.data);
        setSelectedTask(task);
    };

    const handleExportCSV = () => {
        const csvContent = 'data:text/csv;charset=utf-8,' +
            tasks.map(task => task).join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'tasks.csv');
        document.body.appendChild(link);
        link.click();
    };

    return (
        <div className="app">
            <h1>Task Management Application</h1>
            <input type="text" value={searchTerm} onChange={handleSearch} placeholder="Search tasks..." />
            <ul>
                {tasks.filter(task => task.includes(searchTerm)).map((task, index) => (
                    <li key={index}>
                        {task} 
                        <button onClick={() => handleDeleteTask(task)}>Delete</button>
                        <button onClick={() => handleAIIntegration(task)}>AI Suggestion</button>
                    </li>
                ))}
            </ul>
            <button onClick={handleExportCSV}>Export to CSV</button>
            {selectedTask && <div className="modal">
                <h2>AI Response for {selectedTask}</h2>
                <p>{aiResponse}</p>
                <button onClick={() => setSelectedTask(null)}>Close</button>
            </div>}
        </div>
    );
};

export default App;