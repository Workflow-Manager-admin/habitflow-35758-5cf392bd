import React, { useState } from 'react';
import './App.css';

// Util to get days in current month for calendar rendering
function getDaysInMonth(month, year) {
  const numDays = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: numDays }, (_, i) => i + 1);
}

// PUBLIC_INTERFACE
function App() {
  // Main habits state. Each habit: {id, name, color, streak, calendar: {YYYY-MM: [days completed]}}
  const [habits, setHabits] = useState([]);
  const [showAdd, setShowAdd] = useState(false);

  // Add new habit handler
  // PUBLIC_INTERFACE
  function addHabit(habitName) {
    if (!habitName.trim()) return;
    const colorOptions = [
      '#FFD6E0', '#BEE3DB', '#FFDFBA', '#D4E4FF', '#FFFACD', '#CCF2FF',
      '#E3E1FF', '#FFF0F5', '#FCF5C7'
    ];
    const color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
    const today = new Date();
    const ym = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}`;
    setHabits([
      ...habits,
      {
        id: Math.random().toString(36).substr(2, 9),
        name: habitName,
        color: color,
        streak: 0,
        calendar: { [ym]: [] }
      }
    ]);
  }

  // Toggle complete for a day in the current month (for calendar click or today shortcut)
  // PUBLIC_INTERFACE
  function toggleHabitDay(habitId, day) {
    const today = new Date();
    const ym = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}`;
    setHabits(habits =>
      habits.map(habit => {
        if (habit.id !== habitId) return habit;
        const currDaysDone = habit.calendar[ym] || [];
        let updatedDays;
        if (currDaysDone.includes(day)) {
          updatedDays = currDaysDone.filter(d => d !== day);
        } else {
          updatedDays = [...currDaysDone, day];
        }
        // Compute streak (consecutive up to today in month)
        let streak = 0;
        for (let i = today.getDate(); i > 0; i--) {
          if (updatedDays.includes(i)) {
            streak += 1;
          } else break;
        }
        return {
          ...habit,
          streak,
          calendar: { 
            ...habit.calendar,
            [ym]: updatedDays
          }
        };
      })
    );
  }

  // Card for habit, including name, streak, and inline calendar (current month)
  function HabitCard({ habit, onDayClick }) {
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();
    const days = getDaysInMonth(month, year);
    const ym = `${year}-${(month + 1).toString().padStart(2, '0')}`;
    const daysDone = habit.calendar[ym] || [];

    return (
      <div
        className="habit-card"
        style={{
          background: habit.color,
          borderRadius: 18,
          boxShadow: '0 4px 16px rgba(90,100,130,0.10)',
          padding: 28,
          marginBottom: 24,
          minWidth: 280,
          maxWidth: 380,
          width: '100%',
          transition: 'box-shadow 0.2s',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <div style={{ fontSize: 20, fontWeight: 600 }}>{habit.name}</div>
          <span
            className="habit-streak"
            style={{
              background: '#ffe195',
              color: '#b48800',
              borderRadius: 8,
              padding: '3px 13px',
              fontWeight: 500,
              fontSize: 14,
              boxShadow: '0 1px 6px rgba(255,225,149,0.18)'
            }}
            title="Current Streak"
          >🔥 {habit.streak}</span>
        </div>
        {/* Complete today button */}
        <button
          className="btn btn-small"
          style={{
            margin: '6px 0 10px 0',
            background: '#90e1d4',
            color: '#2e806e',
            fontWeight: 600,
            borderRadius: 6,
            fontSize: '0.98rem',
            boxShadow: '0 1px 4px rgba(144,225,212,0.13)',
          }}
          onClick={() => onDayClick(habit.id, today.getDate())}
        >
          {daysDone.includes(today.getDate()) ? 'Unmark Today' : 'Mark Today Complete'}
        </button>
        {/* Calendar display */}
        <div className="calendar-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 4,
          marginTop: 12,
        }}>
          {days.map(day => {
            const isToday = day === today.getDate();
            const done = daysDone.includes(day);
            return (
              <div
                key={day}
                title={isToday ? 'Today' : undefined}
                onClick={() => onDayClick(habit.id, day)}
                style={{
                  width: 28,
                  height: 28,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  background: done
                    ? '#bfe8cc'
                    : isToday
                      ? '#ffe7e0'
                      : 'rgba(255,255,255,.32)',
                  color: done ? '#316940' : '#4d495f',
                  fontWeight: isToday ? 700 : 500,
                  border: isToday ? '2px solid #FFA4BA' : 'none',
                  transition: 'background 0.15s, border 0.15s',
                }}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Add Habit Modal/Overlay
  function AddHabitModal({ onClose, onSubmit }) {
    const [value, setValue] = useState('');
    return (
      <div className="modal-bg" style={{
        position: 'fixed',
        zIndex: 201,
        left: 0, top: 0, right: 0, bottom: 0,
        background: 'rgba(80,120,150,0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: '#fff',
          borderRadius: 15,
          boxShadow: '0 8px 36px rgba(60,90,140,0.20)',
          padding: 38,
          minWidth: 320,
          maxWidth: 95,
        }}>
          <h2 style={{margin: 0, marginBottom: 18, fontWeight: 600, color: '#5775e7'}}>New Habit</h2>
          <form 
            style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
            onSubmit={e => {
              e.preventDefault();
              if (value.trim()) { onSubmit(value); onClose(); }
            }}
          >
            <input
              autoFocus
              value={value}
              placeholder="Enter habit name (e.g. Drink Water)"
              onChange={e => setValue(e.target.value)}
              style={{
                borderRadius: 8,
                padding: '11px 12px',
                border: '1px solid #bccae9',
                fontSize: 15,
                background: '#f7f9fb'
              }}
            />
            <div style={{display: 'flex', gap: 12, marginTop: 4}}>
              <button
                type="submit"
                className="btn"
                style={{
                  background: 'linear-gradient(90deg, #BEE3DB 40%, #D4E4FF 100%)',
                  color: "#523636",
                  borderRadius: 6,
                  fontWeight: 600,
                  minWidth: 86
                }}
              >
                Add Habit
              </button>
              <button type="button" className="btn" 
                style={{
                  background: "#ffe4e1",
                  color: "#c14f4f",
                  borderRadius: 7,
                  minWidth: 86
                }}
                onClick={onClose}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Dashboard layout & habit cards rendered here
  return (
    <div className="app" style={{ background: "linear-gradient(105deg,#e6f7ff 0%,#fff7e6 70%)" }}>
      <nav className="navbar" style={{ background: "rgba(255,255,255,0.88)", boxShadow: '0 1.5px 6px rgba(60,60,120,0.06)' }}>
        <div className="container" style={{ maxWidth: "990px" }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: "center" }}>
            <div className="logo" style={{ color:"#69b5c0" }}>
              <span className="logo-symbol" style={{ fontWeight: 700, fontSize: 23, color: "#FFC0CB", marginRight:4 }}>✦</span> <span style={{fontWeight:600}}>StreakFlow</span>
            </div>
            <button
              className="btn"
              style={{
                background: "linear-gradient(90deg,#ffd6e0 45%,#D4E4FF 100%)",
                color: "#393652",
                borderRadius: 14,
                fontWeight: 600,
                fontSize: "1rem",
                boxShadow: '0 .5px 3px rgba(110,180,170,0.11)'
              }}
              onClick={() => setShowAdd(true)}
            >+ Add Habit</button>
          </div>
        </div>
      </nav>
      <main>
        <div className="container" style={{
          minHeight: "100vh",
          paddingTop: 90,
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}>
          <div style={{ width: "100%" }}>
            {/* Summary bar */}
            <div style={{
              display: "flex",
              justifyContent: "center",
              gap: 30,
              margin: "0 auto 38px auto",
              background: "linear-gradient(90deg,#ccf2ff 10%,#FFF0F5 90%)",
              padding: "18px 36px",
              borderRadius: 18,
              boxShadow: "0 1px 8px rgba(160,180,210,0.12)",
              maxWidth: 670,
            }}>
              <div style={{ fontWeight: 600, fontSize: 19, color: "#67a897" }}>
                Habits: <span style={{ color: '#174c23', fontWeight: 700 }}>{habits.length}</span>
              </div>
              <div style={{ fontWeight: 500, fontSize: 16, color: "#7799c4" }}>
                {habits.length === 0 ? "Add your first habit!" :
                  `Active Streaks: ${habits.reduce((acc, h) => acc + (h.streak > 0 ? 1 : 0), 0)}`}
              </div>
            </div>
            {/* Habit cards grid */}
            <div
              className="habits-grid"
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "2.3vw"
              }}>
              {habits.map(habit => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onDayClick={toggleHabitDay}
                />
              ))}
            </div>
            {/* Empty state */}
            {habits.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  marginTop: 44,
                  fontSize: "1.36rem",
                  color: "#9CAACB"
                }}
              >
                Add a new habit to begin tracking your streaks! <br />
                <span role="img" aria-label="habit tip">🌱</span>
              </div>
            )}
          </div>
          {/* FAB for adding habit if habits exist */}
          {habits.length > 0 && (
            <button
              className="btn"
              aria-label="Add new habit"
              style={{
                position: "fixed",
                bottom: 34,
                right: "7vw",
                padding: "15px 25px",
                zIndex: 120,
                background: 'linear-gradient(90deg,#FFFACD 40%, #FFC0CB 100%)',
                color: "#7d5641",
                borderRadius: 99,
                boxShadow: "0 3px 18px rgba(255,227,187,0.19)",
                fontWeight: 700,
                fontSize: 21,
                fontFamily: "inherit"
              }}
              onClick={() => setShowAdd(true)}
            >＋</button>
          )}
        </div>
      </main>
      {/* Modal Overlay */}
      {showAdd && (
        <AddHabitModal
          onSubmit={addHabit}
          onClose={() => setShowAdd(false)}
        />
      )}
    </div>
  );
}

export default App;