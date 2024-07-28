import { IonContent, IonButton, IonHeader, IonInput, IonPage, IonText, IonTitle, IonToolbar, IonIcon } from '@ionic/react';
import React from 'react';
import { logoGoogle, logoFacebook, logoApple } from 'ionicons/icons'

import './Login.css'

const Login: React.FC = () => {
    const login = (event: any) => {
        event.preventDefault();
        console.log('login');
    }

    return (
        <IonPage>
            <IonContent>
                <h1 className='loginTitle'>Login</h1>
                <div className='formDiv'>
                    <form onSubmit={login}>
                        <IonInput fill='outline' labelPlacement='floating' type='email' mode='md'>
                            <div slot='label'>
                                <IonText color={'primary'}>Email</IonText>
                            </div>
                        </IonInput>
                        <IonInput fill='outline' labelPlacement='floating' type='password' mode='md' className='ion-margin-top ion-margin-bottom'>
                            <div slot='label'>
                                <IonText color={'primary'}>Password</IonText>
                            </div>
                        </IonInput>
                        <div className='forgotDiv'>
                           <a href='/forgot'><IonText color={'secondary'}>Forgot Password?</IonText></a>
                        </div>
                        <div className='externalAuthDiv'>
                            <IonButton className='externalButton' fill='clear' size='large'><IonIcon slot='icon-only' icon={logoGoogle} size="large"></IonIcon></IonButton>
                            <IonButton className='externalButton' fill='clear' size='large'><IonIcon slot='icon-only' icon={logoFacebook} size="large"></IonIcon></IonButton>
                            <IonButton className='externalButton' fill='clear' size='large'><IonIcon slot='icon-only' icon={logoApple} size="large"></IonIcon></IonButton>
                        </div>
                        <IonButton fill='outline' color={'tertiary'} type='button' expand='block' mode='ios' className='loginButton'>Login</IonButton>
                    </form>
                </div>
                <div className='registerLink'>
                    <IonText color={'secondary'}>New Here? </IonText><a><IonText color={'tertiary'}>Register</IonText></a>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Login;