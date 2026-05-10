import React from "react";
import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <header className="topbar">
      <div className="brand-cluster">
        <NavLink className="brand" to="/">
          <span className="brand-mark">S</span>
          <span>
            <strong>SYSTEM</strong>
            <small>Discipline RPG</small>
          </span>
        </NavLink>
        <NavLink className="brand-reward-link" to="/rewards-penalties">
          Rewards
        </NavLink>
      </div>
      <nav className="nav-links" aria-label="Primary navigation">
        <NavLink to="/" end>
          Quests
        </NavLink>
        <NavLink to="/status">Status</NavLink>
        <NavLink to="/history">History</NavLink>
      </nav>
    </header>
  );
}

export default Navbar;
