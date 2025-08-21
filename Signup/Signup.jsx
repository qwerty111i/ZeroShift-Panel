import React from 'react';
import "./Signup.css";

import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import googleLogo from '../assets/GoogleLogo.png';

const Signup = () => {
    const navigate = useNavigate();
    const [createUserWithEmailAndPassword, user] = useCreateUserWithEmailAndPassword(auth);
    const [signInWithGoogle, gUser] = useSignInWithGoogle(auth);
    const [error, setError] = useState('');

    const validEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return emailRegex.test(email);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        // Getting the form values
        const email = e.target.email.value;
        const password = e.target.password.value;
        const confirmPassword = e.target.confirmPassword.value;

        if (!validEmail(email)) {
            setError("Email is invalid!")
            return;
        } else if (password.length < 6) {
            setError("Password is too weak!")
            return;
        } else if (password !== confirmPassword) {
            setError("Passwords don't match!")
            return;
        } else {
            setError('');
        }

        createUserWithEmailAndPassword(email, password);
    };

    useEffect(() => {
        if (user || gUser) {
            // Currently redirects to home page after signup
            navigate('/');
        }
    }, [user, navigate, gUser]);

    return (
        <div className="signup-page">
            <div className="back-circle">
                <Link to="/" className="back-button">
                    <span className="material-icons back-arrow-icon">arrow_back</span>
                </Link>
            </div>
            <div className="signup-card">
                <h1 className="signup-title">Sign Up</h1>
                <form className="form" onSubmit={handleSubmit}>
                    <div className="form-left-side">
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
                        <input 
                            className="form-field"
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            required
                        />
                        {error && (<div className="error-box">
                            <p className="pass-match-error">{error}</p>
                        </div>)}
                        <p className="login-text">Already have an account?&nbsp;
                            <Link to="/Login" className="login-hyperlink">Log In.</Link>
                        </p>
                    </div>
                    <div className="form-right-side">
                        <div className="form-submit-box">
                            <input className="submit-button" type="submit" value="Sign Up" />
                        </div>
                        <div className="alternate-signup-box">
                            <p className="or-text">OR</p>
                            <div className="google-signup-button" onClick={() => signInWithGoogle()}>
                                <div className="google-img-box">
                                    <img className="google-img" src={googleLogo}/>
                                </div>
                                <p className="google-text">Sign up with Google</p>
                            </div>
                        </div>                        
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Signup;