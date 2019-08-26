import React from 'react';
import { Route, Switch } from 'react-router-dom';
import ProjectPage from '~components/ProjectPage';

export default class Routes extends React.PureComponent {
  render() {
    return (
      <React.Fragment>
        <Switch>
          <Route path="/project/:projectId" component={ProjectPage} />
          <Route path="/" exact render={() => <h1>ROOT</h1>} />
        </Switch>
      </React.Fragment>
    );
  }
}
