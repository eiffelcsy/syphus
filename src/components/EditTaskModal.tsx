import React from 'react';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonCheckbox,
} from '@ionic/react';

interface EditTaskModalProps {
  showModal: boolean;
  task: any;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  setTask: React.Dispatch<React.SetStateAction<any>>;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({
  showModal,
  task,
  onClose,
  onSubmit,
  setTask,
}) => {
  return (
    <IonModal isOpen={showModal} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Edit Task</IonTitle>
          <IonButton slot="end" onClick={onClose}>Close</IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <form onSubmit={onSubmit}>
          <IonItem>
            <IonLabel position="stacked">User ID</IonLabel>
            <IonInput
              value={task?.user_id}
              onIonChange={(e) => setTask({ ...task, user_id: e.detail.value! })}
              required
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Type</IonLabel>
            <IonInput
              value={task?.type}
              onIonChange={(e) => setTask({ ...task, type: e.detail.value! })}
              required
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Name</IonLabel>
            <IonInput
              value={task?.name}
              onIonChange={(e) => setTask({ ...task, name: e.detail.value! })}
              required
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Start Date</IonLabel>
            <IonInput
              type="date"
              value={task?.start_date}
              onIonChange={(e) => setTask({ ...task, start_date: e.detail.value! })}
              required
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">End Date</IonLabel>
            <IonInput
              type="date"
              value={task?.end_date}
              onIonChange={(e) => setTask({ ...task, end_date: e.detail.value! })}
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Start Time</IonLabel>
            <IonInput
              type="time"
              value={task?.start_time}
              onIonChange={(e) => setTask({ ...task, start_time: e.detail.value! })}
              required
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">End Time</IonLabel>
            <IonInput
              type="time"
              value={task?.end_time}
              onIonChange={(e) => setTask({ ...task, end_time: e.detail.value! })}
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Occurs On</IonLabel>
            <IonInput
              value={task?.occurs_on}
              onIonChange={(e) => setTask({ ...task, occurs_on: e.detail.value! })}
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Completed</IonLabel>
            <IonCheckbox
              checked={task?.completed}
              onIonChange={(e) => setTask({ ...task, completed: e.detail.checked })}
            />
          </IonItem>
          <IonButton expand="block" type="submit" style={{ marginTop: '20px' }}>
            Save
          </IonButton>
        </form>
      </IonContent>
    </IonModal>
  );
};

export default EditTaskModal;
