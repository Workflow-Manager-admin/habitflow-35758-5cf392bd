import React, { useMemo } from "react";
import "./App.css";

// PUBLIC_INTERFACE
/**
 * HabitsList Component for displaying a grid of habit cards.
 * Props:
 *   habits: array of habit objects ({ id, name, frequency, streak, ... })
 *   onToggleDone: function (habitId) -> toggles done for today
 *   onEdit: function (habitId) -> trigger edit for habit
 *   onDelete: function (habitId) -> delete habit
 */
function HabitsList({ habits, onToggleDone, onEdit, onDelete }) {
  const today = new Date();

  // Helper to get if today is marked done for this habit
  function isHabitDoneToday(habit) {
    const ym = `${today.getFullYear()}-${(today.getMonth() + 1)
      .toString()
      .padStart(2, "0")}`;
    const todayNum = today.getDate();
    return (habit.calendar?.[ym] || []).includes(todayNum);
  }

  // Derive the habit's goal based on frequency
  function getHabitGoal(habit) {
    if (habit.frequency === "Daily") {
      // Number of days in this month (track completion for each day)
      return new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    }
    if (habit.frequency === "Weekly") {
      // Weeks in current month: (daysInMonth / 7, rounding up)
      const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
      return Math.ceil(daysInMonth / 7);
    }
    if (habit.frequency === "Monthly") {
      // Just 1 successful completion per month
      return 1;
    }
    // Default fallback
    return 21;
  }

  function getProgress(habit) {
    const ym = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, "0")}`;
    const daysDone = habit.calendar?.[ym] || [];
    if (habit.frequency === "Daily") {
      // How many days marked done
      return daysDone.length;
    }
    if (habit.frequency === "Weekly") {
      // Count number of separate weeks where at least one day is checked (week starts Sunday)
      const weekSet = new Set();
      daysDone.forEach(dayNum => {
        // Which week of the month is this day?
        const weekIndex = Math.floor((dayNum - 1) / 7);
        weekSet.add(weekIndex);
      });
      return weekSet.size;
    }
    if (habit.frequency === "Monthly") {
      // If at least one day marked, user reached monthly goal
      return daysDone.length > 0 ? 1 : 0;
    }
    // Default: treat as daily
    return daysDone.length;
  }

  // Animated ProgressBar component
  // PUBLIC_INTERFACE
  function ProgressBar({ value, max, label }) {
    // Clamp percent, avoid divide-by-0
    const percent = max > 0 ? Math.min(Math.round((value / max) * 100), 100) : 0;

    // Animate width (spring alternative: for simplicity, use CSS transition)
    return (
      <div className="habit-progressbar-wrapper">
        <div className="habit-progressbar-track">
          <div
            className="habit-progressbar-fill"
            style={{ width: percent + "%" }}
            aria-valuenow={percent}
            aria-valuemax={100}
            aria-label="Habit completion progress"
          />
        </div>
        <span className="habit-progressbar-label">
          {label ? label : `${percent}%`}
        </span>
      </div>
    );
  }

  return (
    <div className="habits-list-grid">
      {habits.map((habit) => {
        const goal = getHabitGoal(habit);
        const progress = getProgress(habit);
        const percent = goal > 0 ? Math.round((progress / goal) * 100) : 0;
        // Label format (e.g. "4/21 (19%)")
        const label = habit.frequency === "Monthly"
          ? `${progress === 1 ? "Complete" : "0/1"} (${percent}%)`
          : `${progress}/${goal} (${percent}%)`;

        return (
          <div className="habit-card-v2" key={habit.id} style={{ background: habit.color || "#FFFDF7" }}>
            <div className="habit-card-header-row">
              <div className="habit-card-title">{habit.name}</div>
              <div className="habit-card-actions">
                <span
                  className="habit-card-icon"
                  role="button"
                  tabIndex={0}
                  title="Edit"
                  aria-label={`Edit ${habit.name}`}
                  onClick={() => onEdit(habit.id)}
                >
                  ✏️
                </span>
                <span
                  className="habit-card-icon"
                  role="button"
                  tabIndex={0}
                  title="Delete"
                  aria-label={`Delete ${habit.name}`}
                  onClick={() => onDelete(habit.id)}
                >
                  🗑️
                </span>
              </div>
            </div>
            <div className="habit-card-row habit-card-detail-row">
              <span className="habit-card-frequency">{habit.frequency}</span>
              <span className="habit-card-streak" title="Current streak">
                🔥 {habit.streak} days
              </span>
            </div>
            {/* Progress Bar Section */}
            <ProgressBar value={progress} max={goal} label={label} />
            <label className="habit-card-checkbox-row">
              <input
                type="checkbox"
                checked={isHabitDoneToday(habit)}
                onChange={() => onToggleDone(habit.id)}
              />
              <span className="checkmark" />
              Done for Today
            </label>
          </div>
        );
      })}
    </div>
  );
}

export default HabitsList;
