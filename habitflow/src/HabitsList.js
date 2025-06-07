import React from "react";

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

  return (
    <div className="habits-list-grid">
      {habits.map((habit) => (
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
      ))}
    </div>
  );
}

export default HabitsList;
