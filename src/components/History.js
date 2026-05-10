import React, { useEffect, useState } from "react";
import api from "../api";
import "./Status.css";

export default function History() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get("/api/history").then((response) => {
      setItems(Array.isArray(response.data) ? response.data : []);
    });
  }, []);

  const totalEntries = items.length;
  const totalXp = items.reduce((sum, item) => sum + Number(item.totalXp || 0), 0);
  const bestDay = items.reduce(
    (best, item) => (Number(item.totalXp || 0) > Number(best.totalXp || 0) ? item : best),
    { totalXp: 0 }
  );

  const formatDate = (value) => {
    if (!value) return { day: "--", month: "---", year: "----" };
    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return { day: value, month: "", year: "" };
    return {
      day: date.toLocaleDateString("en-US", { day: "2-digit" }),
      month: date.toLocaleDateString("en-US", { month: "short" }),
      year: date.toLocaleDateString("en-US", { year: "numeric" }),
    };
  };

  return (
    <div className="history-page">
      <section className="history-hero">
        <div>
          <p className="eyebrow">Archive</p>
          <h1>Quest History</h1>
          <p>Review completed check-ins, XP shifts, rank movement, and daily quest consistency.</p>
        </div>
      </section>

      <section className="history-summary">
        <article className="metric-card">
          <span>Entries</span>
          <strong>{totalEntries}</strong>
          <p>daily records</p>
        </article>
        <article className="metric-card">
          <span>Archived XP</span>
          <strong>{totalXp >= 0 ? `+${totalXp}` : totalXp}</strong>
          <p>from listed check-ins</p>
        </article>
        <article className="metric-card">
          <span>Best Day</span>
          <strong>{bestDay.totalXp >= 0 ? `+${bestDay.totalXp}` : bestDay.totalXp}</strong>
          <p>{bestDay.date || bestDay.dater || "No records"}</p>
        </article>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Timeline</p>
            <h2>Daily records</h2>
          </div>
        </div>
        <div className="history-timeline">
          {items.map((item) => (
            <article className="history-record" key={item._id || item.date}>
              <div className="record-date">
                <div className="date-badge">
                  <strong>{formatDate(item.date || item.dater).day}</strong>
                  <span>{formatDate(item.date || item.dater).month}</span>
                  <small>{formatDate(item.date || item.dater).year}</small>
                </div>
                <strong>Level {item.currentlevel}</strong>
              </div>
              <div className="record-main">
                <strong>{item.title}</strong>
                <span>
                  {item.completed}/{item.total} quests complete
                </span>
              </div>
              <div className={item.totalXp >= 0 ? "record-xp positive" : "record-xp negative"}>
                {item.totalXp >= 0 ? "+" : ""}
                {item.totalXp} XP
              </div>
            </article>
          ))}
          {items.length === 0 && (
            <div className="empty-history">
              No check-ins recorded yet.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
