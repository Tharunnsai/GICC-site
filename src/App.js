// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import About from './components/About';
import Tournaments from './components/Tournaments';
import Results from './components/Results';
import TournamentDetail from './components/TournamentDetail';

const App = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<About />} />
                <Route path="/tournaments" element={<Tournaments />} />
                <Route path="/results" element={<Results />} />
                <Route path="/tournaments/:id" element={<TournamentDetail/>}/>
                <Route path="*" element={<h1>404 - Page Not Found</h1>} />
            </Routes>
        </Router>
    );
};

export default App;
