import React, { useEffect, useState } from "react";
import api from "../api";
import { notifySystem } from "./SystemToast";
import "./RewardsPenalties.css";

const emptyRule = {
  outcome_type: "reward",
  title: "",
  message: "",
  active: true,
};

export default function RewardsPenalties() {
  const [config, setConfig] = useState(null);
  const [settings, setSettings] = useState({
    reward_level_interval: 3,
    penalty_failure_threshold: 1,
  });
  const [newRule, setNewRule] = useState(emptyRule);
  const [saving, setSaving] = useState(false);
  const [adding, setAdding] = useState(false);

  const loadConfig = async () => {
    try {
      const response = await api.get("/api/reward-system");
      setConfig(response.data);
      setSettings(response.data.settings);
    } catch (error) {
      notifySystem({
        type: "error",
        title: "Reward System Offline",
        message: "Could not load reward system.",
      });
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  const saveSettings = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const response = await api.patch("/api/reward-system/settings", {
        reward_level_interval: Number(settings.reward_level_interval),
        penalty_failure_threshold: Number(settings.penalty_failure_threshold),
      });
      setConfig(response.data);
      setSettings(response.data.settings);
      notifySystem({
        title: "Reward System Synced",
        message: "Reward and penalty logic has been updated.",
        detail: `Reward every ${response.data.settings.reward_level_interval} levels`,
      });
    } catch (error) {
      notifySystem({
        type: "error",
        title: "System Sync Failed",
        message: "Settings were not saved.",
      });
    } finally {
      setSaving(false);
    }
  };

  const addRule = async (event) => {
    event.preventDefault();
    setAdding(true);
    try {
      const response = await api.post("/api/reward-system/rules", newRule);
      const key = response.data.outcome_type === "reward" ? "rewards" : "penalties";
      setConfig((current) => ({
        ...current,
        [key]: [...current[key], response.data],
      }));
      setNewRule(emptyRule);
      notifySystem({
        title: response.data.outcome_type === "reward" ? "Reward Rule Created" : "Penalty Rule Created",
        message: response.data.title,
        detail: "Outcome pool updated",
      });
    } catch (error) {
      notifySystem({
        type: "error",
        title: "Rule Creation Failed",
        message: "Rule was not added.",
      });
    } finally {
      setAdding(false);
    }
  };

  const updateRule = async (rule, changes) => {
    const updated = { ...rule, ...changes };
    setConfig((current) => {
      const key = rule.outcome_type === "reward" ? "rewards" : "penalties";
      return {
        ...current,
        [key]: current[key].map((item) => (item.id === rule.id ? updated : item)),
      };
    });
    try {
      await api.patch(`/api/reward-system/rules/${rule.id}`, changes);
      if (Object.prototype.hasOwnProperty.call(changes, "active")) {
        notifySystem({
          title: changes.active
            ? `${rule.outcome_type === "reward" ? "Reward" : "Penalty"} Rule Activated`
            : `${rule.outcome_type === "reward" ? "Reward" : "Penalty"} Rule Disabled`,
          message: rule.title,
          detail: "Outcome pool synced",
        });
      }
    } catch (error) {
      notifySystem({
        type: "error",
        title: "Rule Sync Failed",
        message: "Change was not saved.",
      });
      loadConfig();
    }
  };

  const editRuleLocally = (rule, changes) => {
    const updated = { ...rule, ...changes };
    setConfig((current) => {
      const key = rule.outcome_type === "reward" ? "rewards" : "penalties";
      return {
        ...current,
        [key]: current[key].map((item) => (item.id === rule.id ? updated : item)),
      };
    });
  };

  const saveRule = async (rule) => {
    try {
      await api.patch(`/api/reward-system/rules/${rule.id}`, {
        title: rule.title,
        message: rule.message,
        active: rule.active,
      });
      notifySystem({
        title: rule.outcome_type === "reward" ? "Reward Rule Saved" : "Penalty Rule Saved",
        message: rule.title,
        detail: "Outcome text updated",
      });
    } catch (error) {
      notifySystem({
        type: "error",
        title: "Rule Save Failed",
        message: "Rule was not saved.",
      });
      loadConfig();
    }
  };

  const deleteRule = async (rule) => {
    const confirmed = window.confirm(
      `Delete ${rule.title}? This rule will stop appearing in future check-ins.`
    );
    if (!confirmed) return;
    try {
      await api.delete(`/api/reward-system/rules/${rule.id}`);
      const key = rule.outcome_type === "reward" ? "rewards" : "penalties";
      setConfig((current) => ({
        ...current,
        [key]: current[key].filter((item) => item.id !== rule.id),
      }));
      notifySystem({
        title: "Outcome Rule Removed",
        message: rule.title,
        detail: "Reward system synced",
      });
    } catch (error) {
      notifySystem({
        type: "error",
        title: "Rule Delete Failed",
        message: "Rule was not deleted.",
      });
    }
  };

  const renderRules = (items, title, type) => (
    <section className="panel rule-section">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">{type}</p>
          <h2>{title}</h2>
        </div>
        <span className="rule-count">{items.filter((item) => item.active).length} active</span>
      </div>
      <div className="rule-list">
        {items.map((rule) => (
          <article className={`rule-card ${rule.active ? "" : "is-muted"}`} key={rule.id}>
            <label className="toggle-row">
              <input
                type="checkbox"
                checked={rule.active}
                onChange={(event) => updateRule(rule, { active: event.target.checked })}
              />
              <span>{rule.active ? "Active" : "Inactive"}</span>
            </label>
            <input
              value={rule.title}
              onChange={(event) => editRuleLocally(rule, { title: event.target.value })}
              aria-label={`${rule.outcome_type} title`}
            />
            <textarea
              value={rule.message}
              onChange={(event) => editRuleLocally(rule, { message: event.target.value })}
              aria-label={`${rule.outcome_type} message`}
              rows="3"
            />
            <div className="rule-actions">
              <button type="button" className="save-rule-action" onClick={() => saveRule(rule)}>
                Save
              </button>
              <button type="button" className="danger-action" onClick={() => deleteRule(rule)}>
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );

  if (!config) {
    return <div className="page-state">Loading reward system...</div>;
  }

  return (
    <div className="rewards-page">
      <section className="rewards-hero">
        <div>
          <p className="eyebrow">Admin Controls</p>
          <h1>Rewards & Penalties</h1>
          <p>
            Configure when rewards unlock, when penalties apply, and what messages can be assigned
            after each check-in.
          </p>
        </div>
      </section>

      <section className="rules-layout">
        <form className="panel settings-panel" onSubmit={saveSettings}>
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Logic</p>
              <h2>System rules</h2>
            </div>
          </div>
          <label>
            Reward every N levels
            <input
              type="number"
              min="1"
              max="50"
              value={settings.reward_level_interval}
              onChange={(event) =>
                setSettings({ ...settings, reward_level_interval: event.target.value })
              }
            />
          </label>
          <label>
            Penalty after missed habits
            <input
              type="number"
              min="1"
              max="20"
              value={settings.penalty_failure_threshold}
              onChange={(event) =>
                setSettings({ ...settings, penalty_failure_threshold: event.target.value })
              }
            />
          </label>
          <button className="primary-action" type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Rules"}
          </button>
        </form>

        <form className="panel new-rule-panel" onSubmit={addRule}>
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Create</p>
              <h2>New outcome</h2>
            </div>
          </div>
          <div className="outcome-segment" role="group" aria-label="Outcome type">
            <button
              type="button"
              className={newRule.outcome_type === "reward" ? "is-selected" : ""}
              onClick={() => setNewRule({ ...newRule, outcome_type: "reward" })}
            >
              Reward
            </button>
            <button
              type="button"
              className={newRule.outcome_type === "penalty" ? "is-selected" : ""}
              onClick={() => setNewRule({ ...newRule, outcome_type: "penalty" })}
            >
              Penalty
            </button>
          </div>
          <input
            value={newRule.title}
            onChange={(event) => setNewRule({ ...newRule, title: event.target.value })}
            placeholder="Title"
            required
          />
          <textarea
            value={newRule.message}
            onChange={(event) => setNewRule({ ...newRule, message: event.target.value })}
            placeholder="Message"
            rows="4"
            required
          />
          <button className="secondary-action" type="submit" disabled={adding}>
            {adding ? "Adding..." : "Add Rule"}
          </button>
        </form>
      </section>

      <div className="rules-columns">
        {renderRules(config.rewards, "Reward pool", "Rewards")}
        {renderRules(config.penalties, "Penalty pool", "Penalties")}
      </div>
    </div>
  );
}
