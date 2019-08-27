import React from 'react';
import idx from 'idx';
import Icon from '@mdi/react';
import { mdiArrowRight } from '@mdi/js';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import getPackageFile from '~helpers/getPackageFile';
import getOutdated from '~helpers/getOutdated';
import getLockFile from '~helpers/getLockFile';
import IProject from '~interfaces/Project';
import IDependency from '~interfaces/Dependency';
import './DependencyList.scss';

interface IDependencyListProps {
  project: IProject;
  onDependencyChosen(d: IDependency | null): void;
  activeDependencyName: string | null;
}

interface IDependencyListState {
  dependencies: IDependency[] | null | Error;
  lockDefs: null | {[k: string]: string };
  outDatedList: null | { [k: string]: string };
}

export default class DependencyList extends React.PureComponent<
IDependencyListProps,
IDependencyListState
> {
  state = { dependencies: null, lockDefs: null, outDatedList: null };

  componentDidMount() {
    this.getProjectDependencies();
    this.getOutdatedDependencies();
  }

  componentDidUpdate(oldProps: IDependencyListProps) {
    if (this.props.project.path !== oldProps.project.path) {
      this.getProjectDependencies();
      this.getOutdatedDependencies();
      this.props.onDependencyChosen(null);
    }
  }

  getOutdatedDependencies = () => {
    this.setState({
      outDatedList: null
    }, async () => {
      try {
        const outdatedDeps = await getOutdated(this.props.project.path);

        this.setState(prevState => {
          if (Array.isArray(prevState.dependencies)) {
            return {
              ...prevState,
              outDatedList: outdatedDeps,
              dependencies: prevState.dependencies.slice().sort((a, b) => {
                if (outdatedDeps[a.name]) {
                  if (outdatedDeps[b.name]) {
                    if (a.name > b.name) return 1;
                    return -1;
                  }
                  return -1;
                }

                if (a.name > b.name) return 1;
                return -1;
              })
            };
          }

          return {
            ...prevState,
            outDatedList: outdatedDeps
          };
        });
      } catch (e) {
        // Nada
      }
    });
  };

  getProjectDependencies = () => {
    this.setState({
      dependencies: null,
      lockDefs: null
    }, async () => {
      try {
        const packageJson = await getPackageFile(this.props.project.path);
        let allDependencies: IDependency[] = [];

        if (packageJson.dependencies) {
          allDependencies = allDependencies.concat(
            this.transformDependencies(packageJson.dependencies)
          );
        }

        if (packageJson.devDependencies) {
          allDependencies = allDependencies.concat(
            this.transformDependencies(packageJson.devDependencies, true)
          );
        }

        allDependencies.sort((a, b) => {
          if (a.name > b.name) return 1;
          return -1;
        });

        const lockFile = await getLockFile(this.props.project.path);
        this.setState({ dependencies: allDependencies, lockDefs: lockFile.object });
      } catch (e) {
        this.setState({ dependencies: new Error(e.message) });
      }
    });
  };

  transformDependencies = (
    dependencies: {[name: string]: string}, isDev = false
  ): IDependency[] => Object.keys(dependencies).map(depName => ({
    name: depName,
    semVer: dependencies[depName],
    isDevDependency: isDev,
    version: '',
    canUpgrade: false,
    latestAvailableVersion: ''
  }));

  renderDependencyList = () => {
    if (!this.state.dependencies || !this.state.outDatedList) {
      return <Typography style={{ marginTop: '1rem', marginLeft: '1rem' }} variant="body2">Loading dependencies...</Typography>;
    }

    if ((this.state.dependencies as any) instanceof Error) {
      return <Typography variant="body2">{this.state.dependencies}</Typography>;
    }

    return (
      <List>
        {(this.state.dependencies! as IDependency[]).map(dep => {
          const version = idx(this.state.lockDefs, _ => (_[`${dep.name}@${dep.semVer}`]! as {[k: string]: string}).version);

          const devDepBadge = dep.isDevDependency ? (
            <span className="dependency-dev-badge">
              <Typography variant="caption">Dev</Typography>
            </span>
          ) : null;

          const canUpgrade = !!this.state.outDatedList![dep.name];

          const upgradeBadge = canUpgrade ? (
            <React.Fragment>
              <Icon path={mdiArrowRight} size={0.8} />
              <div className="dependency-badge upgrade">
                <Typography variant="button">{(this.state.outDatedList![dep.name] as {[k: string]: string}).latestAvailable}</Typography>
              </div>
            </React.Fragment>
          ) : null;

          const latest = canUpgrade
            ? (this.state.outDatedList![dep.name] as {[k: string]: string}).latestAvailable
            : version;
          const selected = this.props.activeDependencyName === dep.name;

          return (
            <ListItem
              key={dep.name}
              onClick={() => this.props.onDependencyChosen({
                ...dep,
                version: version!,
                canUpgrade,
                latestAvailableVersion: latest!
              })}
              data-selected={selected}
              button
            >
              <div className="dependency-header">
                <Typography variant="h6">
                  {dep.name}
                  <span className="versioning">{dep.semVer}</span>
                </Typography>
              </div>
              <div className="dependency-body">
                <div className="dependency-badge">
                  <Typography variant="button">{version}</Typography>
                </div>
                {upgradeBadge}
              </div>
              {devDepBadge}
            </ListItem>
          );
        })}
      </List>
    );
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
