import React, { useState } from 'react';
import '../styles/About.css';

const About = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        setError('');
        setMessage(''); // Clear previous messages

        try {
            // Google Form POST URL
            const formUrl =
                'https://docs.google.com/forms/d/e/1FAIpQLSdlwUipVccXNMx0fxtmejL-eLV-mFaX-sMWkEpmvir5Lpozvg/formResponse';

            // Map email input to the corresponding Google Form field
            const formData = new FormData();
            formData.append('entry.1111313521', email); // Replace with your form's email field entry ID

            // Send the data
            const response = await fetch(formUrl, {
                method: 'POST',
                body: formData,
                mode: 'no-cors', // Required for Google Forms
            });

            // Update message for successful submission
            // Check if the response status indicates success
            if (response.ok) {
                setMessage('Thank you for subscribing!');
            } else {
                setMessage('Something went wrong. Please try again.');
            }
        } catch (error) {
            // Update message for error during submission
            setMessage('An error occurred. Please try again later.');
        }
    };

    return (
        <div className="about-page">
            {/* About Section */}
            <section className="about-section">
                <h1 className="about-title">About Us</h1>
                <p className="about-description">
                    The Great Indian Chess Club is dedicated to promoting the love of chess among all age groups. 
                    We organize tournaments, provide resources, and create a platform for chess enthusiasts to grow 
                    and connect.
                </p>
            </section>

            {/* Subscribe Section */}
            <section className="subscribe-section">
                <div className="subscribe-card">
                    <h2>Subscribe to our Newsletter</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                        <button type="submit">Subscribe</button>
                    </form>
                    {error && <p className="error-message">{error}</p>}
                    {message && <p className="subscribe-message">{message}</p>}
                </div>
            </section>

            {/* Contact Section */}
            <section className="contact-section">
                <h2>Contact Us</h2>
                <p>Email: <a href="mailto:greatindianchessclub@gmail.com">greatindianchessclub@gmail.com</a></p>
                <p>Phone: +91-9347093159</p>
            </section>
        </div>
    );
};

export default About;
