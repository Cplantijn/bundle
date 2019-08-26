import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import WithStore from '~components/WithStore';
import ProjectHeader from '~components/ProjectHeader';
import DependencyList from '~components/DependencyList';

import IStoreContext from '~interfaces/StoreContext';
import './ProjectPage.scss';

type IProjectProps = RouteComponentProps & IStoreContext;

class ProjectPage extends React.PureComponent<IProjectProps> {
  getProject = () => {
    const { store, match: { params } } = this.props;
    return store.projects.find(project => project.id === (params as any).projectId) || null;
  };

  render() {
    const project = this.getProject();
    if (!project) return null;

    return (
      <div className="project-page">
        <ProjectHeader project={project} />
        <div className="project-page-main">
          <DependencyList project={project} />
        </div>
      </div>
    );
  }
}

export default WithStore(ProjectPage);
