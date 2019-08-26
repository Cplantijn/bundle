import React from 'react';
import { HashRouter } from 'react-router-dom';

import Routes from '~components/Routes';
import StoreProvider from '~components/StoreProvider';
import ProjectNavigator from '~components/ProjectNavigator';

import '../styles/base.scss';

export default class App extends React.PureComponent {
  render() {
    return (
      <StoreProvider>
        <HashRouter>
          <div className="app-container">
            <ProjectNavigator />
            <div className="main-content-container">
              <Routes />
            </div>
          </div>
        </HashRouter>
      </StoreProvider>
    );
  }
}
