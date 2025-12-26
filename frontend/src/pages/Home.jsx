import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
    const { user, loading } = useAuth();

    // Login URL (still pointing to backend auth)
    const loginUrl = "/auth/google";

    return (
        <div className="home-container">
            <div id="login-container" className="login-wrapper">
                {user ? (
                    <div className="user-welcome">
                        <span>Welcome, {user.displayName}</span>
                        <a href="/auth/logout" className="logout-btn">Logout</a>
                    </div>
                ) : (
                    <a href={loginUrl} className="login-btn">
                        <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Sign in with Google
                    </a>
                )}
            </div>

            <h1>Verma Games</h1>

            <div className="cards-container">
                <Link to="/reader" className="card">
                    <span className="icon">📖</span>
                    <h2>Phonics Reader</h2>
                    <p>Practice your reading skills!</p>
                </Link>

                <Link to="/washing-machine" className="card">
                    <span className="icon">🧺</span>
                    <h2>Washing Machine</h2>
                    <p>Assemble the parts correctly!</p>
                </Link>

                <Link to="/us-map" className="card">
                    <span className="icon">🗺️</span>
                    <h2>US Map Game</h2>
                    <p>Learn the states geography!</p>
                </Link>

                <Link to="/world-map" className="card">
                    <span className="icon">🌎</span>
                    <h2>World Map Game</h2>
                    <p>Explore the continents!</p>
                </Link>

                <Link to="/food-classification" className="card">
                    <span className="icon">🍎</span>
                    <h2>Food Classifier</h2>
                    <p>Sort the food items!</p>
                </Link>

                <Link to="/puzzle" className="card">
                    <span className="icon">🧩</span>
                    <h2>Puzzle Game</h2>
                    <p>Solve the picture puzzles!</p>
                </Link>
            </div>
        </div>
    );
};

export default Home;
