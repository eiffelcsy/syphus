import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { useState } from 'react';

import Calendar from '../../components/Calendar/Calendar';
import EventList from '../../components/EventList/EventList';

import './Events.css';

const Events: React.FC = () => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState<string>(
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  );

  return (
    <IonPage>
      <IonHeader className='ion-no-border'>
        <IonToolbar className='mainToolbar'>
          <IonTitle className='mainTitle'>Events</IonTitle>
        </IonToolbar>
      </IonHeader>
      <div className='calendar-wrapper'>
        <Calendar currentDate={currentDate} setCurrentDate={setCurrentDate} />
      </div>
      <IonContent>
        <EventList currentDate={currentDate} />
      </IonContent>
    </IonPage>
  );
};

export default Events;
