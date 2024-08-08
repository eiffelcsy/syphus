import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';

const Tags: React.FC = () => {

    return (
        <IonPage>
            <IonHeader className='ion-no-border'>
                <IonToolbar className='mainToolbar'>
                    <IonTitle className='mainTitle'>Tags</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                Tags Content
            </IonContent>
        </IonPage>
    );
};

export default Tags;