/* eslint no-param-reassign: ["error", { "props": false }] */

import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router';

export const RouteWithStatus = ({ code, children }) => (
  <Route
    render={({ staticContext }) => {
      if (staticContext) {
        staticContext.status = code;
      }
      return children;
    }}
  />
);

RouteWithStatus.propTypes = {
  code: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired
};

export const RedirectWithStatus = ({ from, to, status }) => (
  <Route
    render={({ staticContext }) => {
      // there is no `staticContext` on the client, so
      // we need to guard against that here
      if (staticContext) {
        staticContext.status = status;
      }

      return (
        <Redirect from={from} to={to} />
      );
    }}
  />
);

RedirectWithStatus.propTypes = {
  from: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  status: PropTypes.number.isRequired
};


const SwitchRoute = ({
  path,
  component: Component,
  exact,
  status
}) => (
  <Route
    path={path}
    exact={exact}
    render={() => (
      <RouteWithStatus code={status}>
        <Component />
      </RouteWithStatus>
    )}
  />
);

SwitchRoute.propTypes = {
  component: PropTypes.func.isRequired,
  path: PropTypes.string,
  exact: PropTypes.bool,
  status: PropTypes.number
};

SwitchRoute.defaultProps = {
  path: '*',
  exact: false,
  status: 200
};

export default SwitchRoute;
