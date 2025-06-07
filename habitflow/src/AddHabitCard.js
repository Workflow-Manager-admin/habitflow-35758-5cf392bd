import React, { useState } from 'react';

// PUBLIC_INTERFACE
/**
 * AddHabitCard component for creating new habits.
 * Includes fields: Habit Name, Frequency (Daily/Weekly/Monthly), Start Date, Add Habit button.
 * Modern, pastel, rounded, minimalist design matching StreakFlow aesthetics.
 *
 * Props:
 *   onAddHabit({ name, frequency, startDate }): function called with new habit details
 */
function AddHabitCard({ onAddHabit }) {
  const [habitName, setHabitName] = useState('');
  const [frequency, setFrequency] = useState('Daily');
  const [startDate, setStartDate] = useState(() => {
    // Default to today in yyyy-mm-dd for HTML input
    const d = new Date();
    return d.toISOString().slice(0, 10);
  });
  const [error, setError] = useState(null);

  // PUBLIC_INTERFACE
  function handleAdd(e) {
    e.preventDefault();
    if (!habitName.trim()) {
      setError('Please enter a habit name.');
      return;
    }
    setError(null);
    onAddHabit({
      name: habitName.trim(),
      frequency,
      startDate
    });
    setHabitName('');
    setFrequency('Daily');
    setStartDate(new Date().toISOString().slice(0, 10));
  }

  return (
    <div
      className="add-habit-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        margin: '0 auto',
        zIndex: 100,
      }}
    >
      <h2
        style={{
          margin: '0 0 16px 0',
          color: '#323149',
          fontWeight: 700,
          fontSize: 26,
          letterSpacing: '-0.6px'
        }}
      >
        Add New Habit
      </h2>
      <form
        onSubmit={handleAdd}
        style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: "20px" }}
        autoComplete="off"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <label htmlFor="habit-name" style={{ fontWeight: 600, color: '#556080', marginBottom: 2 }}>
            Habit Name
          </label>
          <input
            id="habit-name"
            type="text"
            value={habitName}
            autoFocus
            placeholder='e.g. Drink Water'
            onChange={e => setHabitName(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <label htmlFor="habit-frequency" style={{ fontWeight: 600, color: '#556080', marginBottom: 2 }}>
            Frequency
          </label>
          <select
            id="habit-frequency"
            value={frequency}
            onChange={e => setFrequency(e.target.value)}
          >
            <option>Daily</option>
            <option>Weekly</option>
            <option>Monthly</option>
          </select>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <label htmlFor="habit-date" style={{ fontWeight: 600, color: '#556080', marginBottom: 2 }}>
            Start Date
          </label>
          <input
            id="habit-date"
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            max={new Date().toISOString().slice(0, 10)}
          />
        </div>
        {error && (
          <div style={{ color: '#cf3535', fontSize: 15, marginTop: 3, fontWeight: 500 }}>{error}</div>
        )}
        <button
          type="submit"
          className="btn btn-large"
          style={{
            fontWeight: 700,
            letterSpacing: '0.03em',
            fontSize: 17,
            marginTop: 10
          }}
        >
          🎉 Add Habit
        </button>
      </form>
    </div>
  );
}

export default AddHabitCard;
