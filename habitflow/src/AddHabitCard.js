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
        background: 'linear-gradient(110deg, #E3E1FF 80%, #BEE3DB 100%)',
        borderRadius: 21,
        boxShadow: '0 6px 28px rgba(90,100,130,0.13)',
        minWidth: 320,
        maxWidth: 410,
        width: '100%',
        padding: '46px 38px 32px 38px',
        margin: '0 auto',
        marginTop: 44,
        marginBottom: 32,
        zIndex: 100,
        transition: 'box-shadow 0.17s',
      }}
    >
      <h2
        style={{
          margin: '0 0 16px 0',
          color: '#393652',
          fontWeight: 700,
          fontSize: 26,
          letterSpacing: '-0.6px'
        }}
      >
        Add New Habit
      </h2>
      <form
        onSubmit={handleAdd}
        style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 19 }}
        autoComplete="off"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label htmlFor="habit-name" style={{ fontWeight: 500, color: '#6680b8', marginBottom: 2 }}>
            Habit Name
          </label>
          <input
            id="habit-name"
            type="text"
            value={habitName}
            autoFocus
            placeholder='e.g. Drink Water'
            onChange={e => setHabitName(e.target.value)}
            style={{
              border: '1.5px solid #bccae9',
              borderRadius: 8,
              padding: '12px 14px',
              fontSize: 15,
              background: '#f7f9fb',
              color: '#174c3d',
              marginBottom: 0,
            }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label htmlFor="habit-frequency" style={{ fontWeight: 500, color: '#6680b8', marginBottom: 2 }}>
            Frequency
          </label>
          <select
            id="habit-frequency"
            value={frequency}
            onChange={e => setFrequency(e.target.value)}
            style={{
              border: '1.5px solid #e9cbbb',
              borderRadius: 8,
              padding: '11px 10px',
              fontSize: 15,
              background: '#fffbea',
              color: '#5d5431',
              fontWeight: 500,
            }}
          >
            <option>Daily</option>
            <option>Weekly</option>
            <option>Monthly</option>
          </select>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label htmlFor="habit-date" style={{ fontWeight: 500, color: '#6680b8', marginBottom: 2 }}>
            Start Date
          </label>
          <input
            id="habit-date"
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            style={{
              border: '1.5px solid #bad6e9',
              borderRadius: 8,
              padding: '10px 10px',
              fontSize: 15,
              background: '#eafcff',
              color: '#274b5e'
            }}
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
            background: 'linear-gradient(90deg, #FFD6E0 20%, #FCF5C7 60%, #BEE3DB 100%)',
            color: '#42495c',
            fontWeight: 700,
            borderRadius: 17,
            letterSpacing: '0.03em',
            fontSize: 17,
            marginTop: 10,
            boxShadow: '0 1.5px 12px rgba(230,150,150,0.07)'
          }}
        >
          🎉 Add Habit
        </button>
      </form>
    </div>
  );
}

export default AddHabitCard;
