import React from 'react';
import PropTypes from 'prop-types';
import { I18nextProvider } from 'react-i18next';
import Routes from 'shared/routes';
import '../assets/css/main.scss';

const Layout = props => (
  <I18nextProvider i18n={props.i18n}>
    <div id="root">
      <div className="wrap">
        <Routes />
      </div>
    </div>
  </I18nextProvider>
);

Layout.propTypes = {
  i18n: PropTypes.shape({ t: PropTypes.func.isRequired }).isRequired
};

export default Layout;
