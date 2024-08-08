import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';

const Events: React.FC = () => {

    return (
        <IonPage>
            <IonHeader className='ion-no-border'>
                <IonToolbar className='mainToolbar'>
                    <IonTitle className='mainTitle'>Events</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                Events Tab Content
            </IonContent>
        </IonPage>
    );
};

export default Events;