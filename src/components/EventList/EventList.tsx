import React, { useEffect, useState } from 'react';
import { IonContent, IonList, IonItem, IonLabel, IonText } from '@ionic/react';
import { supabase } from '../../supabaseClient';

interface Event {
  item_id: number;
  name: string;
  start_date: string;
}

interface EventListProps {
  currentDate: string;
}

const EventList: React.FC<EventListProps> = ({ currentDate }) => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      let { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('type', 'event')
        .order('start_date', { ascending: true });
      
      if (error) console.error('Error fetching events:', error);
      else setEvents(data || []);
    };

    fetchEvents();
  }, []);

  const renderEvent = (event: Event) => {
    const eventDate = new Date(event.start_date);
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric' };
    const formattedDate = eventDate.toLocaleDateString('en-US', options);
    
    return (
      <IonItem key={event.item_id}>
        <IonLabel>
          <IonText color="primary">{formattedDate}</IonText>
          <p>{event.name}</p>
        </IonLabel>
      </IonItem>
    );
  };

  return (
    <IonContent>
      <IonList>
        {events
          .map(event => renderEvent(event))}
      </IonList>
    </IonContent>
  );
};

export default EventList;
