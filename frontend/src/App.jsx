import React from "react";
import { Routes, Route } from "react-router-dom"; // ❌ Removed BrowserRouter
import { LanguageProvider } from "./context/LanguageContext";
import Navbar from "./Components/layout/Navbar";
import Home from "./Pages/Home";
import About from "./Pages/About"; // ✅ Fix: Imported About correctly
import Login from "./Components/auth/Login";
import Signup from "./Components/auth/Signup";
import Results from "./Pages/Results";

function App() {
  return (
    <LanguageProvider>
      {/* ❌ Removed BrowserRouter (Router is already in index.js) */}
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/results" element={<Results />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </LanguageProvider>
  );
}

export default App;
