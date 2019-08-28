import React from 'react';
import { Route, Switch } from 'react-router-dom';
import ProjectPage from '~components/ProjectPage';
import SplashPage from '~components/SplashPage';

export default class Routes extends React.PureComponent {
  render() {
    return (
      <React.Fragment>
        <Switch>
          <Route path="/project/:projectId" component={ProjectPage} />
          <Route path="/" exact component={SplashPage} />
        </Switch>
      </React.Fragment>
    );
  }
}
