import React from 'react';
import Typography from '@material-ui/core/Typography';
import getPackageFile from '~helpers/getPackageFile';
import IProject from '~interfaces/Project';
import IDependency from '~interfaces/Dependency';
import './DependencyList.scss';

interface IDependencyListProps {
  project: IProject;
}

interface IDependencyListState {
  dependencies: IDependency[] | null | Error;
}


export default class DependencyList extends React.PureComponent<
IDependencyListProps,
IDependencyListState
> {
  state = { dependencies: null };

  async componentDidMount() {
    try {
      const packageJson = await getPackageFile(this.props.project.path);
      let allDependencies = [];
      
      if (packageJson.dependencies) {
        allDependencies = allDependencies.concat(packageJson.dependencies(dep => ({
          name: dep,
          isDevDependency: false
        })));
      }

    } catch(e) {
      this.setState({ dependencies: new Error(e.message) });
    }
  }

  transformDependencies = (
    dependencies: {[name: string]: string}, isDev: boolean
  ): IDependency[] => Object.keys(dependencies).map(depName => ({
    name: depName,
    installedVersion: dependencies[depName],
    isDevDependency: isDev
  }));

  renderDependencyList = () => {
    if (!this.state.dependencies) {
      return <Typography variant="body2">Loading dependencies...</Typography>;
    }

    if ((this.state.dependencies as any) instanceof Error) {
      return <Typography variant="body2">{this.state.dependencies}</Typography>;
    }

    return null;
  };


  render() {
    return (
      <div className="dependency-list-container">
        <div className="dependency-list">
          {this.renderDependencyList()}
        </div>
      </div>
    );
  }
}
