import { IonContent, IonButton, IonHeader, IonInput, IonPage, IonText, IonTitle, IonToolbar, IonIcon, IonToast, IonNavLink } from '@ionic/react';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { logoGoogle, logoFacebook, logoApple } from 'ionicons/icons';
import { supabase } from '../../supabaseClient';

import './Login.css'

import Forgot from '../Forgot/Forgot';
import Register from '../Register/Register';

const Login: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showToast, setShowToast] = useState<boolean>(false);
    const [toastMessage, setToastMessage] = useState<string>('');
    const history = useHistory();

    const login = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            setToastMessage(`Error logging in: ${error.message}`);
            setShowToast(true);
        } else {
            history.push('/app');
        }
    }

    return (
        <IonPage>
            <IonContent className='loginContent'>
                <h1 className='loginTitle'>Login</h1>
                <div className='loginFormDiv'>
                    <form onSubmit={login}>
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
                        <div className='forgotDiv'>
                           <IonNavLink routerDirection='forward' component={() => <Forgot/> }><IonText color={'secondary'}>Forgot Password?</IonText></IonNavLink>
                        </div>
                        <div className='OAuthLoginDiv'>
                            <IonButton className='externalButton' fill='clear' size='large'><IonIcon slot='icon-only' icon={logoGoogle} size="large"></IonIcon></IonButton>
                            <IonButton className='externalButton' fill='clear' size='large'><IonIcon slot='icon-only' icon={logoFacebook} size="large"></IonIcon></IonButton>
                            <IonButton className='externalButton' fill='clear' size='large'><IonIcon slot='icon-only' icon={logoApple} size="large"></IonIcon></IonButton>
                        </div>
                        <IonButton fill='outline' color={'tertiary'} type='submit' expand='block' mode='ios' className='loginButton'>Login</IonButton>
                    </form>
                </div>
                <div className='registerLink'>
                    <IonText color={'secondary'}>New Here? </IonText><IonNavLink routerDirection='forward' component={() => <Register/> }><IonButton fill='clear' color={'tertiary'} className='registerLinkButton' mode='ios'>Register</IonButton></IonNavLink>
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

export default Login;