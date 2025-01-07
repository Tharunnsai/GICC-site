import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/HomePage.css";
import About from "./About"; // Import the About component

const HomePage = () => {
    const [latestTournament, setLatestTournament] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTournaments = async () => {
            try {
                const teamId = "great-indian-chess-club"; // Replace with your team ID
                const token = "lip_d8qDyeO2dimqyFhyDFOu"; // Bearer token

                const response = await fetch(
                    `https://lichess.org/api/team/${teamId}/arena`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            Accept: "application/x-ndjson",
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(`Failed to fetch tournaments: ${response.statusText}`);
                }

                // Parse NDJSON response
                const reader = response.body.getReader();
                const decoder = new TextDecoder("utf-8");
                let tournamentsData = [];
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    const chunk = decoder.decode(value, { stream: true });
                    chunk.split("\n").forEach((line) => {
                        if (line.trim()) {
                            tournamentsData.push(JSON.parse(line));
                        }
                    });
                }

                // Sort tournaments by start date (latest first)
                tournamentsData.sort((a, b) => new Date(b.startsAt) - new Date(a.startsAt));
                setLatestTournament(tournamentsData[0]); // Get the latest tournament
            } catch (error) {
                console.error("Error fetching tournaments:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTournaments();
    }, []);

    const handleRegisterClick = (tournament) => {
        navigate(`/tournaments/${tournament.id}`, { state: { tournament } });
    };

    return (
        <div className="home-container">
            <header className="home-header">
                <img src="media/banner.jpeg" alt="Great Indian Chess Club Banner" className="banner-image" />
                <h1>Start your first tournament here</h1>
                <p></p>
            </header>
            <section className="content">
                {loading ? (
                    <p>Loading latest tournament...</p>
                ) : latestTournament ? (
                    <div className="latest-tournament-card">
                        <h2 className="tournament-title">{latestTournament.fullName}</h2>
                        <p className="tournament-detail">
                            Starts At: {new Date(latestTournament.startsAt).toLocaleString()}
                        </p>
                        <p className="tournament-detail">
                            Duration: {latestTournament.minutes} minutes
                        </p>
                        <p className="tournament-detail">
                            Players: {latestTournament.nbPlayers}
                        </p>
                        <button
                            className={`register-button ${
                                new Date(latestTournament.startsAt) < new Date() ? "disabled" : ""
                            }`}
                            disabled={new Date(latestTournament.startsAt) < new Date()}
                            onClick={() => handleRegisterClick(latestTournament)}
                        >
                            {new Date(latestTournament.startsAt) < new Date()
                                ? "Registrations Closed"
                                : "Register Now"}
                        </button>
                    </div>
                ) : (
                    <p>No tournaments available.</p>
                )}
            </section>

            {/* Include the About section */}
            <section id="about">
                <About />
            </section>
        </div>
    );
};

export default HomePage;
