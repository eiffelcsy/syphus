import { IonButton, IonContent, IonIcon, IonInput, IonPage, IonText } from '@ionic/react';
import React, { useState } from 'react';
import { logoGoogle, logoFacebook, logoApple } from 'ionicons/icons';
import { supabase } from '../../supabaseClient';

import "./Register.css";

const Register: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');

    const register = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match');
            return;
        }
        try {
            const { error } = await supabase.auth.signUp({ email, password });
            if (error) throw error;
            console.log('Registration successful');
        } catch (error) {
            console.error('Error registering:', (error as Error).message);
            setErrorMessage((error as Error).message);
        }
    };

    return (
        <IonPage>
            <IonContent className='registerContent'>
                <h1 className='registerTitle'>Register</h1>
                <div className='registerFormDiv'>
                    <form onSubmit={register}>
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
                        {errorMessage && <IonText color="danger" className='passwordError'>{errorMessage}</IonText>}
                        <div className='dividerDiv'>
                            <hr className='line' />
                            <IonText className='orText'>OR</IonText>
                            <hr className='line' />
                        </div>
                        <div className='signUpMessageDiv'>
                            <IonText color={'primary'}>Sign Up With</IonText>
                        </div>
                        <div className='OAuthRegDiv'>
                            <IonButton className='externalButton' fill='clear' size='large'><IonIcon slot='icon-only' icon={logoGoogle} size="large"></IonIcon></IonButton>
                            <IonButton className='externalButton' fill='clear' size='large'><IonIcon slot='icon-only' icon={logoFacebook} size="large"></IonIcon></IonButton>
                            <IonButton className='externalButton' fill='clear' size='large'><IonIcon slot='icon-only' icon={logoApple} size="large"></IonIcon></IonButton>
                        </div>
                        <IonButton fill='outline' color={'tertiary'} type='submit' expand='block' mode='ios' className='registerButton'>Register</IonButton>
                    </form>
                </div>
                <div className='loginLink'>
                    <IonText color={'secondary'}>Have an Account? </IonText><a href='/login'><IonText color={'tertiary'}>Login</IonText></a>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Register;
