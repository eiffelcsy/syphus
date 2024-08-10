import React from 'react';
import { IonButton, IonCheckbox, IonIcon } from '@ionic/react';
import { buildOutline } from 'ionicons/icons';

interface TaskCardProps {
  task: any;
  onEdit: () => void;
  onCheckboxChange: (task: any) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onCheckboxChange }) => {
  return (
    <div className='task-card'>
      <div className='task-content-wrapper'>
        <div className='task-checkbox-wrapper'>
          <IonCheckbox 
            checked={task.completed}
            onIonChange={() => onCheckboxChange(task)}
          ></IonCheckbox>
        </div>
        <div>
          <div className='task-name'>{task.name}</div>
          <div className='task-duration'>{task.start_time} - {task.end_time}</div>
        </div>
      </div>
      <IonButton className='task-edit-button' onClick={onEdit}>
        <IonIcon icon={buildOutline} slot='icon-only' color='primary' className='task-edit-icon'></IonIcon>
      </IonButton>
    </div>
  );
};

export default TaskCard;
