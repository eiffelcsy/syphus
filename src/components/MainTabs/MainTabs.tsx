import React from 'react';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet } from '@ionic/react';
import { Redirect, Route } from 'react-router-dom';
import { homeOutline, calendarOutline, addCircleOutline, listOutline, pricetagOutline, terminal } from 'ionicons/icons';
import Home from '../../pages/Home/Home';
import Events from '../../pages/Events/Events';
import Add from '../../pages/Add/Add';
import Tasks from '../../pages/Tasks/Tasks';
import Tags from '../../pages/Tags/Tags';


import './MainTabs.css'

const MainTabs: React.FC = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route path="/app/home" render={() => <Home />} exact={true} />
        <Route path="/app/events" render={() => <Events />} exact={true} />
        <Route path="/app/add" render={() => <Add />} exact={true} />
        <Route path="/app/tasks" render={() => <Tasks />} exact={true} />
        <Route path="/app/tags" render={() => <Tags />} exact={true} />
        <Redirect exact from="/app" to="/app/home" />
      </IonRouterOutlet>
      <IonTabBar slot="bottom" color={'tertiary'}>
        <IonTabButton mode="ios" tab="home" href="/app/home">
          <IonIcon icon={homeOutline} size="large" />
        </IonTabButton>
        <IonTabButton mode="ios" tab="events" href="/app/events">
          <IonIcon icon={calendarOutline} size="large" />
        </IonTabButton>
        <IonTabButton mode="ios" tab="add" href="/app/add">
          <IonIcon icon={addCircleOutline} size="large" />
        </IonTabButton>
        <IonTabButton mode="ios" tab="tasks" href="/app/tasks">
          <IonIcon icon={listOutline} size="large" />
        </IonTabButton>
        <IonTabButton mode="ios" tab="tags" href="/app/tags">
          <IonIcon icon={pricetagOutline} size="large" />
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default MainTabs;
