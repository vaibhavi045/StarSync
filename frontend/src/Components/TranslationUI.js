import React, { useState } from "react";

const Translate = () => {
    const [text, setText] = useState("");
    const [translatedText, setTranslatedText] = useState("");

    const handleTranslate = async () => {
        try {
            const response = await fetch("/api/translate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text, targetLang: "es" }), // Example: Translate to Spanish
            });
            const data = await response.json();
            setTranslatedText(data.translatedText);
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
                placeholder="Enter text to translate..."
            />
            <button onClick={handleTranslate}>Translate</button>
            <p>Translated: {translatedText}</p>
        </div>
    );
};

export default Translate;
