import React, { useState } from "react";
import SpeechToText from "../Components/SpeechToText";
import Avatar from "../Components/Avatar";
import Translate from "../Components/Translate";

const Home = () => {
    return (
        <div className="container">
            <h1>Multi-Lingual Medical Screening Bot</h1>
            <Avatar />
            <SpeechToText />
            <Translate />
        </div>
    );
};

export default Home;
