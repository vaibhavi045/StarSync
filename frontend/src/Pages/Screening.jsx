import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SpeechToText from "../multilingual/SpeechToText";
import TextToSpeech from "../multilingual/TextToSpeech";
import AvatarDisplay from "../webrtc/AvatarDisplay";
import { Button } from "../common/Button";

const Screening = () => {
    const navigate = useNavigate();
    const [symptoms, setSymptoms] = useState("");
    const [response, setResponse] = useState("");
    const [isSpeaking, setIsSpeaking] = useState(false);

    const handleSpeechResult = (text) => {
        setSymptoms(text);
    };

    const handleScreening = async () => {
        if (!symptoms.trim()) {
            alert("Please describe your symptoms.");
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/api/screening", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ symptoms }),
            });

            const data = await res.json();
            if (data?.diagnosis) {
                setResponse(data.diagnosis);
                setIsSpeaking(true);
            } else {
                setResponse("Unable to process your request.");
            }
        } catch (error) {
            console.error("Screening Error:", error);
            setResponse("Error connecting to the server.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <div className="max-w-3xl text-center bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-blue-600 mb-4">Medical Screening</h1>
                <p className="text-gray-700 text-lg mb-4">
                    Speak or type your symptoms below, and our AI doctor will assist you.
                </p>

                {/* Avatar representing a doctor */}
                <AvatarDisplay />

                {/* Speech-to-Text Component */}
                <SpeechToText onSpeechResult={handleSpeechResult} />

                {/* Text Input for Symptoms */}
                <textarea
                    className="w-full border rounded-lg p-2 text-gray-700"
                    placeholder="Or type your symptoms here..."
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                />

                <Button text="Get Diagnosis" onClick={handleScreening} className="mt-4" />

                {/* Display AI Response */}
                {response && (
                    <div className="mt-6 p-4 bg-green-100 border border-green-300 rounded-lg">
                        <p className="text-green-700 font-semibold">{response}</p>

                        {/* Text-to-Speech Output */}
                        {isSpeaking && <TextToSpeech text={response} />}
                    </div>
                )}

                <Button text="Go Back" onClick={() => navigate("/")} className="mt-6 bg-red-500" />
            </div>
        </div>
    );
};

export default Screening;
