import { createContext, useState, useEffect } from "react";

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    // Retrieve language from localStorage or default to English
    const [language, setLanguage] = useState(localStorage.getItem("appLanguage") || "en");

    // Function to change language with validation
    const changeLanguage = (lang) => {
        const supportedLanguages = ["en", "hi", "mr"]; // English, Hindi, Marathi

        if (supportedLanguages.includes(lang)) {
            setLanguage(lang);
            localStorage.setItem("appLanguage", lang); // Persist in localStorage
        } else {
            console.warn(`Unsupported language: ${lang}`);
        }
    };

    // Sync state with localStorage on load
    useEffect(() => {
        const savedLanguage = localStorage.getItem("appLanguage");
        if (savedLanguage) {
            setLanguage(savedLanguage);
        }
    }, []);

    return (
        <LanguageContext.Provider value={{ language, changeLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};
