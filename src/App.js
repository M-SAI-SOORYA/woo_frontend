import React from "react";
import Systemm from "./components/Systemm";
import Navbar from "./components/Navbar";
import Status from "./components/Status";
import History from "./components/History";
import { BrowserRouter, Route, Routes } from "react-router-dom";
function App() {

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route element={<Systemm />} path="/"></Route>
          <Route element={<Status />} path="/status"></Route>
          <Route element={<History />} path="/history"></Route>
        </Routes>
      </BrowserRouter>



    </>
  );
}

export default App;
