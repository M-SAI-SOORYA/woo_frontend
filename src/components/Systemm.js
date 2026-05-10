import React, { useEffect, useMemo, useState } from "react";
import api from "../api";
import { notifySystem } from "./SystemToast";
import "./Systemm.css";

const emptyHabit = {
  name: "",
  category: "",
  stat: "",
  xp: 25,
  penalty: 10,
  cadence: "daily",
};

export default function Systemm() {
  const [dashboard, setDashboard] = useState(null);
  const [checkins, setCheckins] = useState({});
  const [habitForm, setHabitForm] = useState(emptyHabit);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadDashboard = async ({ showLoading = false } = {}) => {
    if (showLoading) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }
    try {
      const response = await api.get("/api/dashboard");
      setDashboard(response.data);
      const defaults = {};
      response.data.habits.forEach((habit) => {
        defaults[habit.id] = Boolean(habit.completed_today);
      });
      setCheckins(defaults);
    } catch (error) {
      notifySystem({
        type: "error",
        title: "System Link Failed",
        message: "Backend is not reachable.",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboard({ showLoading: true });
  }, []);

  const completedCount = useMemo(
    () => Object.values(checkins).filter(Boolean).length,
    [checkins]
  );

  const submitCheckins = async (event) => {
    event.preventDefault();
    if (!dashboard?.habits?.length) {
      notifySystem({
        title: "All Habits Completed",
        message: "Add a new habit and complete it to update your level, Player.",
        detail: "No active quests available",
      });
      return;
    }
    setSaving(true);
    try {
      const response = await api.post("/api/checkins", {
        items: dashboard.habits.map((habit) => ({
          habit_id: habit.id,
          completed: Boolean(habit.completed_today || checkins[habit.id]),
        })),
      });
      setDashboard(response.data.dashboard);
      const updatedCheckins = {};
      response.data.dashboard.habits.forEach((habit) => {
        updatedCheckins[habit.id] = Boolean(habit.completed_today);
      });
      setCheckins(updatedCheckins);
      if (response.data.xpDelta === 0) {
        notifySystem({
          title: "All Habits Completed",
          message: "If you want more progress, add a new habit and complete it.",
          detail: "Level will update after new XP is earned, Player",
        });
      } else {
        notifySystem({
          type: response.data.xpDelta > 0 ? "success" : "warning",
          title: "Level Progress Updated",
          message: `${response.data.xpDelta > 0 ? "+" : ""}${response.data.xpDelta} XP recorded`,
          detail: `${response.data.dashboard.progress.current}/${response.data.dashboard.progress.required} XP toward next level`,
        });
      }
      if (response.data.leveledUp) {
        notifySystem({
          title: "Level Up",
          message: `You reached Level ${response.data.dashboard.currentlevel}.`,
          detail: response.data.dashboard.title,
        });
      }
      if (response.data.reward) {
        notifySystem({
          title: "Reward Unlocked",
          message: response.data.reward,
          detail: "Claim earned through level progress",
        });
      }
      if (response.data.penalty) {
        notifySystem({
          type: "warning",
          title: "Penalty Assigned",
          message: response.data.penalty,
          detail: "Missed quest threshold reached",
        });
      }
    } catch (error) {
      notifySystem({
        type: "error",
        title: "Quest Sync Failed",
        message: "Could not record daily quests.",
      });
    } finally {
      setSaving(false);
    }
  };

  const createHabit = async (event) => {
    event.preventDefault();
    try {
      await api.post("/api/habits", {
        ...habitForm,
        xp: Number(habitForm.xp),
        penalty: Number(habitForm.penalty),
      });
      setHabitForm(emptyHabit);
      notifySystem({
        title: "Habit Saved",
        message: `${habitForm.name} has been added to active quests.`,
        detail: "Level requirement recalculated",
      });
      loadDashboard();
    } catch (error) {
      notifySystem({
        type: "error",
        title: "Habit Save Failed",
        message: "Check the habit details and try again.",
      });
    }
  };

  const deleteHabit = async () => {
    if (!pendingDelete) return;
    const habit = pendingDelete;
    try {
      await api.delete(`/api/habits/${habit.id}`);
      notifySystem({
        title: "Quest Updated",
        message: `${habit.name} was removed from active quests.`,
        detail: "Level requirement recalculated",
      });
      setPendingDelete(null);
      loadDashboard();
    } catch (error) {
      notifySystem({
        type: "error",
        title: "Quest Update Failed",
        message: "Could not delete habit.",
      });
    }
  };

  if (loading) {
    return <div className="page-state">Loading system data...</div>;
  }

  return (
    <div className="quest-page">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Daily Quest Board</p>
          <h1>{dashboard?.title || "Starter"}</h1>
          <p className="hero-copy">
            Track habits, earn XP, protect streaks, and push your hunter rank forward.
          </p>
        </div>
        <div className="rank-card">
          <span>Level</span>
          <strong>{dashboard?.currentlevel ?? 0}</strong>
          <div className="progress-track">
            <div style={{ width: `${dashboard?.progress?.percent || 0}%` }} />
          </div>
          <small>
            {dashboard?.progress?.current || 0}/{dashboard?.progress?.required || 100} XP
          </small>
        </div>
      </section>

      <section className="quest-grid">
        <form className={`panel quests-panel ${refreshing ? "is-refreshing" : ""}`} onSubmit={submitCheckins}>
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Today</p>
              <h2>Active habits</h2>
            </div>
            <span className="completion-pill">
              {completedCount}/{dashboard?.habits?.length || 0} complete
            </span>
          </div>

          <div className="habit-list">
            {dashboard?.habits?.map((habit) => (
              <label
                className={`habit-row ${habit.completed_today ? "is-completed" : ""}`}
                key={habit.id}
              >
                <input
                  type="checkbox"
                  checked={Boolean(checkins[habit.id])}
                  disabled={Boolean(habit.completed_today)}
                  onChange={(event) =>
                    setCheckins((current) => ({
                      ...current,
                      [habit.id]: event.target.checked,
                    }))
                  }
                />
                <span className="habit-check" />
                <span className="habit-main">
                  <strong>{habit.name}</strong>
                  <small>
                    {habit.category} - {habit.stat} - streak {habit.current_streak}
                    {habit.completed_today ? " - locked complete" : ""}
                  </small>
                </span>
                <span className="xp-chip">
                  {habit.completed_today ? "Completed" : `+${habit.xp} XP`}
                </span>
                <button
                  type="button"
                  className="icon-action"
                  onClick={(event) => {
                    event.preventDefault();
                    setPendingDelete(habit);
                  }}
                >
                  Delete
                </button>
              </label>
            ))}
          </div>

          <button className="primary-action" type="submit" disabled={saving}>
            {saving ? "Recording..." : "Complete Daily Check-in"}
          </button>
        </form>

        <form className="panel habit-builder" onSubmit={createHabit}>
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Build</p>
              <h2>New habit</h2>
            </div>
          </div>
          <input
            value={habitForm.name}
            onChange={(event) => setHabitForm({ ...habitForm, name: event.target.value })}
            placeholder="Habit name"
            required
          />
          <div className="field-pair">
            <input
              value={habitForm.category}
              onChange={(event) => setHabitForm({ ...habitForm, category: event.target.value })}
              placeholder="Category"
              required
            />
            <input
              value={habitForm.stat}
              onChange={(event) => setHabitForm({ ...habitForm, stat: event.target.value })}
              placeholder="Stat"
              required
            />
          </div>
          <div className="field-pair">
            <label>
              XP
              <input
                type="number"
                min="1"
                max="100"
                value={habitForm.xp}
                onChange={(event) => setHabitForm({ ...habitForm, xp: event.target.value })}
              />
            </label>
            <label>
              Penalty
              <input
                type="number"
                min="0"
                max="100"
                value={habitForm.penalty}
                onChange={(event) => setHabitForm({ ...habitForm, penalty: event.target.value })}
              />
            </label>
          </div>
          <button className="secondary-action" type="submit">
            Add Habit
          </button>
        </form>
      </section>

      {pendingDelete && (
        <div className="system-modal-backdrop" role="presentation">
          <section className="system-modal" role="dialog" aria-modal="true" aria-labelledby="delete-habit-title">
            <div className="system-modal-scan" />
            <p className="eyebrow">Quest Removal</p>
            <h2 id="delete-habit-title">Delete {pendingDelete.name}?</h2>
            <p>
              This will remove the habit and its history from the system. Your level requirement
              will be recalculated after deletion.
            </p>
            <div className="delete-preview">
              <span>{pendingDelete.category}</span>
              <strong>{pendingDelete.stat}</strong>
              <em>{pendingDelete.xp} XP</em>
            </div>
            <div className="system-modal-actions">
              <button type="button" className="modal-secondary" onClick={() => setPendingDelete(null)}>
                Cancel
              </button>
              <button type="button" className="modal-danger" onClick={deleteHabit}>
                Delete Quest
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
