import {
  IonContent,
  IonCard,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonToast,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonText
} from '@ionic/react';
import React, { useState, useEffect } from 'react';
import CalendarNavigation from '../../components/CalendarNavigation/CalendarNavigation';
import { supabase } from '../../supabaseClient';

import './Home.css';

const Home: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async (date: Date) => {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .in('type', ['task', 'routine'])
        .eq('start_date', date.toISOString().split('T')[0]);

      if (error) {
        setError(error.message);
      } else {
        setTasks(data);
      }
    };

    fetchTasks(currentDate);
  }, [currentDate]);

  const calculateRowSpan = (task: any) => {
    const [startHour, startMinute] = task.start_time.split(':').map(Number);
    const [endHour, endMinute] = task.end_time.split(':').map(Number);
    const startTimeInMinutes = startHour * 60 + startMinute;
    const endTimeInMinutes = endHour * 60 + endMinute;
    const durationInMinutes = endTimeInMinutes - startTimeInMinutes;
    return durationInMinutes / 30;
  };

  const getTimeIndex = (hour: number, minute: number) => {
    return hour * 2 + (minute === 30 ? 1 : 0);
  };

  const isCovered = (index: number, coveredIndexes: Set<number>) => {
    return coveredIndexes.has(index);
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="mainToolbar">
          <IonTitle className="mainTitle">Today</IonTitle>
        </IonToolbar>
      </IonHeader>
      <div className="calendar-wrapper">
        <CalendarNavigation currentDate={currentDate} setCurrentDate={setCurrentDate} />
      </div>
      <div className='summary-cards-wrapper'>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonCard color={'tertiary'} className='summary-cards'>
                <IonCardContent className='events-summary'>Events: 
                  <IonText className='events-counter'> {tasks.length}</IonText>
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol>
              <IonCard color={'tertiary'} className='summary-cards'>
                <IonCardContent className='tasks-summary'>Tasks: 
                  <IonText className='tasks-counter'> {tasks.length}</IonText>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </div>
      <IonContent>
        {error && (
          <IonToast
            isOpen={!!error}
            message={error}
            duration={3000}
            onDidDismiss={() => setError(null)}
          />
        )}
        <div className="schedule-table-wrapper">
          <table className="schedule-table">
            <tbody>
              {(() => {
                const coveredIndexes = new Set<number>();

                return Array.from({ length: 24 * 2 }).map((_, index) => {
                  const hour = Math.floor(index / 2);
                  const minutes = index % 2 === 0 ? '00' : '30';
                  const time = `${hour.toString().padStart(2, '0')}:${minutes}`;
                  const task = tasks.find((task) => {
                    if (!task.start_time || !task.end_time) return false;

                    const [taskHour, taskMinute] = task.start_time.split(':').map(Number);
                    return taskHour === hour && taskMinute === (minutes === '00' ? 0 : 30);
                  });

                  if (task) {
                    const rowSpan = calculateRowSpan(task);
                    const startIndex = getTimeIndex(hour, minutes === '00' ? 0 : 30);
                    for (let i = 0; i < rowSpan; i++) {
                      coveredIndexes.add(startIndex + i);
                    }
                    return (
                      <tr key={index}>
                        <td>{time}</td>
                        <td rowSpan={rowSpan}>
                          <div className="task-card">
                            <div className='task-name'>{task.name}</div>
                            <div className='task-duration'>{task.start_time} - {task.end_time}</div>
                          </div>
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={index}>
                      <td>{time}</td>
                      {isCovered(index, coveredIndexes) ? null : <td></td>}
                    </tr>
                  );
                });
              })()}
            </tbody>
          </table>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
