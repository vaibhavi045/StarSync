// ✅ Application-wide constants

// 🌐 Supported languages for multilingual feature
export const SUPPORTED_LANGUAGES = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "hi", name: "Hindi" },
    { code: "zh", name: "Chinese" },
    { code: "ar", name: "Arabic" },
    { code: "mr", name: "Marathi" },  // ✅ Added Marathi
];

// 🔑 Authentication-related constants
export const AUTH_TOKEN_KEY = "authToken";
export const USER_INFO_KEY = "userInfo";

// 🌍 API Endpoints
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";
export const AUTH_ENDPOINTS = {
    REGISTER: `${API_BASE_URL}/auth/signup`,
    LOGIN: `${API_BASE_URL}/auth/login`,
    FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
    RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
    USER_DETAILS: `${API_BASE_URL}/auth/user`,
};

// 🎨 UI Constants
export const THEME_OPTIONS = {
    LIGHT: "light",
    DARK: "dark",
};

// 🎙️ Speech-to-Text & Text-to-Speech settings
export const STT_LANGUAGE_CODES = {
    en: "en-US",
    es: "es-ES",
    fr: "fr-FR",
    de: "de-DE",
    hi: "hi-IN",
    zh: "zh-CN",
    ar: "ar-SA",
    mr: "mr-IN",  // ✅ Added Marathi for Speech-to-Text
};

export const TTS_VOICE_OPTIONS = {
    en: "Google US English",
    es: "Google Español",
    fr: "Google Français",
    de: "Google Deutsch",
    hi: "Google हिन्दी",
    zh: "Google 中文",
    ar: "Google العربية",
    mr: "Google मराठी",  // ✅ Added Marathi for Text-to-Speech
};

// 📞 WebRTC configurations
export const WEBRTC_CONFIG = {
    iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
    ],
};

// ⚙️ Default user settings
export const DEFAULT_USER_SETTINGS = {
    language: "en",
    theme: THEME_OPTIONS.LIGHT,
};
