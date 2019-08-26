import React from 'react';
import shortId from 'shortid';
import idx from 'idx';
import Icon from '@mdi/react';
import { mdiPlus } from '@mdi/js';
import Tooltip from '@material-ui/core/Tooltip';
import { remote } from 'electron';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import getPackageFile from '~helpers/getPackageFile';
import WithStore from '~components/WithStore';
import ProjectTile from '~components/ProjectTile';
import IStoreContextProps from '~interfaces/StoreContext';

import './ProjectNavigator.scss';

type IProjectNavigatorProps = IStoreContextProps & RouteComponentProps;

class ProjectNavigator extends React.Component<IProjectNavigatorProps> {
  browseForProject = async () => {
    const dialogResult = await remote.dialog.showOpenDialog({
      properties: ['openDirectory', 'multiSelections']
    });

    try {
      const candidateProjectPath = idx(dialogResult, _ => _.filePaths[0]);
      if (!candidateProjectPath) throw new Error('Could not process project path');
      const packageFile = await getPackageFile(candidateProjectPath);
      const projectName = packageFile.name || candidateProjectPath.split('/')[candidateProjectPath.split('/').length - 1];

      const newProjectEntry = {
        id: shortId.generate(),
        path: candidateProjectPath,
        name: projectName,
        icon: ''
      };

      this.props.addProject(newProjectEntry);
    } catch (e) {
      if (e.message.includes('ENOENT')) {
        /* eslint-disable no-alert */
        alert('Could not find `package.json` in this directory. Please pick a project directory that has a `package.json` file.');
      }
    }
  };

  selectProject = (pId: string) => {
    this.props.history.push(`/project/${pId}`);
  };

  drawProjectIcons = () => {
    if (!this.props.store.projects) return null;
    const { pathname } = this.props.location;

    return this.props.store.projects.map(project => {
      let containerCls = 'project-tile-container';
      const projectMatched = pathname.includes(`/project/${project.id}`);

      if (projectMatched) {
        containerCls += ' selected';
      }

      return (
        <Tooltip
          key={project.id}
          title={project.name}
          aria-label="select"
          placement="right"
        >
          <div
            className={containerCls}
            onClick={() => this.selectProject(project.id)}
            role="button"
            tabIndex={-1}
            onKeyDown={e => {
              if (e.keyCode === 13) {
                this.selectProject(project.id);
              }
            }}
          >
            <div className="project-tile">
              <div className="project-tile-contents">
                <ProjectTile name={project.name} icon={project.icon} />
              </div>
            </div>
          </div>
        </Tooltip>
      );
    });
  };

  render() {
    return (
      <div className="project-navigator">
        {this.drawProjectIcons()}
        <Tooltip
          title="Add a new project"
          aria-label="add"
          placement="right"
        >
          <div
            className="project-tile-container"
            role="button"
            onClick={this.browseForProject}
            onKeyDown={e => {
              if (e.keyCode === 13) {
                this.browseForProject();
              }
            }}
            tabIndex={-1}
          >
            <div className="project-tile add-project-tile">
              <div className="project-tile-contents">
                <Icon path={mdiPlus} color="white" size={1} />
              </div>
            </div>
          </div>
        </Tooltip>
      </div>
    );
  }
}

export default WithStore(withRouter(ProjectNavigator));
