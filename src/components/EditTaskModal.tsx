import React, { useState } from 'react';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonContent,
  IonInput,
  IonLabel,
  IonCheckbox,
  IonSegment,
  IonSegmentButton,
  IonDatetime,
  IonDatetimeButton,
  IonSelect,
  IonSelectOption,
  IonText,
  IonGrid,
  IonRow,
  IonCol,
  IonToast,
} from '@ionic/react';
import { supabase } from '../supabaseClient'; // Ensure correct path

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
  const [type, setType] = useState<string>(task?.type || 'task');
  const [showDateInput, setShowDateInput] = useState<boolean>(!!task?.start_date);
  const [showTimeInputs, setShowTimeInputs] = useState<boolean>(!!task?.start_time);
  const [showToast, setShowToast] = useState<boolean>(false);

  const deleteTask = async () => {
    const { error } = await supabase
      .from('items')
      .delete()
      .eq('item_id', task.item_id);

    if (error) {
      console.error('Error deleting task:', error.message);
      setShowToast(true);
    } else {
      onClose();
    }
  };

  return (
    <IonModal isOpen={showModal} onDidDismiss={onClose} className='edit-task-modal'>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Edit</IonTitle>
          <IonButton slot="end" onClick={onClose} color={'primary'}>
            <IonText color={'tertiary'}>Close</IonText>
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className='edit-form-wrapper'>
          <form onSubmit={onSubmit} className='edit-modal-form'>
            <div className='typeSegmentDiv'>
              <IonSegment mode='ios' value={type} onIonChange={e => {
                setType(e.detail.value! as string);
                setTask({ ...task, type: e.detail.value! as string });
              }} className='typeSegment'>
                <IonSegmentButton className='typeSegmentButton' value="task">Task</IonSegmentButton>
                <IonSegmentButton className='typeSegmentButton' value="routine">Routine</IonSegmentButton>
              </IonSegment>
            </div>

            <IonInput
              value={task?.name}
              onIonChange={e => setTask({ ...task, name: e.detail.value! })}
              fill='outline'
              labelPlacement='floating'
              mode='md'
              required
              className='nameInput'
              color={'tertiary'}>
              <div slot='label'>
                <IonText color={'tertiary'}>Name</IonText>
              </div>
            </IonInput>

            {(type === 'task' || type === 'event') && !showDateInput && (
              <IonButton fill="outline" color={'tertiary'} onClick={() => setShowDateInput(true)} expand="block" className='addDateButton'>Set Date</IonButton>
            )}

            {(type === 'task' || type === 'event') && showDateInput && (
              <>
                <div className='dateSelectorDiv'>
                  <IonLabel className='startDateLabel'>Date</IonLabel>
                  <IonDatetimeButton datetime="start-date">
                    <IonText>{task?.start_date ? 'Change Date' : 'Select Date'}</IonText>
                  </IonDatetimeButton>
                  <IonModal keepContentsMounted={true}>
                    <IonDatetime
                      id="start-date"
                      presentation="date"
                      preferWheel={true}
                      value={task?.start_date}
                      onIonChange={e => setTask({ ...task, start_date: e.detail.value! })}
                    />
                  </IonModal>
                </div>
                <IonButton fill="outline" color={'tertiary'} onClick={() => setShowDateInput(false)} expand="block" className='addDateButton'>Remove Date</IonButton>
              </>
            )}

            {type === 'routine' && (
              <div className='occurDiv'>
                <div className='occurLabel'>
                  <IonText>Occurs On</IonText>
                </div>
                <IonGrid>
                  <IonRow>
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                      <IonCol key={index} style={{ textAlign: 'center' }}>
                        <IonCheckbox
                          color={'tertiary'}
                          labelPlacement="stacked"
                          checked={task?.occurs_on?.includes(day)}
                          onIonChange={e => {
                            const checked = e.detail.checked;
                            const updatedDays = checked
                              ? [...(task.occurs_on || []), day]
                              : task.occurs_on.filter((d: string) => d !== day);
                            setTask({ ...task, occurs_on: updatedDays });
                          }}
                        >
                          {day}
                        </IonCheckbox>
                      </IonCol>
                    ))}
                  </IonRow>
                </IonGrid>
              </div>
            )}

            {(type === 'task' || type === 'routine') && !showTimeInputs && (
              <IonButton fill="outline" color={'tertiary'} onClick={() => setShowTimeInputs(true)} expand="block" className='addTimeButton'>Set Time</IonButton>
            )}

            {showTimeInputs && (
              <>
                <div className='timeSelectorDiv'>
                  <div className='startTimeDiv'>
                    <IonLabel className='startTimeLabel'>Start Time</IonLabel>
                    <IonDatetimeButton datetime="start-time" />
                    <IonModal keepContentsMounted={true}>
                      <IonDatetime
                        id="start-time"
                        presentation='time'
                        minuteValues="0,30"
                        value={task?.start_time}
                        onIonChange={e => setTask({ ...task, start_time: e.detail.value! })}
                      />
                    </IonModal>
                  </div>
                  <div className='endTimeDiv'>
                    <IonLabel className='endTimeLabel'>End Time</IonLabel>
                    <IonDatetimeButton datetime="end-time" />
                    <IonModal keepContentsMounted={true}>
                      <IonDatetime
                        id="end-time"
                        presentation='time'
                        minuteValues="0,30"
                        value={task?.end_time}
                        onIonChange={e => setTask({ ...task, end_time: e.detail.value! })}
                      />
                    </IonModal>
                  </div>
                </div>
                <IonButton fill="outline" color={'tertiary'} onClick={() => setShowTimeInputs(false)} expand="block" className='addTimeButton'>Remove Time</IonButton>
              </>
            )}

            <div className='tagSelectField'>
              <IonSelect
                color={'tertiary'}
                interface='alert'
                multiple={true}
                value={task?.tags || []}
                onIonChange={e => setTask({ ...task, tags: e.detail.value })}
              >
                <div slot='label'>Tags</div>
                {/* TODO: Replace with dynamic tags from the database */}
                <IonSelectOption className='tagSelectOption' value="tag1">Tag 1</IonSelectOption>
                <IonSelectOption className='tagSelectOption' value="tag2">Tag 2</IonSelectOption>
              </IonSelect>
            </div>
            <div className='delete-button-wrapper'>
              <IonButton
                fill='solid'
                color={'danger'}
                expand="block"
                className='delete-button'
                onClick={deleteTask}
              >
                <IonText color={'light'}>Delete Item</IonText>
              </IonButton>
            </div>
            
            <div className='save-button-wrapper'>
              <IonButton fill='solid' color={'tertiary'} type="submit" expand="block" className='save-button'>
                <IonText color={'primary'}>Save Changes</IonText>
              </IonButton>
            </div>
          </form>
        </div>
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message="Error deleting task. Please try again."
          duration={2000}
          color="danger"
        />
      </IonContent>
    </IonModal>
  );
};

export default EditTaskModal;
