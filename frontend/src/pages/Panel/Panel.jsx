import React, { useState, useEffect } from 'react';
import './Panel.css';

const API_BASE_URL = 'http://oracleIP:3001';

const Panel = () => {
    const [status, setStatus] = useState('Checking...');
    const [isLoading, setIsLoading] = useState(false);

    const fetchStatus = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/status`);
            const data = await response.json();
            setStatus(data.status);
        } catch (error) {
            console.error('Failed to fetch status:', error);
            setStatus('Error');
        }
    };

    useEffect(() => {
        fetchStatus();
        const intervalId = setInterval(fetchStatus, 5000);

        return () => clearInterval(intervalId);
    }, []);

    const handleStart = async () => {
        setIsLoading(true);
        try {
            await fetch(`${API_BASE_URL}/start`, { method: 'POST' });
            setStatus('Online'); 
        } catch (error) {
            console.error('Failed to send start command:', error);
        }
        setIsLoading(false);
    };

    const handleStop = async () => {
        setIsLoading(true);
        try {
            await fetch(`${API_BASE_URL}/stop`, { method: 'POST' });
            setStatus('Offline');
        } catch (error) {
            console.error('Failed to send stop command:', error);
        }
        setIsLoading(false);
    };

    return (
        <div className="panel-page">
            <div className="panel">
                <h1>Control Panel</h1>
                <div className="status-box">
                    <p>Current Status: </p>
                    <h2 className={status.toLowerCase()}>{status}</h2>
                </div>
                <div className="buttons">
                    <button className="start-btn" onClick={handleStart} disabled={isLoading || status === 'Online'}>
                        <p>Start</p>
                    </button>
                    <button className="stop-btn" onClick={handleStop} disabled={isLoading || status === 'Offline'}>
                        <p>Stop</p>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Panel