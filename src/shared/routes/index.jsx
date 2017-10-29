import React from 'react';
import {
  Switch,
  withRouter
} from 'react-router';
import SwitchRoute from './SwitchRoute';

// Routes Components
import Home from './Home';
import NotFoundPage from './NotFoundPage';

const Routes = () => (
  <Switch>
    <SwitchRoute exact path="/" component={Home} status={301} />
    <SwitchRoute path="*" component={NotFoundPage} status={404} />
  </Switch>
);


export default withRouter(Routes);
