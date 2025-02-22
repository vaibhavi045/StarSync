import React, { useContext } from "react";
import { LanguageContext } from "../../context/LanguageContext";

const LanguageSelector = () => {
    const { language, setLanguage } = useContext(LanguageContext);

    const handleLanguageChange = (event) => {
        setLanguage(event.target.value);
    };

    return (
        <div className="flex items-center gap-3 p-2">
            <label htmlFor="language" className="text-lg font-semibold">
                🌍 Select Language:
            </label>
            <select
                id="language"
                value={language}
                onChange={handleLanguageChange}
                className="p-2 border rounded-md bg-white text-gray-800"
            >
                <option value="en">English</option>
                <option value="mr">मराठी (Marathi)</option>
                <option value="hi">हिंदी (Hindi)</option>
            </select>
        </div>
    );
};

export default LanguageSelector;
