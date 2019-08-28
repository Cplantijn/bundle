import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import WithStore from '~components/WithStore';
import ProjectHeader from '~components/ProjectHeader';
import DependencyList from '~components/DependencyList';
import DependencyPage from '~components/DependencyPage';

import IStoreContext from '~interfaces/StoreContext';
import IDependency from '~interfaces/Dependency';

import './ProjectPage.scss';

type IProjectProps = RouteComponentProps & IStoreContext;

interface IProjectState {
  activeDependency: IDependency | null;
}

class ProjectPage extends React.PureComponent<IProjectProps, IProjectState> {
  dependencyListRef = React.createRef<DependencyList>();

  state = { activeDependency: null };

  getProject = () => {
    const { store, match: { params } } = this.props;
    return store.projects.find(project => project.id === (params as any).projectId) || null;
  };

  onDependencyChosen = (dep: IDependency | null) => this.setState({ activeDependency: dep });

  reloadAll = () => {
    if (!this.dependencyListRef.current) return;

    this.dependencyListRef.current.getProjectDependencies();
    this.dependencyListRef.current.getOutdatedDependencies();
    this.setState({ activeDependency: null });
  };

  render() {
    const project = this.getProject();
    if (!project) return null;

    const activeDepName = this.state.activeDependency
      ? (this.state.activeDependency! as IDependency).name : null;

    return (
      <div className="project-page">
        <ProjectHeader project={project} />
        <div className="project-page-main">
          <DependencyList
            ref={this.dependencyListRef}
            project={project}
            onDependencyChosen={this.onDependencyChosen}
            activeDependencyName={activeDepName}
          />
          <DependencyPage
            project={project}
            dependency={this.state.activeDependency}
            onRequestReloadAll={this.reloadAll}
          />
        </div>
      </div>
    );
  }
}

export default WithStore(ProjectPage);
