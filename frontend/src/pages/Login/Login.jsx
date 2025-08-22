import React, { useState } from 'react';
import "./Login.css";

import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from "firebase/firestore";

import googleLogo from '../../assets/GoogleLogo.png';

const db = getFirestore();

const Login = () => {
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const [signInWithEmailAndPassword, user, loading, emailError] = useSignInWithEmailAndPassword(auth);
    const [signInWithGoogle, gUser, gLoading, googleError] = useSignInWithGoogle(auth);

    const handleSubmit = (e) => {
        e.preventDefault();
    
        // Getting the form values
        setError('');
        const email = e.target.email.value;
        const password = e.target.password.value;
    
        signInWithEmailAndPassword(email, password);
    };

    useEffect(() => {
        if (emailError || googleError) {
            setError('Invalid email or password. Please try again.');
        }
    }, [emailError, googleError]);

    useEffect(() => {
        const performWhitelistCheck = async (loggedInUser) => {
            if (!loggedInUser) return;

            const userEmail = loggedInUser.user.email;
            const whitelistRef = doc(db, "allowedUsers", userEmail);

            try {
                const whitelistDoc = await getDoc(whitelistRef);

                if (!whitelistDoc.exists()) {
                    setError("Your account does not have permission to access this application.");
                    await signOut(auth);
                } else {
                    navigate('/panel');
                }
            } catch (error) {
                setError("An error occurred while checking permissions.");
                await signOut(auth);
            }
        };

        if (user || gUser) {
            performWhitelistCheck(user || gUser);
        }

    }, [user, gUser, navigate]);

    return (
        <div className="login-page">
            {error && <div className="error-bar">{error}</div>}
            <div className="login-card">
                <h1 className="login-title">ZeroShift Panel Login</h1>
                <form className="form" onSubmit={handleSubmit}>
                    <div className="form-input">
                        <input 
                            className="form-field"
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            required
                        />
                        <input 
                            className="form-field"
                            type="password"
                            name="password"
                            placeholder="Password"
                            required
                        />
                    </div>
                    <div className="form-right-side">
                        <div className="submit-box">
                            <input className="submit-button" type="submit" value="Login" />
                        </div>
                        <div className="alternate-login-box">
                            <p className="or-text">OR</p>
                            <div className="google-login-button" onClick={() => signInWithGoogle()}>
                                <div className="google-img-box">
                                    <img className="google-img" src={googleLogo}/>
                                </div>
                                <p className="google-text">Login with Google</p>
                            </div>
                        </div>                        
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login;