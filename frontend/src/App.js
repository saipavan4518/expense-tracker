import React from 'react';
import './App.css';
import {Route, BrowserRouter as Router, Switch} from 'react-router-dom';

import Login from './components/Login.component';
import UserPanel from './components/userpanel.component';
import AdminPanel from './components/adminpanel.component';
import Mevent from './components/marriageEvent.component';
import NotFound from './components/Notfound.component';
import UpdateUsers from './components/updateusers.component';
import ManageEvents from './components/manageevents.component';

function App() {
  return (
    <Router>
          <Switch>
            <Route exact path="/" component={Login} />
            <Route path="/userpanel" component={UserPanel} />
            <Route path="/adminpanel" component={AdminPanel} />
            <Route strict path="/marriage/event/:id" component={Mevent}/>
            <Route exact path="/updateUsers" component={UpdateUsers} />
            <Route exact path="/manageEvents" component={ManageEvents} />
            <Route component={NotFound} />
          </Switch>
    </Router> 
  );
}

export default App;
