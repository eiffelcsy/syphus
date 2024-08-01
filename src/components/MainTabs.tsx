import React from 'react';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet } from '@ionic/react';
import { Redirect, Route } from 'react-router-dom';
import { playCircle, radio, library, search } from 'ionicons/icons';
import Home from '../pages/Home/Home';
import Events from '../pages/Events/Events';
import Add from '../pages/Add/Add';
import Tasks from '../pages/Tasks/Tasks';
import Tags from '../pages/Tags/Tags';


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
      <IonTabBar slot="bottom">
        <IonTabButton tab="home" href="/app/home">
          <IonIcon icon={playCircle} />
          <IonLabel>Home</IonLabel>
        </IonTabButton>
        <IonTabButton tab="events" href="/app/events">
          <IonIcon icon={radio} />
          <IonLabel>Events</IonLabel>
        </IonTabButton>
        <IonTabButton tab="add" href="/app/add">
          <IonIcon icon={library} />
          <IonLabel>Add</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tasks" href="/app/tasks">
          <IonIcon icon={search} />
          <IonLabel>Tasks</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tags" href="/app/tags">
          <IonIcon icon={search} />
          <IonLabel>Tags</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default MainTabs;
