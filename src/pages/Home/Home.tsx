import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonToast,
} from '@ionic/react';
import CalendarNavigation from '../../components/CalendarNavigation/CalendarNavigation';
import { supabase } from '../../supabaseClient';
import SummaryCards from '../../components/SummaryCards';
import ScheduleTable from '../../components/ScheduleTable';
import EditTaskModal from '../../components/EditTaskModal';

import './Home.css'

const Home: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentTask, setCurrentTask] = useState<any>(null);

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

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

    const fetchEvents = async (date: Date) => {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('type', 'event')
        .eq('start_date', date.toISOString().split('T')[0]);

      if (error) {
        setError(error.message);
      } else {
        setEvents(data);
      }
    };

    fetchEvents(currentDate);
    fetchTasks(currentDate);
  }, [currentDate]);

  const handleCheckboxChange = async (task: any) => {
    const updatedCompletedStatus = !task.completed;

    const { error } = await supabase
      .from('items')
      .update({ completed: updatedCompletedStatus })
      .eq('item_id', task.item_id);

    if (error) {
      setError(error.message);
    } else {
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.item_id === task.item_id ? { ...t, completed: updatedCompletedStatus } : t
        )
      );
    }
  };

  const handleEditButtonClick = (task: any) => {
    setCurrentTask(task);
    setShowModal(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase
      .from('items')
      .update({ name: currentTask.name,
                start_date: currentTask.start_date,
                end_date: currentTask.end_date,
                start_time: currentTask.start_time,
                end_time: currentTask.end_time,
                occurs_on: currentTask.occurs_on
              })
      .eq('item_id', currentTask.item_id);

    if (error) {
      setError(error.message);
    } else {
      setShowModal(false);
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.item_id === currentTask.item_id ? currentTask : t))
      );
    }
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="mainToolbar">
          <IonTitle className="mainTitle">{monthNames[currentDate.getMonth()]}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <div className="calendar-week-wrapper">
        <CalendarNavigation currentDate={currentDate} setCurrentDate={setCurrentDate} />
      </div>
      <SummaryCards eventsCount={events.length} tasksCount={tasks.length} />
      <IonContent>
        {error && (
          <IonToast
            isOpen={!!error}
            message={error}
            duration={3000}
            onDidDismiss={() => setError(null)}
          />
        )}
        <ScheduleTable tasks={tasks} onEdit={handleEditButtonClick} onCheckboxChange={handleCheckboxChange} />
        <EditTaskModal
          showModal={showModal}
          task={currentTask}
          onClose={() => setShowModal(false)}
          onSubmit={handleFormSubmit}
          setTask={setCurrentTask}
        />
      </IonContent>
    </IonPage>
  );
};

export default Home;
