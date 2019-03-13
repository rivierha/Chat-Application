import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Navigation from '../Navigation';
import Signup from '../SignUp';
import SignInPage from '../SignIn';
import HomePage from '../Home';
import ChatRoom from '../ChatRoom';
import * as ROUTES from '../../constants/routes';
import { withFirebase } from '../Firebase';
import { AuthUserContext } from '../Session';
import { withAuthentication } from '../Session';

const App = () => (

  <Router>
    <div style={{"height": "100vh"}}>
    <Navigation />
      <hr />
      <Route exact path={ROUTES.SIGN_UP} component={Signup} />
      <Route exact path={ROUTES.SIGN_IN} component={SignInPage} />
      <Route exact path={ROUTES.HOME} component={HomePage} />
      <Route path={'/chat/:id'} exact component={ChatRoom} />
      </div>    
  </Router>  
  );

  export default withAuthentication(App);