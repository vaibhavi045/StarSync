import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TextToSpeech from "../multilingual/TextToSpeech";
import { Button } from "../common/Button";

const Results = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { diagnosis, recommendations } = location.state || {};

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <div className="max-w-3xl text-center bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-green-600 mb-4">Diagnosis Results</h1>

                {diagnosis ? (
                    <>
                        <p className="text-lg text-gray-700 font-semibold">Your Diagnosis:</p>
                        <div className="p-4 bg-blue-100 border border-blue-300 rounded-lg mt-2">
                            <p className="text-blue-700 font-medium">{diagnosis}</p>
                        </div>

                        {/* Text-to-Speech Output */}
                        <TextToSpeech text={diagnosis} />

                        {recommendations && (
                            <>
                                <p className="text-lg text-gray-700 font-semibold mt-6">Recommended Actions:</p>
                                <ul className="text-gray-600 mt-2 list-disc list-inside">
                                    {recommendations.map((rec, index) => (
                                        <li key={index}>{rec}</li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </>
                ) : (
                    <p className="text-red-500 text-lg font-semibold">No results available. Please try again.</p>
                )}

                <div className="mt-6 flex gap-4">
                    <Button text="Back to Home" onClick={() => navigate("/")} className="bg-blue-500" />
                    <Button text="Retake Screening" onClick={() => navigate("/screening")} className="bg-green-500" />
                </div>
            </div>
        </div>
    );
};

export default Results;
