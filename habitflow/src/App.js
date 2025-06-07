import React, { useState } from 'react';
import './App.css';
import AddHabitCard from './AddHabitCard';
import HabitsList from './HabitsList';
import CalendarSection from './CalendarSection';

// PUBLIC_INTERFACE
function Navbar() {
  // The top navigation bar for the app.
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-left">
          <span className="navbar-app-emoji" role="img" aria-label="chart">📈</span>
          <span className="navbar-app-name">StreakFlow</span>
        </div>
        <div className="navbar-right">
          <span className="navbar-profile-icon" title="Profile" role="img" aria-label="profile">
            👤
          </span>
        </div>
      </div>
    </nav>
  );
}

// Util to get days in current month for calendar rendering
function getDaysInMonth(month, year) {
  const numDays = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: numDays }, (_, i) => i + 1);
}

// PUBLIC_INTERFACE
function App() {
  // Main habits state. Each habit: {id, name, frequency, startDate, color, streak, calendar: {YYYY-MM: [days completed]}}
  const [habits, setHabits] = useState([]);
  const [showAdd, setShowAdd] = useState(false); // for old modal-based add
  const [showCardAdd, setShowCardAdd] = useState(true); // display AddHabitCard by default when no habits

  // PUBLIC_INTERFACE
  function addHabitFull({ name, frequency, startDate }) {
    // Pick color
    const colorOptions = [
      '#FFD6E0', '#BEE3DB', '#FFDFBA', '#D4E4FF', '#FFFACD', '#CCF2FF',
      '#E3E1FF', '#FFF0F5', '#FCF5C7'
    ];
    const color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
    // Start date, fallback if missing
    const dateObj = startDate ? new Date(startDate) : new Date();
    const ym = `${dateObj.getFullYear()}-${(dateObj.getMonth() + 1).toString().padStart(2, '0')}`;

    setHabits([
      ...habits,
      {
        id: Math.random().toString(36).substr(2, 9),
        name,
        frequency,
        startDate,
        color: color,
        streak: 0,
        calendar: { [ym]: [] }
      }
    ]);
    setShowCardAdd(false);
  }

  // DEPRECATED: old handler, kept for modal/fab add.
  // PUBLIC_INTERFACE
  function addHabit(habitName) {
    addHabitFull({ name: habitName, frequency: "Daily", startDate: new Date().toISOString().slice(0, 10) });
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
      <Navbar />
      <main>
        <div className="container" style={{
          minHeight: "100vh",
          paddingTop: 90,
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}>
          {/* If no habits, center the AddHabitCard on dashboard */}
          {habits.length === 0 && (
            <div style={{
              width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
            }}>
              <AddHabitCard onAddHabit={addHabitFull} />
            </div>
          )}

          {/* If there are habits, show summary, cards, FAB */}
          {habits.length > 0 && (
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
                  {`Active Streaks: ${habits.reduce((acc, h) => acc + (h.streak > 0 ? 1 : 0), 0)}`}
                </div>
              </div>

              {/* Add Habit Card sits at top for adding new habit when habits exist */}
              <div style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                marginBottom: "18px"
              }}>
                <button
                  className="btn btn-large"
                  aria-label="Add new habit"
                  style={{
                    background: 'linear-gradient(90deg,#BEE3DB 30%, #D4E4FF 100%)',
                    color: "#7d5641",
                    borderRadius: 18,
                    boxShadow: "0 2.5px 14px rgba(130,170,200,0.11)",
                    fontWeight: 700,
                    fontSize: 18,
                  }}
                  onClick={() => setShowCardAdd(true)}
                >
                  ＋ Add New Habit
                </button>
              </div>

              {/* Habits grid list, cards */}
              <HabitsList
                habits={habits}
                onToggleDone={habitId => {
                  // Toggle for today
                  const today = new Date();
                  toggleHabitDay(habitId, today.getDate());
                }}
                onEdit={habitId => {
                  // To be implemented: open edit modal
                  alert("Edit functionality coming soon for habit: " + habits.find(h => h.id === habitId)?.name);
                }}
                onDelete={habitId => {
                  if (window.confirm("Delete this habit?")) {
                    setHabits(habits.filter(h => h.id !== habitId));
                  }
                }}
              />
              {/* CALENDAR SECTION: visual month-view, one per habit */}
              <div style={{ width: "100%", marginTop: 10 }}>
                {habits.map(habit => {
                  const today = new Date();
                  const month = today.getMonth();
                  const year = today.getFullYear();
                  const ym = `${year}-${(month + 1).toString().padStart(2, "0")}`;
                  const daysDone = habit.calendar[ym] || [];

                  // Generate streak mapping logic: green for current/ongoing streak, red for missed (broken)
                  const streakMap = {};
                  let inGoodStreak = false;
                  let streakLength = 0;
                  for (let day = 1; day <= today.getDate(); day++) {
                    if (daysDone.includes(day)) {
                      streakLength++;
                      if (!inGoodStreak && day === today.getDate()) {
                        inGoodStreak = true;
                      }
                      if (inGoodStreak) streakMap[day] = "good";
                    } else {
                      if (day < today.getDate()) {
                        streakMap[day] = "missed";
                        inGoodStreak = false;
                        streakLength = 0;
                      } else {
                        // Future days: no highlight
                        break;
                      }
                    }
                  }

                  return (
                    <CalendarSection
                      key={`${habit.id}-calendar`}
                      month={month}
                      year={year}
                      daysDone={daysDone}
                      streakMap={streakMap}
                      title={habit.name}
                      habitColor={habit.color}
                      habitId={habit.id}
                    />
                  );
                })}
              </div>
            </div>
          )}
          {/* Show AddHabitCard as overlay modal if user wants to add more (with habits present) */}
          {habits.length > 0 && showCardAdd && (
            <div
              className="modal-bg"
              style={{
                zIndex: 210,
                background: 'rgba(60,100,160,0.17)',
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onClick={e => {
                // Dismiss modal if clicking background (not card)
                if (e.target.classList.contains("modal-bg")) {
                  setShowCardAdd(false);
                }
              }}
            >
              <AddHabitCard
                onAddHabit={data => {
                  addHabitFull(data);
                  setShowCardAdd(false);
                }}
              />
            </div>
          )}

          {/* Old FAB for quick/historic modal add */}
          {habits.length > 0 && (
            <button
              className="btn"
              aria-label="Add new habit (floating)"
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
      {/* Modal Overlay - legacy modal for FAB */}
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
