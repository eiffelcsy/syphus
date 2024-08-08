import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';

const Tasks: React.FC = () => {

    return (
        <IonPage>
            <IonHeader className='ion-no-border'>
                <IonToolbar className='mainToolbar'>
                    <IonTitle className='mainTitle'>Tasks</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                Tasks Content
            </IonContent>
        </IonPage>
    );
};

export default Tasks;