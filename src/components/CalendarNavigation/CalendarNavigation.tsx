// src/components/CalendarNavigation/CalendarNavigation.tsx
import React from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { caretBack, caretForward } from 'ionicons/icons';
import './CalendarNavigation.css';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface CalendarNavigationProps {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
}

const CalendarNavigation: React.FC<CalendarNavigationProps> = ({ currentDate, setCurrentDate }) => {
  const changeDate = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + days);
    setCurrentDate(newDate);
  };

  const getDatesAround = (date: Date) => {
    return Array.from({ length: 7 }, (_, i) => {
      const tempDate = new Date(date);
      tempDate.setDate(date.getDate() + i - 3);
      return tempDate;
    });
  };

  const datesOfWeek = getDatesAround(currentDate);

  return (
    <div className="calendar-navigation">
      <IonButton color={'tertiary'} onClick={() => changeDate(-1)} fill="clear">
        <IonIcon slot="icon-only" icon={caretBack} />
      </IonButton>
      {datesOfWeek.map((date, index) => (
        <div key={index} className={`date-item ${currentDate.getDate() === date.getDate() ? 'highlighted' : ''}`}>
          <div className='dayLabel'>{daysOfWeek[date.getDay()]}</div>
          <div className='dateLabel'>{date.getDate()}</div>
        </div>
      ))}
      <IonButton color={'tertiary'} onClick={() => changeDate(1)} fill="clear">
        <IonIcon slot="icon-only" icon={caretForward} />
      </IonButton>
    </div>
  );
};

export default CalendarNavigation;
