import React from "react";

// PUBLIC_INTERFACE
/**
 * CalendarSection component: Shows a month-view calendar for a given habit,
 * marking each day's completion status and streak highlights.
 *
 * Props:
 *   month: integer [0-11] (zero-indexed JS month)
 *   year: integer (YYYY)
 *   daysDone: array of completed day numbers (e.g., [1,3,4,7])
 *   streakMap: object mapping day numbers to streak states
 *      (e.g. { 1: "good", 2: "missed", 3: "good" })
 *      Possible values: "good" (ongoing streak), "missed" (break), undefined
 *   title: optional string (e.g. Habit name)
 *   habitColor: string (for subtle accent, e.g., "#FFDFBA")
 *   habitId: key for the calendar
 */
function CalendarSection({
  month,
  year,
  daysDone,
  streakMap = {},
  title,
  habitColor = "#F7F7FA",
  habitId,
}) {
  // Util to get first day of week for month (0 = Sunday, ..., 6 = Saturday)
  const firstDay = new Date(year, month, 1).getDay();
  const numDays = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: numDays }, (_, i) => i + 1);
  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

  // Render grid with week day headers & padded empty cells
  // Notes: Soft pastels, rounded, neutral days; green/red highlight per streakMap, checkmark if complete
  return (
    <div
      className="calendar-section"
      style={{
        background: "linear-gradient(110deg,#fffafb 60%,#e3e1ff 100%)",
        borderRadius: 18,
        boxShadow: "0 4px 18px 0 rgba(180,180,200,0.08)",
        padding: "30px 24px 13px 24px",
        margin: "0 auto",
        marginBottom: 38,
        minWidth: 260,
        maxWidth: 530,
        width: "100%",
        fontFamily: "inherit",
      }}
    >
      {title && (
        <div
          style={{
            marginBottom: 11,
            fontWeight: 700,
            fontSize: 21,
            color: "#44365a",
            letterSpacing: "-0.02em",
          }}
        >
          <span
            style={{
              display: "inline-block",
              borderRadius: 7,
              padding: "2px 7px 3px 6px",
              background: habitColor,
              marginRight: 7,
              verticalAlign: "middle",
            }}
          >
            {title}
          </span>
          <span style={{ fontWeight: 400, fontSize: 16, color: "#9e98b6" }}>
            {" "}
            · {year}-{String(month + 1).padStart(2, "0")}
          </span>
        </div>
      )}
      {/* Weekday Row */}
      <div
        className="calendar-grid calendar-section-weekdays"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 4,
          marginBottom: 7,
          fontWeight: 600,
          color: "#cad3e2",
          fontSize: 14,
        }}
      >
        {weekDays.map((wd, i) => (
          <div key={i} style={{ textAlign: "center", letterSpacing: "0.01em" }}>
            {wd}
          </div>
        ))}
      </div>
      {/* DAY GRID */}
      <div
        className="calendar-grid calendar-section-days"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 6,
        }}
      >
        {/* Empty cells before first day */}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`}></div>
        ))}
        {/* Days of month */}
        {days.map((day) => {
          const isToday =
            day === new Date().getDate() &&
            month === new Date().getMonth() &&
            year === new Date().getFullYear();

          const isDone = daysDone.includes(day);
          const streakType = streakMap[day]; // "good" | "missed" | undefined

          // Determine background and highlight based on streak & completion
          let bg = "#fcfcfd";
          let border = "1.5px solid #edefff";
          let color = "#44455a";
          let acc = {};

          if (streakType === "good") {
            bg = "linear-gradient(90deg,#b5ffd5 10%,#b0f6eb 90%)";
            color = "#26868a";
            border = "2px solid #73d995";
            acc = {
              boxShadow: "0 2.5px 11px rgba(40,200,140,0.09)",
              fontWeight: 700,
            };
          }
          if (streakType === "missed") {
            bg = "linear-gradient(90deg,#ffd0d9 10%,#ffe6e2 95%)";
            color = "#cf3838";
            border = "2px solid #fa8d92";
            acc = {
              boxShadow: "0 2.5px 11px rgba(222,80,80,0.08)",
              fontWeight: 700,
            };
          }
          if (!streakType && isDone) {
            bg = "linear-gradient(90deg,#e9faf2 60%,#d9fbe7 100%)";
            border = "2px solid #ace1c9";
            color = "#156c39";
            acc = {
              fontWeight: 700,
            };
          }
          if (isToday) {
            acc.boxShadow =
              "0 2px 13px 0 rgba(217,146,255,0.13),0 0 0 2px #bbaaff";
          }

          return (
            <div
              key={day}
              className="calendar-section-day"
              style={{
                width: 36,
                height: 36,
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 15,
                position: "relative",
                border: border,
                background: bg,
                color: color,
                textAlign: "center",
                cursor: "default",
                transition: "box-shadow 0.14s, border 0.17s, background 0.17s",
                ...acc,
              }}
              title={
                isDone
                  ? streakType === "good"
                    ? "Completed (Streak!)"
                    : streakType === "missed"
                    ? "Missed (Streak Broken)"
                    : "Completed"
                  : streakType === "missed"
                  ? "Missed"
                  : ""
              }
              aria-label={
                isDone
                  ? "Completed"
                  : streakType === "good"
                  ? "Good Streak"
                  : streakType === "missed"
                  ? "Missed"
                  : `Day ${day}`
              }
              data-current-day={isToday ? "true" : undefined}
            >
              {day}
              {isDone && (
                <span
                  style={{
                    position: "absolute",
                    right: 2,
                    bottom: 2,
                    fontSize: 15,
                    color:
                      streakType === "missed"
                        ? "#cb2222"
                        : streakType === "good"
                        ? "#16a96d"
                        : "#269a4f",
                    pointerEvents: "none",
                    opacity: 0.92,
                  }}
                  aria-hidden="true"
                >
                  ✓
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CalendarSection;
