import React, { useEffect, useState } from "react";
import api from "../api";
import "./Status.css";

export default function Status() {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    api.get("/api/dashboard").then((response) => setDashboard(response.data));
  }, []);

  if (!dashboard) {
    return <div className="page-state">Loading status...</div>;
  }

  const bestStreak = Math.max(...dashboard.habits.map((habit) => habit.best_streak), 0);
  const activeHabits = dashboard.habits.length;
  const nextLevelXp = Math.max(dashboard.progress.required - dashboard.progress.current, 0);

  return (
    <div className="status-page">
      <section className="profile-band">
        <div>
          <p className="eyebrow">Player Status</p>
          <h1>{dashboard.player}</h1>
          <p>{dashboard.job}</p>
          <div className="profile-meta">
            <span>{dashboard.title}</span>
            <span>{activeHabits} active habits</span>
            <span>{bestStreak} best streak</span>
          </div>
        </div>
        <div className="level-emblem">
          <span>Level</span>
          <strong>{dashboard.currentlevel}</strong>
        </div>
      </section>

      <section className="status-grid">
        <article className="metric-card">
          <span>Total XP</span>
          <strong>{dashboard.totalXp}</strong>
          <p>{dashboard.title}</p>
        </article>
        <article className="metric-card">
          <span>Today</span>
          <strong>{dashboard.today.percent}%</strong>
          <p>
            {dashboard.today.completed}/{dashboard.today.total} habits complete
          </p>
        </article>
        <article className="metric-card">
          <span>Next Level</span>
          <strong>{nextLevelXp}</strong>
          <p>XP remaining</p>
        </article>
      </section>

      <section className="panel level-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Progress Core</p>
            <h2>Level calibration</h2>
          </div>
          <span className="level-chip">{dashboard.progress.percent}% synced</span>
        </div>
        <div className="level-progress-large">
          <div style={{ width: `${dashboard.progress.percent}%` }} />
        </div>
        <div className="level-readout">
          <span>{dashboard.progress.current} XP earned this level</span>
          <strong>{dashboard.progress.required} XP required</strong>
        </div>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Attributes</p>
            <h2>Stat growth</h2>
          </div>
        </div>
        <div className="stat-list">
          {dashboard.stats.map((item) => (
            <div className="stat-row" key={item.stat}>
              <span>{item.stat}</span>
              <div className="stat-meter">
                <div style={{ width: `${Math.min(Math.abs(item.xp), 500) / 5}%` }} />
              </div>
              <strong>{item.xp} XP</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="panel habit-status-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Quest State</p>
            <h2>Active habit status</h2>
          </div>
        </div>
        <div className="status-habit-grid">
          {dashboard.habits.map((habit) => (
            <article className={habit.completed_today ? "status-habit-card is-complete" : "status-habit-card"} key={habit.id}>
              <div>
                <strong>{habit.name}</strong>
                <span>{habit.category} - {habit.stat}</span>
              </div>
              <em>{habit.completed_today ? "Completed" : `+${habit.xp} XP`}</em>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
