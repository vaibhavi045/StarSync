const speechService = {
    // Speech-to-Text (Voice Recognition)
    startSpeechRecognition(onResult, onError) {
        try {
            const SpeechRecognition =
                window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SpeechRecognition) {
                throw new Error("Speech recognition is not supported in this browser.");
            }

            const recognition = new SpeechRecognition();
            recognition.lang = "en-US"; // Default language (can be customized)
            recognition.continuous = false;
            recognition.interimResults = false;

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                if (onResult) onResult(transcript);
            };

            recognition.onerror = (event) => {
                console.error("Speech Recognition Error:", event.error);
                if (onError) onError(event.error);
            };

            recognition.start();
            return recognition;
        } catch (error) {
            console.error("Error initializing speech recognition:", error);
            if (onError) onError(error.message);
            return null;
        }
    },

    // Stop Speech Recognition
    stopSpeechRecognition(recognition) {
        if (recognition) {
            recognition.stop();
        }
    },

    // Text-to-Speech (TTS)
    speakText(text, language = "en-US") {
        if (!window.speechSynthesis) {
            console.error("Text-to-Speech is not supported in this browser.");
            return;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language;
        utterance.rate = 1.0; // Adjust speed (0.5 - slow, 1 - normal, 2 - fast)
        utterance.pitch = 1.0; // Adjust pitch (0 - low, 1 - normal, 2 - high)

        window.speechSynthesis.speak(utterance);
    },

    // Stop Speech Synthesis
    stopSpeaking() {
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
        }
    }
};

export default speechService;
