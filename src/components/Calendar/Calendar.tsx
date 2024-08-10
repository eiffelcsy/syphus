import React, { useEffect } from 'react';
import { IonContent, IonGrid, IonRow, IonCol, IonText } from '@ionic/react';
import './Calendar.css';

interface CalendarProps {
  currentDate: string;
  setCurrentDate: (date: string) => void;
}

const Calendar: React.FC<CalendarProps> = ({ currentDate, setCurrentDate }) => {
  const today = new Date(currentDate);
  const selectedDay = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const weeks: number[][] = [];
  let week: number[] = [];

  for (let i = 0; i < firstDayOfMonth; i++) {
    week.push(0);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    week.push(i);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }

  if (week.length > 0) {
    while (week.length < 7) {
      week.push(0);
    }
    weeks.push(week);
  }

  const handleDateClick = (day: number) => {
    if (day !== 0) {
      const newDate = new Date(currentYear, currentMonth, day);
      setCurrentDate(
        `${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, '0')}-${String(newDate.getDate()).padStart(2, '0')}`
      );
    }
  };

  const renderDay = (day: number, index: number) => {
    const isToday = day === selectedDay;
    const isSelected = day === selectedDay;

    return (
      <IonCol key={index} className="ion-text-center" onClick={() => handleDateClick(day)}>
        <IonText className='date-label'>
          <span
            style={{
              borderRadius: '50%',
              padding: '8px',
              border: isToday ? '2px solid #F2E5D5' : 'none',
              backgroundColor: isSelected ? '#F2E5D5' : 'transparent',
              color: isSelected ? '#122A40' : '#F2E5D5'
            }}
          >
            {day !== 0 ? day : ''}
          </span>
        </IonText>
      </IonCol>
    );
  };

  return (
    <>
        <div>
            <IonText className='month-title'>{monthNames[currentMonth]}</IonText>
        </div>
        <div className='calendar-grid-wrapper'>
            <IonGrid>
            <IonRow className='day-label-row'>
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                <IonCol key={index} className="ion-text-center">
                    <IonText>{day}</IonText>
                </IonCol>
                ))}
            </IonRow>
            {weeks.map((week, weekIndex) => (
                <IonRow key={weekIndex} className='date-label-rows'>
                {week.map((day, dayIndex) => renderDay(day, weekIndex * 7 + dayIndex))}
                </IonRow>
            ))}
            </IonGrid>
        </div>
    </>
  );
};

export default Calendar;