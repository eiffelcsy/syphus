import React, { useEffect, useState, useRef } from 'react';
import { IonContent, IonList, IonItem, IonLabel, IonText, IonCard, IonCardTitle, IonButton, IonIcon, IonCardContent } from '@ionic/react';
import { trashOutline } from 'ionicons/icons';
import { supabase } from '../../supabaseClient';

import './EventList.css';

interface Event {
  item_id: number;
  name: string;
  start_date: string;
}

interface EventListProps {
  currentDate: string;
}

const EventList: React.FC<EventListProps> = ({ currentDate }) => {
  const [groupedEvents, setGroupedEvents] = useState<{ [date: string]: Event[] }>({});
  const listRef = useRef<HTMLIonListElement>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      const currentMonth = new Date(currentDate).getMonth() + 1;
      const currentYear = new Date(currentDate).getFullYear();

      let { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('type', 'event')
        .order('start_date', { ascending: true });

      if (error) console.error('Error fetching events:', error);
      else {
        const filteredEvents = (data || []).filter(event => {
          const eventDate = new Date(event.start_date);
          return eventDate.getMonth() + 1 === currentMonth && eventDate.getFullYear() === currentYear;
        });

        const grouped = filteredEvents.reduce((acc: { [date: string]: Event[] }, event) => {
          const date = new Date(event.start_date).toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
          });
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push(event);
          return acc;
        }, {});

        setGroupedEvents(grouped);

        const firstEventIndex = Object.keys(grouped).findIndex(date => {
          const eventDate = new Date(date);
          return eventDate >= new Date(currentDate);
        });

        if (firstEventIndex !== -1 && listRef.current) {
          setTimeout(() => {
            const targetItem = listRef.current?.children[firstEventIndex-1] as HTMLElement;
            if (targetItem) {
              targetItem.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 100);
        }
      }
    };

    fetchEvents();
  }, [currentDate]);

  const deleteEvent = async (eventId: number, eventDate: string) => {
    const { error } = await supabase
      .from('items')
      .delete()
      .eq('item_id', eventId);

    if (error) {
      console.error('Error deleting event:', error);
    } else {
      setGroupedEvents(prevGroupedEvents => {
        const updatedGroupedEvents = { ...prevGroupedEvents };
        updatedGroupedEvents[eventDate] = updatedGroupedEvents[eventDate].filter(event => event.item_id !== eventId);

        // If no events left on this date, remove the date group
        if (updatedGroupedEvents[eventDate].length === 0) {
          delete updatedGroupedEvents[eventDate];
        }

        return updatedGroupedEvents;
      });
    }
  };

  return (
    <IonContent>
      <div className='event-list-wrapper'>
        <IonList className='event-list' lines='none' ref={listRef}>
          {Object.entries(groupedEvents).map(([date, events]) => {
            const eventDate = new Date(date);
            const dateLabel = eventDate.toLocaleDateString('en-US', { day: 'numeric' });
            const weekdayLabel = eventDate.toLocaleDateString('en-US', { weekday: 'short' });

            return (
              <IonItem className='event-date-group' color='primary' key={date}>
                <IonLabel>
                  <IonText color="tertiary" className='event-date-label'>{`${dateLabel}`}</IonText><br/>
                  <IonText color="tertiary" className='event-day-label'>{`${weekdayLabel}`}</IonText>
                </IonLabel>
                <div className='event-card-group'>
                  {events.map(event => (
                    <IonCard color={'tertiary'} key={event.item_id} className='event-card'>
                      <IonCardTitle className='event-name-label'>
                        <IonText color={'primary'} className='event-name-label'>{event.name}</IonText>
                      </IonCardTitle>
                      <IonButton fill="clear" color="danger" onClick={() => deleteEvent(event.item_id, date)}>
                        <IonIcon slot="icon-only" icon={trashOutline} />
                      </IonButton>
                    </IonCard>
                  ))}
                </div>
              </IonItem>
            );
          })}
        </IonList>
      </div>
    </IonContent>
  );
};

export default EventList;
