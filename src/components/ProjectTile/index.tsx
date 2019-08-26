import React from 'react';

import './ProjectTile.scss';

interface IProjectTileProps {
  name: string;
  icon?: string;
}

export default class ProjectTile extends React.PureComponent<IProjectTileProps> {
  getInitials = () => {
    if (!this.props.name) return '?';
    const splitName = this.props.name.split(/[-_]/);

    if (splitName.length > 1) {
      return splitName.slice(0, 2).reduce((allTokens, currentChunk) => {
        if (!currentChunk) return allTokens;

        return allTokens + currentChunk[0].toUpperCase();
      }, '');
    }

    const limit = this.props.name.length > 1 ? 2 : 1;
    return this.props.name.substr(0, limit).toUpperCase();
  };

  render() {
    const firstInitials = this.getInitials();

    return (
      <div className="project-tile-badge">
        {firstInitials}
      </div>
    );
  }
}
