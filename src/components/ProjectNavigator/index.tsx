import React from 'react';
import util from 'util';
import path from 'path';
import fs from 'fs';
import idx from 'idx';
import Tooltip from '@material-ui/core/Tooltip';
import { remote } from 'electron';
import WithStore from '~components/WithStore';
import IStoreContextProps from '~interfaces/StoreContext';

import './ProjectNavigator.scss';

class ProjectNavigator extends React.PureComponent<IStoreContextProps> {
  browseForProject = async () => {
    const dialogResult = await remote.dialog.showOpenDialog({
      properties: ['openDirectory', 'multiSelections']
    });

    const promiseReadFile = util.promisify(fs.readFile);

    try {
      const candidateProjectPath = idx(dialogResult, _ => _.filePaths[0]);
      if (!candidateProjectPath) throw new Error('Could not process project path');

      const packageFile = JSON.parse(await promiseReadFile(path.resolve(candidateProjectPath, 'package.json'), 'utf-8'));
      const projectName = packageFile.name || candidateProjectPath.split('/')[candidateProjectPath.split('/').length - 1];

      // const existingProjects = this.props.getStore('projects') || [];
      const newProjectEntry = [{
        path: candidateProjectPath,
        name: projectName,
        icon: ''
      }];

      // this.props.setStore('projects', existingProjects.concat(newProjectEntry));
    } catch (e) {
      if (e.message.includes('ENOENT')) {
        /* eslint-disable no-alert */
        alert('Could not find `package.json` in this directory. Please pick a project directory that has a `package.json` file.');
      }
    }
  };

  drawProjectIcons = () => {
    return <p>Meow</p>;
  };

  render() {
    console.log('PROPS', this.props);

    return (
      <div className="project-navigator">
        {this.drawProjectIcons()}
        <Tooltip
          title="Add a new project"
          aria-label="add"
          placement="right"
        >
          <button
            type="button"
            onClick={this.browseForProject}
            className="project-tile add-project-tile"
          >
            <div className="project-tile-contents">
              +
            </div>
          </button>
        </Tooltip>
      </div>
    );
  }
}

export default WithStore(ProjectNavigator);
