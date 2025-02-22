import React, { useState, useEffect, useContext } from "react";
import { LanguageContext } from "../../context/LanguageContext";

const SpeechToText = ({ onTextDetected }) => {
    const { language } = useContext(LanguageContext);
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");

    // Language mappings for speech recognition
    const languageMap = {
        en: "en-US", // English
        hi: "hi-IN", // Hindi
        mr: "mr-IN", // Marathi
    };

    useEffect(() => {
        if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
            alert("Speech recognition is not supported in your browser.");
        }
    }, []);

    const startListening = () => {
        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.lang = languageMap[language] || "en-US";
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onresult = (event) => {
            const text = event.results[0][0].transcript;
            setTranscript(text);
            onTextDetected(text); // Send detected text to parent component
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.start();
    };

    return (
        <div className="speech-to-text">
            <button
                onClick={startListening}
                disabled={isListening}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
                {isListening ? "Listening..." : "Start Speech Recognition"}
            </button>
            <p className="mt-2 text-gray-800">Detected Text: {transcript}</p>
        </div>
    );
};

export default SpeechToText;
