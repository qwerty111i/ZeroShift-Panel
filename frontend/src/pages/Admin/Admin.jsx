import React, { useState, useEffect } from 'react';
import { collection, getDocs, setDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase.js';
import { useNavigate } from 'react-router-dom';

import './Admin.css';

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState('');
    const navigate = useNavigate();

    const fetchUsers = async () => {
        const userCollections = collection(db, 'allowedUsers');
        const userSnapshot = await getDocs(userCollections);
        const userList = userSnapshot.docs.map(doc => ({ email: doc.id }));
        setUsers(userList);
    }

    // Runs fetchUsers when page first loads
    useEffect(() => {
        fetchUsers();
    }, []);

    const addUser = async (e) => {
        e.preventDefault();
        if (!newUser) return;

        const userRef = doc(db, 'allowedUsers', newUser);
        await setDoc(userRef, {});

        setNewUser('');
        fetchUsers();
    };

    const removeUser = async (email) => {
        if (window.confirm(`Are you sure you want to remove ${email}?`)) {
            await deleteDoc(doc(db, 'allowedUsers', email));
            fetchUsers();
        };
    };

    return (
        <div className="admin-page">
            <button className="back-btn" onClick={() => navigate('/panel')}>
                Back
            </button>
            <div className="admin-panel">
                <h1>Admin Panel</h1>
                <div className="content">
                    <div className="add-user">
                        <form onSubmit={addUser}>
                            <h3 className="title">Add New Admin</h3>
                            <div className="input-container">
                                <input
                                    className="input-form"
                                    type="email"
                                    value={newUser}
                                    onChange={(e) => setNewUser(e.target.value)}
                                    placeholder="Enter email address"
                                    required
                                />
                                <button className="submit-btn"type="submit">Add User</button>
                            </div>
                        </form>
                    </div>
                    <div className="current-users">
                        <h3>Current Admins</h3>
                        <ul>
                            {users.map(user => (
                                <li className="user-list" key={user.email}>
                                    <p>{user.email}</p>
                                    <span className={`material-icons icon`} onClick={() => removeUser(user.email)}>
                                        close
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Admin