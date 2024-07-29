import { IonContent, IonButton, IonHeader, IonInput, IonPage, IonText, IonTitle, IonToolbar, IonIcon } from '@ionic/react';
import React, { useState } from 'react';
import { logoGoogle, logoFacebook, logoApple } from 'ionicons/icons';
import { supabase } from '../../supabaseClient';

import './Login.css'

const Login: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const login = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            console.log('Login successful');
        } catch (error) {
            console.error('Error logging in:', (error as Error).message);
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
                           <a href='/forgot'><IonText color={'secondary'}>Forgot Password?</IonText></a>
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
                    <IonText color={'secondary'}>New Here? </IonText><a href='/register'><IonText color={'tertiary'}>Register</IonText></a>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Login;