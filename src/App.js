import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Systemm from "./components/Systemm";
import Status from "./components/Status";
import History from "./components/History";
import RewardsPenalties from "./components/RewardsPenalties";
import SystemToast from "./components/SystemToast";

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar />
        <main className="app-main">
          <Routes>
            <Route element={<Systemm />} path="/" />
            <Route element={<Status />} path="/status" />
            <Route element={<History />} path="/history" />
            <Route element={<RewardsPenalties />} path="/rewards-penalties" />
          </Routes>
        </main>
        <SystemToast />
      </div>
    </BrowserRouter>
  );
}

export default App;
