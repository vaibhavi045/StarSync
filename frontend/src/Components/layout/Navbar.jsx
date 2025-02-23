import React, { useState } from "react";
import { Link } from "react-router-dom";
import LanguageSelector from "../multilingual/LanguageSelector";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-blue-600 text-white px-6 py-4 shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="text-2xl font-extrabold flex items-center space-x-2">
                    <h1>Heal Vaani - </h1>
                    <h3>Voice Of Healing</h3>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-6">
                    <Link to="/" className="hover:text-gray-300 transition">Home</Link>
                    <Link to="/about" className="hover:text-gray-300 transition">About</Link>
                    <Link to="/results" className="hover:text-gray-300 transition">Results</Link>
                    <LanguageSelector />
                    <Link to="/login" className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-200 transition">
                        Login
                    </Link>
                    <Link to="/signup" className="bg-gray-300 text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-400 transition">
                        Signup
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-2xl focus:outline-none"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                >
                    {isOpen ? "✖" : "☰"}
                </button>
            </div>

            {/* Mobile Navigation Menu */}
            <div
                className={`md:hidden overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h-[400px]" : "max-h-0"
                }`}
            >
                <div className="flex flex-col items-center space-y-4 mt-4">
                    <Link to="/" className="hover:text-gray-300" onClick={() => setIsOpen(false)}>Home</Link>
                    <Link to="/about" className="hover:text-gray-300" onClick={() => setIsOpen(false)}>About</Link>
                    <Link to="/screening" className="hover:text-gray-300" onClick={() => setIsOpen(false)}>Screening</Link>
                    <Link to="/results" className="hover:text-gray-300" onClick={() => setIsOpen(false)}>Results</Link>
                    <LanguageSelector />
                    <Link to="/login" className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-200 transition" onClick={() => setIsOpen(false)}>
                        Login
                    </Link>
                    <Link to="/signup" className="bg-gray-300 text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-400 transition" onClick={() => setIsOpen(false)}>
                        Signup
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
