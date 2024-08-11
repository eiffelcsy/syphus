import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonItemOptions,
  IonItemOption,
  IonIcon,
  IonSpinner,
  IonText,
  IonCheckbox,
  IonItemSliding,
  IonToast,
} from '@ionic/react';
import { supabase } from '../../supabaseClient';
import { trash } from 'ionicons/icons';

import EditTaskModal from '../../components/EditTaskModal';
import './Tasks.css';

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [selectedSegment, setSelectedSegment] = useState<string>('scheduled');
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showToast, setShowToast] = useState<boolean>(false);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('type', 'task');

      if (error) {
        console.error('Error fetching tasks:', error);
      } else {
        setTasks(data || []);
      }
      setLoading(false);
    };

    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter(task => {
    return selectedSegment === 'scheduled'
      ? task.start_date !== null
      : task.start_date === null;
  });

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

  const deleteTask = async (taskId: number) => {
    const { error } = await supabase
      .from('items')
      .delete()
      .eq('item_id', taskId);

    if (error) {
      console.error('Error deleting task:', error.message);
      setShowToast(true);
    } else {
      setTasks((prevTasks) => prevTasks.filter(task => task.item_id !== taskId));
    }
  };

  const handleTaskClick = (task: any) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedTask(null);
  };

  const handleTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Update task in the database
    const { error } = await supabase
      .from('items')
      .update(selectedTask)
      .eq('item_id', selectedTask.item_id);

    if (error) {
      console.error('Error updating task:', error.message);
      setShowToast(true);
    } else {
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.item_id === selectedTask.item_id ? selectedTask : t
        )
      );
      handleModalClose();
    }
  };

  return (
    <IonPage>
      <IonHeader className='ion-no-border'>
        <IonToolbar className='mainToolbar'>
          <IonTitle className='mainTitle'>Tasks</IonTitle>
        </IonToolbar>
      </IonHeader>
      <div className='task-segment-wrapper'>
        <IonSegment className='task-segment' mode='ios' value={selectedSegment} onIonChange={e => setSelectedSegment(e.detail.value! as string)}>
          <IonSegmentButton className='task-segment-button' value='scheduled'>Scheduled</IonSegmentButton>
          <IonSegmentButton className='task-segment-button' value='not-scheduled'>Not Scheduled</IonSegmentButton>
        </IonSegment>
      </div>
      <IonContent>
        {loading ? (
          <IonSpinner />
        ) : (
          <IonList lines='none'>
            {filteredTasks.map(task => (
              <IonItemSliding key={task.item_id}>
                <IonItem lines='none' color='primary' className='task-item' button onClick={() => handleTaskClick(task)}>
                  <div className='task-checkbox' slot='start'>
                    <IonCheckbox 
                      checked={task.completed}
                      onIonChange={() => handleCheckboxChange(task)}
                    ></IonCheckbox>
                  </div>
                  <IonLabel className='task-name-label'>
                    <IonText color={'tertiary'}>
                      <h2>{task.name}</h2>
                    </IonText>
                  </IonLabel>
                  {selectedSegment === 'scheduled' && (
                    <div slot='end' className='task-details'>
                      <p className='task-date'>{new Date(task.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                      <p className='task-time'>{task.start_time} - {task.end_time}</p>
                    </div>
                  )}
                </IonItem>
                <IonItemOptions>
                  <IonItemOption color="danger" onClick={() => deleteTask(task.item_id)}>
                    <IonIcon slot="icon-only" icon={trash}></IonIcon>
                  </IonItemOption>
                </IonItemOptions>
              </IonItemSliding>
            ))}
          </IonList>
        )}
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message="Error deleting task"
          duration={2000}
        />
      </IonContent>
      
      {selectedTask && (
        <EditTaskModal
          showModal={showModal}
          task={selectedTask}
          onClose={handleModalClose}
          onSubmit={handleTaskSubmit}
          setTask={setSelectedTask}
        />
      )}
    </IonPage>
  );
};

export default Tasks;
