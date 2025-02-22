import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import LanguageSelector from "../multilingual/LanguageSelector";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { currentLanguage } = useLanguage();

    return (
        <nav className="bg-blue-600 text-white px-6 py-3 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="text-xl font-bold">
                    🏥 MedScreenBot
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex space-x-6">
                    <Link to="/" className="hover:text-gray-200">Home</Link>
                    <Link to="/screening" className="hover:text-gray-200">Screening</Link>
                    <Link to="/results" className="hover:text-gray-200">Results</Link>
                    <LanguageSelector />
                    <Link to="/login" className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-gray-200">
                        Login
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden focus:outline-none"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? "✖" : "☰"}
                </button>
            </div>

            {/* Mobile Navigation Menu */}
            {isOpen && (
                <div className="md:hidden flex flex-col items-center space-y-4 mt-4">
                    <Link to="/" className="hover:text-gray-200" onClick={() => setIsOpen(false)}>Home</Link>
                    <Link to="/screening" className="hover:text-gray-200" onClick={() => setIsOpen(false)}>Screening</Link>
                    <Link to="/results" className="hover:text-gray-200" onClick={() => setIsOpen(false)}>Results</Link>
                    <LanguageSelector />
                    <Link to="/login" className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-gray-200" onClick={() => setIsOpen(false)}>
                        Login
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
