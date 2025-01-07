import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogoClick = (event) => {
        if (location.pathname === "/") {
            // Smooth scroll to the top of the page
            event.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
            // Navigate to Home and scroll to the top
            event.preventDefault();
            navigate("/");
            setTimeout(() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
            }, 300); // Delay to ensure navigation completes
        }
    };

    const handleAboutClick = (event) => {
        if (location.pathname === "/") {
            // Smooth scroll to the About section
            event.preventDefault();
            const aboutSection = document.getElementById("about");
            if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: "smooth" });
            }
        } else {
            // Navigate to Home and then scroll to About
            event.preventDefault();
            navigate("/");
            setTimeout(() => {
                const aboutSection = document.getElementById("about");
                if (aboutSection) {
                    aboutSection.scrollIntoView({ behavior: "smooth" });
                }
            }, 300); // Delay to ensure navigation completes
        }
    };

    const handleNavigation = (event, path) => {
        if (location.pathname !== path) {
            event.preventDefault();
            navigate(path);
        }
    };

    return (
        <header className="navbar">
            <Link to="/" className="logo" onClick={handleLogoClick}>
                <img src="media/Logo.png" alt="Great Indian Chess Club" />
                Great Indian Chess Club
            </Link>
            <ul className="nav-links">
                <li>
                    <Link
                        to="/#about"
                        className={`nav-link ${location.pathname === "/" ? "about-active" : ""}`}
                        onClick={handleAboutClick}
                    >
                        About
                    </Link>
                </li>
                <li>
                    <Link
                        to="/tournaments"
                        className={`nav-link ${location.pathname === "/tournaments" ? "tournaments-active" : ""}`}
                        onClick={(event) => handleNavigation(event, "/tournaments")}
                    >
                        Tournaments
                    </Link>
                </li>
            </ul>
        </header>
    );
};

export default Navbar;
