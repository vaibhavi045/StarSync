import { createContext, useContext, useState, useEffect } from "react";

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    // Retrieve language from localStorage or default to English
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem("appLanguage") || "en";
    });

    // Function to change language
    const changeLanguage = (lang) => {
        const supportedLanguages = ["en", "hi", "mr"]; // English, Hindi, Marathi

        if (supportedLanguages.includes(lang)) {
            setLanguage(lang);
            localStorage.setItem("appLanguage", lang); // Persist in localStorage
        } else {
            console.warn(`Unsupported language: ${lang}`);
        }
    };

    // Sync state with localStorage only on mount
    useEffect(() => {
        const savedLanguage = localStorage.getItem("appLanguage");
        if (savedLanguage && savedLanguage !== language) {
            setLanguage(savedLanguage);
        }
    }, []); // Empty dependency array ensures it runs only once

    return (
        <LanguageContext.Provider value={{ language, changeLanguage }}>  
            {children}
        </LanguageContext.Provider>
    );
};

// ✅ Custom Hook for easy access to LanguageContext
export const useLanguage = () => {
    return useContext(LanguageContext);
};
