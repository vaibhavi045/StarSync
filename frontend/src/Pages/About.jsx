import React from "react";
import "../styles/About.css"; // Ensure the correct CSS path

const About = () => {
    return (
        <div className="about-container">
            <h1>About StarSync</h1>
            <p>
                StarSync is an advanced multi-lingual medical screening bot with WebRTC-based avatars
                and regional accent-aware speech recognition. Our goal is to make healthcare
                more accessible to people across different languages and regions.
            </p>
            <p>
                The project is built with cutting-edge web technologies like React, WebRTC, and
                AI-powered speech recognition. Join us in our mission to bridge the gap in healthcare accessibility!
            </p>
        </div>
    );
};

export default About;