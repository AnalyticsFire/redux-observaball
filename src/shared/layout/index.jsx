import React from 'react';
import Routes from 'shared/routes';
import '../assets/css/main.scss';

const Layout = _props => (
  <div id="root">
    <div className="wrap">
      <Routes />
    </div>
  </div>
);

Layout.propTypes = {};

export default Layout;
