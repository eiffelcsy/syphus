import { IonButton, IonToast } from '@ionic/react';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const LogoutButton: React.FC = () => {

    const [showToast, setShowToast] = useState<boolean>(false);
    const [toastMessage, setToastMessage] = useState<string>('');
    const history = useHistory();

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            setToastMessage('Error: ' + error.message);
            setShowToast(true);
        } else {
            setToastMessage('Logged out successfully!');
            setShowToast(true);
            setTimeout(() => {
                history.push('/login');
            }, 1500);
        }
    };


    return (
        <>
            <IonButton onClick={handleLogout}>Logout</IonButton>
            <IonToast
                isOpen={showToast}
                onDidDismiss={() => setShowToast(false)}
                message={toastMessage}
                duration={2000}
            />
        </>
    );
};

export default LogoutButton;