import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PropertyPage from "./components/PropertyDetails";
import HomePage from "./components/HomePage";

const App = () => {

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/property/:id" element={<PropertyPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
