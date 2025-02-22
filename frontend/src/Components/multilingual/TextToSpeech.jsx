import React, { useState, useContext } from "react";
import { LanguageContext } from "../../context/LanguageContext";

const TextToSpeech = ({ text }) => {
    const { language } = useContext(LanguageContext);
    const [isSpeaking, setIsSpeaking] = useState(false);

    // Language mappings for Text-to-Speech
    const languageMap = {
        en: "en-US", // English
        hi: "hi-IN", // Hindi
        mr: "mr-IN", // Marathi
    };

    const speakText = () => {
        if (!window.speechSynthesis) {
            alert("Text-to-Speech is not supported in your browser.");
            return;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = languageMap[language] || "en-US";

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);

        speechSynthesis.speak(utterance);
    };

    return (
        <div className="text-to-speech">
            <button
                onClick={speakText}
                disabled={isSpeaking}
                className="px-4 py-2 bg-green-600 text-white rounded-md"
            >
                {isSpeaking ? "Speaking..." : "Play Audio"}
            </button>
        </div>
    );
};

export default TextToSpeech;
