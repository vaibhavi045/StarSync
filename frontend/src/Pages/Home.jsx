import React from "react";
import { useNavigate } from "react-router-dom";
import LanguageSelector from "../Components/multilingual/LanguageSelector.jsx";
import Button from "../Components/common/Button.jsx";

const Home = () => {
    const navigate = useNavigate();

    const tryMe = () => {
        navigate("/try-me"); // Change this to the actual route for "Try Me"
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-blue-100 p-6">
            <div className="max-w-3xl text-center bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-blue-600 mb-4">Welcome to MedAssist</h1>
                <p className="text-gray-700 text-lg mb-6">
                    Your multilingual AI-powered medical screening assistant. Select your preferred language and begin.
                </p>

                {/* Language Selection Component */}
                <div className="mb-6">
                    <LanguageSelector />
                </div>

                {/* Try ChatBot Button */}
                <div className="flex justify-center">
                    <Button 
                        text="Try ChatBot" 
                        onClick={tryMe} 
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-xl font-semibold"
                    />
                </div>
            </div>
        </div>
    );
};

export default Home;
