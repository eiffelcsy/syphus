import { IonContent, IonButton, IonBackButton, IonButtons, IonHeader, IonInput, IonPage, IonText, IonToolbar, IonToast } from '@ionic/react';
import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';

import './Forgot.css'

const Forgot: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [showToast, setShowToast] = useState<boolean>(false);
    const [toastMessage, setToastMessage] = useState<string>('');

    const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'http://localhost:8100/reset-password',
        });
        if (error) {
            setToastMessage('Error: ' + error.message);
        } else {
            setToastMessage('Password reset email sent successfully!');
        }
        setShowToast(true);
    };

    return (
        <>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonButtons slot="start">
                        <IonBackButton></IonBackButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent className='forgotContent'>
                <h1 className='forgotTitle'>Reset Password</h1>
                <div className='forgotFormDiv'>
                    <form onSubmit={handleForgotPassword}>
                        <IonInput
                            fill='outline' 
                            labelPlacement='floating' 
                            type='email' 
                            mode='md' 
                            value={email} 
                            onIonChange={(e) => setEmail(e.detail.value!)}>
                            <div slot='label'>
                                <IonText color={'primary'}>Email</IonText>
                            </div>
                        </IonInput>
                        <IonButton fill='solid' color={'primary'} type='submit' expand='block' mode='ios' className='forgotButton'>Reset Password</IonButton>
                    </form>
                </div>
                <IonToast
                    isOpen={showToast}
                    onDidDismiss={() => setShowToast(false)}
                    message={toastMessage}
                    duration={3000}
                />
            </IonContent>
        </>
    );
};

export default Forgot;
