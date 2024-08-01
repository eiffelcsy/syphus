import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonToast } from '@ionic/react';
import React, { useState } from 'react';
import LogoutButton from '../../components/LogoutButton';

const Home: React.FC = () => {

    return (
        <IonPage>
            <IonContent className="ion-padding">
                Home Content
                <LogoutButton/>
            </IonContent>
        </IonPage>
    );
};

export default Home;
