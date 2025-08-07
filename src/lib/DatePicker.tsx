"use client";

import React, { useState, useRef, useEffect } from 'react';
import './DatePicker.css';
import arrowLeft from '../../assets/icons/arrowLeft.svg';
import arrowRight from '../../assets/icons/arrowRight.svg';
import dropdownArrow from '../../assets/icons/dropdownArrow.svg';

interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date) => void;
  ageRestriction?: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({ value, onChange, ageRestriction = false }) => {
  const [viewDate, setViewDate] = useState(value || new Date());
  const [isMonthDropdownOpen, setMonthDropdownOpen] = useState(false);
  const [isYearDropdownOpen, setYearDropdownOpen] = useState(false);
  const monthDropdownRef = useRef<HTMLDivElement>(null);
  const yearDropdownRef = useRef<HTMLDivElement>(null);

  const today = new Date();
  const minDate = ageRestriction ? new Date(today.getFullYear() - 100, today.getMonth(), today.getDate()) : null;
  const maxDate = ageRestriction ? new Date(today.getFullYear() - 18, today.getMonth(), today.getDate()) : null;

  useEffect(() => {
    if (value) {
      setViewDate(value);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (monthDropdownRef.current && !monthDropdownRef.current.contains(event.target as Node)) {
        setMonthDropdownOpen(false);
      }
      if (yearDropdownRef.current && !yearDropdownRef.current.contains(event.target as Node)) {
        setYearDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const month = viewDate.getMonth();
  const year = viewDate.getFullYear();

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInPrevMonth = getDaysInMonth(year, month - 1);

  const isPrevMonthDisabled = ageRestriction && minDate && new Date(year, month, 1) <= minDate;
  const isNextMonthDisabled = ageRestriction && maxDate && new Date(year, month, 1) >= maxDate;

  const handlePrevMonth = () => {
    if (isPrevMonthDisabled) return;
    setViewDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    if (isNextMonthDisabled) return;
    setViewDate(new Date(year, month + 1, 1));
  };

  const handleDayClick = (day: number) => {
    onChange(new Date(year, month, day));
  };

  const handleMonthSelect = (newMonth: number) => {
    setViewDate(new Date(year, newMonth, 1));
    setMonthDropdownOpen(false);
  };

  const handleYearSelect = (newYear: number) => {
    setViewDate(new Date(newYear, month, 1));
    setYearDropdownOpen(false);
  };

  const renderYears = () => {
    const years = [];
    const currentYear = new Date().getFullYear();
    const startYear = ageRestriction && minDate ? minDate.getFullYear() : currentYear - 150;
    const endYear = ageRestriction && maxDate ? maxDate.getFullYear() : currentYear;

    for (let i = startYear; i <= endYear; i++) {
      years.push(
        <div key={i} className={`dropdown-option ${i === year ? 'selected' : ''}`} onClick={() => handleYearSelect(i)}>
          {i}
        </div>
      );
    }
    return years.reverse();
  };

  const renderDays = () => {
    const days = [];
    // Previous month's days
    for (let i = firstDayOfMonth; i > 0; i--) {
      days.push(<div key={`prev-${i}`} className="day other-month">{daysInPrevMonth - i + 1}</div>);
    }
    // Current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(year, month, i);
      const isDisabled = ageRestriction && ( (minDate && currentDate < minDate) || (maxDate && currentDate > maxDate) );

      const isSelected = value &&
        value.getDate() === i &&
        value.getMonth() === month &&
        value.getFullYear() === year;
      days.push(<div key={i} className={`day ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`} onClick={() => !isDisabled && handleDayClick(i)}>{i}</div>);
    }

    // Next month's days
    const totalDays = days.length;
    const remainingDays = 42 - totalDays; // 6 rows * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push(<div key={`next-${i}`} className="day other-month">{i}</div>);
    }

    return days;
  };

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="date-picker">
      <div className="header">
        <button onClick={handlePrevMonth} className="nav-arrow left" disabled={!!isPrevMonthDisabled}>
            <img src={arrowLeft} alt="arrow-left" />
        </button>
        <div className="month-year">
          <div className="dropdown" ref={monthDropdownRef}>
            <button className={`dropdown-toggle ${isMonthDropdownOpen ? 'dropdown-open' : ''}`} onClick={() => setMonthDropdownOpen(!isMonthDropdownOpen)}>
              {monthNames[month]}
              <img src={dropdownArrow} alt="arrow-down" />
            </button>
            {isMonthDropdownOpen && (
              <div className="dropdown-panel">
                {monthNames.map((name, index) => (
                  <div key={name} className={`dropdown-option ${index === month ? 'selected' : ''}`} onClick={() => handleMonthSelect(index)}>
                    {name}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="dropdown" ref={yearDropdownRef}>
            <button className={`dropdown-toggle ${isYearDropdownOpen ? 'dropdown-open' : ''}`} onClick={() => setYearDropdownOpen(!isYearDropdownOpen)}>
              {year}
              <img src={dropdownArrow} alt="arrow-down" />
            </button>
            {isYearDropdownOpen && (
              <div className="dropdown-panel">
                {renderYears()}
              </div>
            )}
          </div>
        </div>
        <button onClick={handleNextMonth} className="nav-arrow right" disabled={!!isNextMonthDisabled}>
            <img src={arrowRight} alt="arrow-right" />
        </button>
      </div>
      <div className="days-of-week">
        {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
          <div key={day}>{day}</div>
        ))}
      </div>
      <div className="calendar-grid">
        {renderDays()}
      </div>
    </div>
  );
};
