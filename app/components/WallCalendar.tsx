"use client";

import { useState, useCallback } from "react";
import styles from "./WallCalendar.module.css";

const MONTH_IMAGES: Record<number, { url: string; alt: string; palette: string[] }> = {
  0:  { url: "https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=800&q=80", alt: "Winter snow", palette: ["#b8d4e8", "#2c4a6e", "#e8f0f7"] },
  1:  { url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80", alt: "February frost", palette: ["#d4e8c2", "#3a5c2a", "#f0f7ea"] },
  2:  { url: "https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=800&q=80", alt: "Spring bloom", palette: ["#f7c5d5", "#8b2252", "#fdf0f4"] },
  3:  { url: "https://images.unsplash.com/photo-1522748906645-95d8adfd52c7?w=800&q=80", alt: "April showers", palette: ["#c5d5e8", "#1a3a5c", "#f0f4f8"] },
  4:  { url: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&q=80", alt: "May flowers", palette: ["#e8d4c5", "#6e3a1a", "#f8f0ea"] },
  5:  { url: "https://images.unsplash.com/photo-1473496169904-658ba7574b0d?w=800&q=80", alt: "Summer sky", palette: ["#c5e8d4", "#1a5c3a", "#eaf8f0"] },
  6:  { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80", alt: "Beach summer", palette: ["#f7e4b5", "#8b6000", "#fdf7e8"] },
  7:  { url: "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=800&q=80", alt: "Late summer", palette: ["#e8c5b5", "#6e2a0a", "#f8f0ea"] },
  8:  { url: "https://images.unsplash.com/photo-1507090960745-b32f65d3113a?w=800&q=80", alt: "Autumn leaves", palette: ["#e8d5b0", "#7a4a00", "#fdf5e6"] },
  9:  { url: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=800&q=80", alt: "October woods", palette: ["#d4b896", "#5c3a1a", "#f7f0e8"] },
  10: { url: "https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?w=800&q=80", alt: "November mist", palette: ["#c8c8d4", "#3a3a5c", "#f0f0f8"] },
  11: { url: "https://images.unsplash.com/photo-1544085311-11a028465b03?w=800&q=80", alt: "December winter", palette: ["#c5d5e8", "#1a2c5c", "#f0f4f8"] },
};

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAY_NAMES = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

const HOLIDAYS: Record<string, string> = {
  "1-1": "New Year's Day",
  "1-15": "MLK Day",
  "2-14": "Valentine's Day",
  "3-17": "St. Patrick's Day",
  "7-4": "Independence Day",
  "10-31": "Halloween",
  "11-11": "Veterans Day",
  "12-25": "Christmas",
  "12-31": "New Year's Eve",
};

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function dateKey(year: number, month: number, day: number) {
  return `${year}-${month + 1}-${day}`;
}

function holidayKey(month: number, day: number) {
  return `${month + 1}-${day}`;
}

interface Note {
  id: string;
  text: string;
  startDate: string;
  endDate: string;
  color: string;
}

const NOTE_COLORS = ["#e8a87c", "#85c1a3", "#7eabd4", "#c49bbf", "#e8d07a", "#a3b8e0"];

export default function WallCalendar() {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [hoverDate, setHoverDate] = useState<string | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteText, setNoteText] = useState("");
  const [selectedNoteColor, setSelectedNoteColor] = useState(NOTE_COLORS[0]);
  const [isSelectingEnd, setIsSelectingEnd] = useState(false);
  const [flipping, setFlipping] = useState(false);
  const [flipDir, setFlipDir] = useState<"next" | "prev">("next");

  const monthData = MONTH_IMAGES[viewMonth];
  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const navigateMonth = useCallback((dir: "next" | "prev") => {
    if (flipping) return;
    setFlipDir(dir);
    setFlipping(true);
    setTimeout(() => {
      setViewMonth(m => {
        const next = dir === "next" ? m + 1 : m - 1;
        if (next > 11) { setViewYear(y => y + 1); return 0; }
        if (next < 0)  { setViewYear(y => y - 1); return 11; }
        return next;
      });
      setFlipping(false);
    }, 350);
  }, [flipping]);

  const handleDayClick = (day: number) => {
    const key = dateKey(viewYear, viewMonth, day);
    if (!startDate || (startDate && endDate)) {
      setStartDate(key);
      setEndDate(null);
      setIsSelectingEnd(true);
    } else {
      if (key < startDate) {
        setEndDate(startDate);
        setStartDate(key);
      } else {
        setEndDate(key);
      }
      setIsSelectingEnd(false);
    }
  };

  const isInRange = (key: string) => {
    const s = startDate;
    const e = endDate || (isSelectingEnd ? hoverDate : null);
    if (!s || !e) return false;
    const lo = s < e ? s : e;
    const hi = s < e ? e : s;
    return key > lo && key < hi;
  };

  const isStart = (key: string) => key === startDate;
  const isEnd   = (key: string) => key === endDate;
  const isToday = (day: number) =>
    today.getFullYear() === viewYear &&
    today.getMonth() === viewMonth &&
    today.getDate() === day;

  const addNote = () => {
    if (!noteText.trim() || !startDate) return;
    const note: Note = {
      id: Date.now().toString(),
      text: noteText.trim(),
      startDate: startDate,
      endDate: endDate || startDate,
      color: selectedNoteColor,
    };
    setNotes(n => [...n, note]);
    setNoteText("");
  };

  const removeNote = (id: string) => setNotes(n => n.filter(note => note.id !== id));

  const formatDateDisplay = (key: string) => {
    const [y, m, d] = key.split("-").map(Number);
    return `${MONTH_NAMES[m-1].slice(0,3)} ${d}, ${y}`;
  };

  const [accent, bg] = [monthData.palette[1], monthData.palette[2]];

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className={styles.root} style={{ "--accent": accent, "--bg": bg } as React.CSSProperties}>
      {/* Header strip */}
      <div className={styles.headerStrip}>
        <div className={styles.holes}><span/><span/><span/></div>
        <p className={styles.brandText}>WALL PLANNER</p>
      </div>

      <div className={styles.calendarBody}>
        {/* Left: Hero image + month nav */}
        <div className={styles.heroPanel}>
          <div className={`${styles.imageWrapper} ${flipping ? styles[`flip_${flipDir}`] : ""}`}>
            <img
              src={monthData.url}
              alt={monthData.alt}
              className={styles.heroImage}
            />
            <div className={styles.imageOverlay} />
            <div className={styles.monthLabel}>
              <span className={styles.monthName}>{MONTH_NAMES[viewMonth]}</span>
              <span className={styles.yearText}>{viewYear}</span>
            </div>
          </div>

          <div className={styles.navRow}>
            <button className={styles.navBtn} onClick={() => navigateMonth("prev")} aria-label="Previous month">
              ‹
            </button>
            <button className={styles.todayBtn} onClick={() => { setViewYear(today.getFullYear()); setViewMonth(today.getMonth()); }}>
              Today
            </button>
            <button className={styles.navBtn} onClick={() => navigateMonth("next")} aria-label="Next month">
              ›
            </button>
          </div>

          {/* Range summary */}
          {startDate && (
            <div className={styles.rangeSummary} style={{ borderLeft: `4px solid ${accent}` }}>
              <p className={styles.rangeLabel}>Selected Range</p>
              <p className={styles.rangeDate}>{formatDateDisplay(startDate)}</p>
              {endDate && endDate !== startDate && (
                <>
                  <p className={styles.rangeSep}>→</p>
                  <p className={styles.rangeDate}>{formatDateDisplay(endDate)}</p>
                </>
              )}
              {isSelectingEnd && !endDate && (
                <p className={styles.rangeHint}>Click an end date…</p>
              )}
              <button className={styles.clearBtn} onClick={() => { setStartDate(null); setEndDate(null); setIsSelectingEnd(false); }}>
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Right: Grid + Notes */}
        <div className={styles.rightPanel}>
          {/* Day headers */}
          <div className={styles.dayHeaders}>
            {DAY_NAMES.map(d => (
              <div key={d} className={styles.dayHeader}>{d}</div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className={`${styles.grid} ${flipping ? styles[`flip_${flipDir}`] : ""}`}>
            {cells.map((day, i) => {
              if (day === null) return <div key={`empty-${i}`} className={styles.emptyCell} />;
              const key = dateKey(viewYear, viewMonth, day);
              const holiday = HOLIDAYS[holidayKey(viewMonth, day)];
              const inRange = isInRange(key);
              const isS = isStart(key);
              const isE = isEnd(key);
              const tod = isToday(day);

              return (
                <div
                  key={key}
                  className={`${styles.dayCell}
                    ${isS ? styles.startDay : ""}
                    ${isE ? styles.endDay : ""}
                    ${inRange ? styles.inRange : ""}
                    ${tod ? styles.today : ""}
                    ${holiday ? styles.holiday : ""}
                  `}
                  onClick={() => handleDayClick(day)}
                  onMouseEnter={() => setHoverDate(key)}
                  onMouseLeave={() => setHoverDate(null)}
                  title={holiday || undefined}
                >
                  <span className={styles.dayNum}>{day}</span>
                  {holiday && <span className={styles.holidayDot} />}
                  {tod && <span className={styles.todayRing} />}
                </div>
              );
            })}
          </div>

          {/* Notes section */}
          <div className={styles.notesSection}>
            <div className={styles.notesSectionHeader}>
              <span className={styles.notesPencilIcon}>✏</span>
              <span className={styles.notesTitle}>Notes</span>
              {!startDate && <span className={styles.notesHint}>Select a date first</span>}
            </div>

            {startDate && (
              <div className={styles.noteInput}>
                <textarea
                  className={styles.noteTextarea}
                  placeholder={`Note for ${formatDateDisplay(startDate)}${endDate && endDate !== startDate ? " → " + formatDateDisplay(endDate) : ""}…`}
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); addNote(); }}}
                  rows={2}
                />
                <div className={styles.noteActions}>
                  <div className={styles.colorPicker}>
                    {NOTE_COLORS.map(c => (
                      <button
                        key={c}
                        className={`${styles.colorDot} ${selectedNoteColor === c ? styles.colorDotActive : ""}`}
                        style={{ background: c }}
                        onClick={() => setSelectedNoteColor(c)}
                        aria-label={`Note color ${c}`}
                      />
                    ))}
                  </div>
                  <button className={styles.addNoteBtn} onClick={addNote} style={{ background: accent }}>
                    + Add
                  </button>
                </div>
              </div>
            )}

            <div className={styles.notesList}>
              {notes.length === 0 && (
                <p className={styles.emptyNotes}>No notes yet. Select a date range and add one!</p>
              )}
              {notes.map(note => (
                <div key={note.id} className={styles.noteCard} style={{ borderLeft: `4px solid ${note.color}`, background: note.color + "22" }}>
                  <div className={styles.noteCardHeader}>
                    <span className={styles.noteDateRange}>
                      {formatDateDisplay(note.startDate)}
                      {note.endDate !== note.startDate ? ` → ${formatDateDisplay(note.endDate)}` : ""}
                    </span>
                    <button className={styles.removeNote} onClick={() => removeNote(note.id)}>×</button>
                  </div>
                  <p className={styles.noteCardText}>{note.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className={styles.legend}>
        <span className={styles.legendItem}><span className={styles.legendDot} style={{background: accent}} /> Selected</span>
        <span className={styles.legendItem}><span className={styles.legendDot} style={{background: "#ff6b6b"}} /> Today</span>
        <span className={styles.legendItem}><span className={styles.legendDot} style={{background: "#888"}} /> Holiday</span>
      </div>
    </div>
  );
}
