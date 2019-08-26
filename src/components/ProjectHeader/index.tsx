import React from 'react';
import Icon from '@mdi/react';
import { mdiFolderOpen } from '@mdi/js';
import Typography from '@material-ui/core/Typography';
import IProject from '~interfaces/Project';

import './ProjectHeader.scss';

interface IProjectHeaderProps {
  project: IProject;
}

export default class ProjectHeader extends React.PureComponent<IProjectHeaderProps> {
  render() {
    return (
      <div className="project-header">
        <div className="project-title">
          <Typography variant="h4">{this.props.project.name}</Typography>
          <div className="header-path">
            <Icon path={mdiFolderOpen} size={1} />
            <Typography variant="body2">{this.props.project.path}</Typography>
          </div>
        </div>
      </div>
    );
  }
}
