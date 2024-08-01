import { IonContent, IonButton, IonHeader, IonInput, IonPage, IonText, IonTitle, IonToolbar, IonToast } from '@ionic/react';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import './Reset.css';

const Reset: React.FC = () => {
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [showToast, setShowToast] = useState<boolean>(false);
    const [toastMessage, setToastMessage] = useState<string>('');
    const history = useHistory();

    const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setToastMessage('Passwords do not match.');
            setShowToast(true);
            return;
        }

        const { error } = await supabase.auth.updateUser({ password: password });
        if (error) {
            setToastMessage('Error: ' + error.message);
        } else {
            setToastMessage('Password updated successfully! Redirecting to login...');
            setTimeout(() => {
                history.push('/login');
            }, 3000);
        }
        setShowToast(true);
    };

    return (
        <IonPage>
            <IonContent className='resetContent'>
                <h1 className='resetTitle'>Change Password</h1>
                <div className='resetFormDiv'>
                    <form onSubmit={handleResetPassword}>
                        <IonInput 
                            fill='outline' 
                            labelPlacement='floating' 
                            type='password' 
                            mode='md' 
                            className='ion-margin-top ion-margin-bottom' 
                            value={password} 
                            onIonChange={(e) => setPassword(e.detail.value!)}>
                            <div slot='label'>
                                <IonText color={'primary'}>Password</IonText>
                            </div>
                        </IonInput>
                        <IonInput 
                            fill='outline' 
                            labelPlacement='floating' 
                            type='password' 
                            mode='md' 
                            className='ion-margin-top' 
                            value={confirmPassword} 
                            onIonChange={(e) => setConfirmPassword(e.detail.value!)}>
                            <div slot='label'>
                                <IonText color={'primary'}>Confirm Password</IonText>
                            </div>
                        </IonInput>
                        <IonButton fill='solid' color={'primary'} type='submit' expand='block' mode='ios' className='resetButton'>Reset Password</IonButton>
                    </form>
                </div>
                <IonToast
                    isOpen={showToast}
                    onDidDismiss={() => setShowToast(false)}
                    message={toastMessage}
                    duration={3000}
                />
            </IonContent>
        </IonPage>
    );
};

export default Reset;
