import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Store from './stores/globalStore'

/* Material-UI */
import { Container, CssBaseline } from '@material-ui/core';

/* Pages Component */
import Home from './pages/Home/Home'
import Profile from './pages/Profile/Profile'
import Connect from './pages/Connect/Connect'
import Statistics from './pages/AdminPanel/Statistics/Statistics'
import ManageVacations from './pages/AdminPanel/ManageVacations/ManageVacations'
import ManageOrders from './pages/AdminPanel/ManageOrders/ManageOrders'
import ManageUsers from './pages/AdminPanel/ManageUsers/ManageUsers'

/* Componenets */
import Navbar from './components/Nav/Nav'


const App = () => {
  return (
    <Store>
      <Router>

        <Navbar />

        <CssBaseline />
        <Container component='main' maxWidth="lg">
          <Switch>

            <Route path="/Login" component={(props) => <Connect formType='login' {...props} />} />
            <Route path="/Register" component={(props) => <Connect formType='register' {...props} />} />
            
            <Route path="/ManageUsers" component={ManageUsers} />
            <Route path="/ManageOrders" component={ManageOrders} />
            <Route path="/ManageVacations/:id" component={ManageVacations} />
            <Route path="/ManageVacations" component={ManageVacations} />
            <Route path="/Statistics" component={Statistics} />
            <Route path="/Profile" component={Profile} />
            <Route path="/" component={Home} />

          </Switch>
        </Container>

      </Router>
    </Store>
  );
}

export default App;
