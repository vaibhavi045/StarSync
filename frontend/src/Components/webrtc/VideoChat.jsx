import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";
import AvatarDisplay from "./AvatarDisplay";
import webrtcService from "../../services/webrtcService";

const VideoChat = () => {
    const { currentLanguage } = useLanguage();
    const [isMuted, setIsMuted] = useState(false);
    const [isCallActive, setIsCallActive] = useState(false);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    let peerConnection = useRef(null);

    // Text translations
    const texts = {
        en: { start: "Start Call", end: "End Call", mute: "Mute", unmute: "Unmute" },
        hi: { start: "कॉल शुरू करें", end: "कॉल समाप्त करें", mute: "म्यूट करें", unmute: "अनम्यूट करें" },
        mr: { start: "कॉल सुरू करा", end: "कॉल समाप्त करा", mute: "म्यूट करा", unmute: "अनम्यूट करा" },
    };

    useEffect(() => {
        return () => {
            webrtcService.endCall(peerConnection.current);
        };
    }, []);

    const startCall = async () => {
        try {
            setIsCallActive(true);
            peerConnection.current = webrtcService.createPeerConnection(remoteVideoRef);
            await webrtcService.getLocalStream(localVideoRef);
        } catch (error) {
            console.error("Error starting call:", error);
        }
    };

    const endCall = () => {
        webrtcService.endCall(peerConnection.current);
        setIsCallActive(false);
    };

    const toggleMute = () => {
        webrtcService.toggleAudio(localVideoRef, setIsMuted);
    };

    return (
        <div className="flex flex-col items-center justify-center p-4">
            {/* Video Chat UI */}
            <div className="w-full max-w-4xl flex flex-col md:flex-row justify-between bg-gray-100 p-4 rounded-lg shadow-lg">
                {/* Local Video */}
                <div className="relative w-full md:w-1/2">
                    <video ref={localVideoRef} autoPlay muted className="w-full rounded-lg shadow-md bg-black" />
                    {!isCallActive && <AvatarDisplay />}
                </div>

                {/* Remote Video */}
                <div className="relative w-full md:w-1/2 mt-4 md:mt-0">
                    <video ref={remoteVideoRef} autoPlay className="w-full rounded-lg shadow-md bg-black" />
                </div>
            </div>

            {/* Controls */}
            <div className="flex space-x-4 mt-4">
                {!isCallActive ? (
                    <button onClick={startCall} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                        {texts[currentLanguage].start}
                    </button>
                ) : (
                    <>
                        <button onClick={endCall} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                            {texts[currentLanguage].end}
                        </button>
                        <button onClick={toggleMute} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                            {isMuted ? texts[currentLanguage].unmute : texts[currentLanguage].mute}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default VideoChat;
