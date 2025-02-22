import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

const Footer = () => {
    const { currentLanguage } = useLanguage();

    // Footer Texts Based on Language
    const footerTexts = {
        en: {
            home: "Home",
            screening: "Screening",
            contact: "Contact Us",
            rights: "All Rights Reserved.",
        },
        hi: {
            home: "होम",
            screening: "स्क्रीनिंग",
            contact: "संपर्क करें",
            rights: "सभी अधिकार सुरक्षित।",
        },
        mr: {
            home: "मुख्यपृष्ठ",
            screening: "स्क्रीनिंग",
            contact: "संपर्क करा",
            rights: "सर्व हक्क राखीव.",
        },
    };

    return (
        <footer className="bg-gray-800 text-white py-6 mt-10">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-6">
                {/* Logo */}
                <div className="mb-4 md:mb-0">
                    <h2 className="text-xl font-bold">🏥 MedScreenBot</h2>
                </div>

                {/* Navigation Links */}
                <div className="flex space-x-6">
                    <Link to="/" className="hover:text-gray-300">{footerTexts[currentLanguage].home}</Link>
                    <Link to="/screening" className="hover:text-gray-300">{footerTexts[currentLanguage].screening}</Link>
                    <Link to="/contact" className="hover:text-gray-300">{footerTexts[currentLanguage].contact}</Link>
                </div>

                {/* Copyright */}
                <div className="text-sm mt-4 md:mt-0">
                    &copy; {new Date().getFullYear()} MedScreenBot. {footerTexts[currentLanguage].rights}
                </div>
            </div>
        </footer>
    );
};

export default Footer;
