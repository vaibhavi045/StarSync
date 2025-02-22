import React, { useState } from "react";

const SpeechToText = () => {
    const [text, setText] = useState("");

    const handleSpeechRecognition = async () => {
        try {
            const response = await fetch("/api/speech-to-text");
            const data = await response.json();
            setText(data.text);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div>
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Speak or type here..."
            />
            <button onClick={handleSpeechRecognition}>🎤</button>
        </div>
    );
};

export default SpeechToText;
