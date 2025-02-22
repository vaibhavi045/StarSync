const webrtcService = {
    async getLocalStream(videoRef) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            return stream;
        } catch (error) {
            console.error("Error accessing user media:", error);
            throw error;
        }
    },

    createPeerConnection(remoteVideoRef, onIceCandidate) {
        const configuration = {
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }], // Google STUN server
        };

        const peerConnection = new RTCPeerConnection(configuration);

        peerConnection.ontrack = (event) => {
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = event.streams[0];
            }
        };

        peerConnection.onicecandidate = (event) => {
            if (event.candidate && onIceCandidate) {
                onIceCandidate(event.candidate);
            }
        };

        return peerConnection;
    },

    async createOffer(peerConnection) {
        try {
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);
            return offer;
        } catch (error) {
            console.error("Error creating offer:", error);
            throw error;
        }
    },

    async createAnswer(peerConnection, offer) {
        try {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
            return answer;
        } catch (error) {
            console.error("Error creating answer:", error);
            throw error;
        }
    },

    async handleAnswer(peerConnection, answer) {
        try {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
        } catch (error) {
            console.error("Error handling answer:", error);
            throw error;
        }
    },

    async addIceCandidate(peerConnection, candidate) {
        try {
            await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (error) {
            console.error("Error adding ICE candidate:", error);
        }
    },

    toggleAudio(videoRef, setIsMuted) {
        if (videoRef.current?.srcObject) {
            const tracks = videoRef.current.srcObject.getAudioTracks();
            tracks.forEach((track) => (track.enabled = !track.enabled));
            setIsMuted((prev) => !prev);
        }
    },

    toggleVideo(videoRef, setIsVideoOff) {
        if (videoRef.current?.srcObject) {
            const tracks = videoRef.current.srcObject.getVideoTracks();
            tracks.forEach((track) => (track.enabled = !track.enabled));
            setIsVideoOff((prev) => !prev);
        }
    },

    endCall(peerConnection, videoRef) {
        if (peerConnection) {
            peerConnection.close();
        }
        if (videoRef.current?.srcObject) {
            videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
            videoRef.current.srcObject = null;
        }
    },
};

export default webrtcService;
