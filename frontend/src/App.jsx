import React from "react";
import Home from "./Pages/Home";
import { LanguageProvider } from "./context/LanguageContext";
import LanguageSelector from "./Components/multilingual/LanguageSelector";

function App() {
  return (
    <LanguageProvider>
      <div className="app">
        <LanguageSelector />
        <Home />
      </div>
    </LanguageProvider>
  );
}

export default App;
