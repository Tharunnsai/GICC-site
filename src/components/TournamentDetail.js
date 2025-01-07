import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/TournamentDetail.css";

const TournamentDetail = () => {
  const { id } = useParams(); // Tournament ID from URL
  const [tournament, setTournament] = useState(null);
  const [standings, setStandings] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [loadingStandings, setLoadingStandings] = useState(true);
  const [errorDetails, setErrorDetails] = useState("");
  const [errorStandings, setErrorStandings] = useState("");
  const [page, setPage] = useState(1); // Current page of standings
  const pageSize = 10; // Number of standings per page

  useEffect(() => {
    // Fetch tournament details
    const fetchTournamentDetails = async () => {
      try {
        const response = await fetch(`https://lichess.org/api/tournament/${id}`, {
          headers: { Accept: "application/json" },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch tournament details: ${response.statusText}`);
        }

        const data = await response.json();
        setTournament(data);
      } catch (error) {
        setErrorDetails(error.message);
      } finally {
        setLoadingDetails(false);
      }
    };

    // Fetch standings
    const fetchTournamentStandings = async () => {
      try {
        const response = await fetch(
          `https://lichess.org/api/tournament/${id}/results?page=${page}&max=${pageSize}`,
          {
            headers: { Accept: "application/x-ndjson" },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch standings: ${response.statusText}`);
        }

        // Parse NDJSON response
        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let players = [];
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          chunk.split("\n").forEach((line) => {
            if (line.trim()) {
              players.push(JSON.parse(line));
            }
          });
        }

        setStandings(players);
      } catch (error) {
        setErrorStandings(error.message);
      } finally {
        setLoadingStandings(false);
      }
    };

    fetchTournamentDetails();
    fetchTournamentStandings();
  }, [id, page]);

  const formatTime = (time) => new Date(time).toLocaleString();

  return (
    <div className="tournament-detail-page">
      <div className="tournament-card-container">
        {/* Left Card: Tournament Details */}
        <div className="tournament-card">
          {loadingDetails ? (
            <p>Loading tournament details...</p>
          ) : errorDetails ? (
            <p>Error: {errorDetails}</p>
          ) : (
            tournament && (
              <>
                <h2>{tournament.fullName}</h2>
                <p><strong>Starts At:</strong> {formatTime(tournament.startsAt)}</p>
                <p><strong>System:</strong> {tournament.system}</p>
                <p><strong>Duration:</strong> {tournament.minutes} minutes</p>
                <p><strong>Performance:</strong> {tournament.perf.name}</p>
                <p><strong>Time Control:</strong> {`${tournament.clock.limit/60} + ${tournament.clock.increment}`}</p>
                <p><strong>Variant:</strong> {tournament.variant}</p>
                <p><strong>Rated:</strong> {tournament.rated ? "Yes" : "No"}</p>
                <p><strong>Headline:</strong> {tournament.spotlight?.headline || "N/A"}</p>
                <p><strong>Description:</strong> {tournament.description}</p>

                {tournament.isFinished ? (
                  <button className="closed-button" disabled>
                    Registrations Closed
                  </button>
                ) : (
                  <button
                    className="register-button"
                    aria-label="Register for the tournament"
                    onClick={() =>
                      window.open("https://pages.razorpay.com/pl_PcKCV5KxXSdcu2/view", "_blank")
                    }
                  >
                    Register Now
                  </button>
                )}
              </>
            )
          )}
        </div>

        {/* Right Card: Standings */}
        <div className="standings-card">
          <h2>Standings</h2>
          {loadingStandings ? (
            <p>Loading standings...</p>
          ) : errorStandings ? (
            <p>Error: {errorStandings}</p>
          ) : standings.length === 0 ? (
            <p>No standings available.</p>
          ) : (
            <div>
              <table>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Username</th>
                    <th>Title</th>
                    <th>Score</th>
                    <th>Performance</th>
                    <th>Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((player) => (
                    <tr key={player.rank} className={player.rank === 1 ? "highlight-row" : ""}>
                      <td>{player.rank}</td>
                      <td>{player.username}</td>
                      <td>{player.title || "N/A"}</td>
                      <td>{player.score}</td>
                      <td>{player.performance}</td>
                      <td>{player.rating}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="pagination">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  aria-label="Previous page"
                >
                  Previous
                </button>
                <span>Page {page}</span>
                <button
                  onClick={() => setPage((prev) => prev + 1)}
                  aria-label="Next page"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TournamentDetail;
