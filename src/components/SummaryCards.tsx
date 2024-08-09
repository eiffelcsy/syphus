import React from 'react';
import { IonCard, IonCardContent, IonCol, IonGrid, IonRow, IonText } from '@ionic/react';

interface SummaryCardsProps {
  eventsCount: number;
  tasksCount: number;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ eventsCount, tasksCount }) => {
  return (
    <div className='summary-cards-wrapper'>
      <IonGrid>
        <IonRow>
          <IonCol>
            <IonCard color={'tertiary'} className='summary-cards'>
              <IonCardContent className='events-summary'>Events: 
                <IonText className='events-counter'> {eventsCount}</IonText>
              </IonCardContent>
            </IonCard>
          </IonCol>
          <IonCol>
            <IonCard color={'tertiary'} className='summary-cards'>
              <IonCardContent className='tasks-summary'>Tasks: 
                <IonText className='tasks-counter'> {tasksCount}</IonText>
              </IonCardContent>
            </IonCard>
          </IonCol>
        </IonRow>
      </IonGrid>
    </div>
  );
};

export default SummaryCards;
