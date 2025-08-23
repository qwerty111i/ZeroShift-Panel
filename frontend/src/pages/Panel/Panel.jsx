import React, { useState, useEffect, useRef } from 'react';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import io from 'socket.io-client';
import './Panel.css';

const API_BASE_URL = 'https://zeroshift.duckdns.org';

const Panel = () => {
    const [status, setStatus] = useState('Checking...');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        const socket = io(API_BASE_URL);

        socket.on('connect', () => {
            console.log('Connected to log server');
        });

        socket.on('log', (newLine) => {
            const timestamp = new Date().toLocaleString();
            setLogs(prevLogs => [...prevLogs, `[${timestamp}] \n${newLine}`]);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

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
        if (!isLoading) {
            fetchStatus();
            const intervalId = setInterval(fetchStatus, 5000);

            return () => clearInterval(intervalId);
        }
    }, [isLoading]);

    const handleStart = async () => {
        setIsLoading(true);
        setStatus('Starting...');
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
        setStatus('Stopping...');
        try {
            await fetch(`${API_BASE_URL}/stop`, { method: 'POST' });
            setStatus('Offline');
        } catch (error) {
            console.error('Failed to send stop command:', error);
        }
        setIsLoading(false);
    };

    const getStatusIcon = () => {
        if (status === 'Online') {
            return 'circle'
        } else if (status === 'Offline') {
            return 'circle'
        } else if (status === 'Error') {
            return 'cloud_off'
        } else {
            return 'cached'
        }
    }

    const getStatusClass = () => {
        if (status === 'Online') {
            return 'online';
        } else if (status === 'Offline') {
            return 'offline';
        } else if (status === 'Error') {
            return 'error';
        } else {
            return 'checking rotate-icon';
        }
    }

    return (
        <div className="panel-page">
            <div className="header-btns">
                <button className="admin-btn" onClick={() => navigate('/admin')}>
                    Admin
                </button>
                <button className="sign-out-btn" onClick={() => signOut(auth)}>
                    Sign Out
                </button>
            </div>
            <div className="content">
                <div className="panel">
                    <div className="panel-row-1">
                        <div className="status-box">
                            <p>Current Status: </p>
                            <div className="status">
                                <span className={`material-icons icon ${getStatusClass()}`}>{getStatusIcon()}</span>
                                <h2>&nbsp;{status}</h2>
                            </div>
                        </div>
                        <div className="buttons">
                            <div className="button-row">
                                <button className="start-btn" onClick={handleStart} disabled={isLoading || status === 'Online'}>
                                    <p>Start</p>
                                </button>
                                <button className="stop-btn" onClick={handleStop} disabled={isLoading || status === 'Offline'}>
                                    <p>Stop</p>
                                </button>
                            </div>
                            <div className="button-row">
                                <button className="restart-btn">
                                    <p>Restart</p>
                                </button>
                                <button className="update-btn">
                                    <p>Update</p>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="panel-row-2">
                        <div className="cpu-box">
                            
                        </div>
                        <div className="memory-box">
                            
                        </div>
                    </div>
                </div>
                <div className="console">
                    {logs.map((log, index) => (
                        <div key={index} className="log-line">{log}</div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Panel