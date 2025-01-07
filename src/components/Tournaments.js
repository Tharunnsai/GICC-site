import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Tournaments.css";

const Tournaments = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeamTournaments = async () => {
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
          throw new Error(`Failed to fetch team tournaments: ${response.statusText}`);
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

        setTournaments(tournamentsData);
      } catch (error) {
        console.error("Error fetching tournaments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamTournaments();
  }, []);

  const handleTournamentClick = (tournament) => {
    // Navigate to the tournament detail page
    navigate(`/tournaments/${tournament.id}`, { state: { tournament } });
  };

  if (loading) {
    return <div>Loading tournaments...</div>;
  }

  return (
    <div className="tournament-page">
      <h1 className="page-title">Team Arena Tournaments</h1>

      <div className="tournament-section">
        {tournaments.length === 0 ? (
          <p className="no-tournaments">No tournaments available.</p>
        ) : (
          <div className="tournament-grid">
            {tournaments.map((tournament) => (
              <div
                key={tournament.id}
                className="tournament-card"
                onClick={() => handleTournamentClick(tournament)}
              >
                <h2 className="tournament-title">{tournament.fullName}</h2>
                <p className="tournament-detail">
                  Created By: {tournament.createdBy}
                </p>
                <p className="tournament-detail">
                  Starts At: {new Date(tournament.startsAt).toLocaleString()}
                </p>
                <p className="tournament-detail">
                  Duration: {tournament.minutes} minutes
                </p>
                <p className="tournament-detail">
                  Players: {tournament.nbPlayers}
                </p>
                <button
                  className={`register-button ${
                    new Date(tournament.startsAt) < new Date() ? "disabled" : ""
                  }`}
                  disabled={new Date(tournament.startsAt) < new Date()}
                >
                  {new Date(tournament.startsAt) < new Date()
                    ? "Registrations Closed"
                    : "Register"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tournaments;
