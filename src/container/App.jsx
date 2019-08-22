import React from 'react';
import '../styles/base.scss';
import StoreProvider from '~components/StoreProvider';
import ProjectNavigator from '~components/ProjectNavigator';

export default class App extends React.PureComponent {
  render() {
    return (
      <StoreProvider>
        <div className="app-container">
          <ProjectNavigator />
        </div>
      </StoreProvider>
    );
  }
}
