import React from 'react';
import idx from 'idx';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IDependency from '~interfaces/Dependency';
import getDependencyDocs from '~helpers/getDependencyDocs';
import './DependencyPage.scss';

interface IDependencyPageProps {
  dependency: IDependency | null;
}

interface IDependencyPageState {
  docs: null | string;
}

export default class DependencyPage extends React.PureComponent<
IDependencyPageProps,
IDependencyPageState
> {
  state = { docs: null };

  componentDidMount() {
    if (this.props.dependency) {
      this.fetchDependencyDocs();
    }
  }

  componentDidUpdate(oldProps: IDependencyPageProps) {
    if (idx(this.props.dependency, _ => _.name) !== idx(oldProps.dependency, _ => _.name)) {
      this.fetchDependencyDocs();
    }
  }

  fetchDependencyDocs = () => {
    this.setState({
      docs: null
    }, async () => {
      if (!this.props.dependency) return;
      const html = await getDependencyDocs(`https://www.npmjs.com/package/${this.props.dependency.name}/v/${this.props.dependency.version}`);

      this.setState({
        docs: html
      });
    });
  };

  renderUpgradeBadge = () => {
    if (!this.props.dependency) return null;
    if (!this.props.dependency.canUpgrade) return null;

    return (
      <div className="upgrade-ribbon">
        <Button
          onClick={() => { }}
          variant="contained"
        >
          <span role="img" aria-label="party-popper">🎉</span>
          <span role="img" aria-label="party-popper">🎉</span>
          &nbsp;&nbsp;
          Upgrade to
          {this.props.dependency.latestAvailableVersion}
          &nbsp;&nbsp;
          <span role="img" aria-label="party-popper">🎉</span>
          <span role="img" aria-label="party-popper">🎉</span>
        </Button>
      </div>
    )
  }

  render() {
    if (!this.props.dependency) {
      return (
        <div className="dependency-page empty">
          <Typography variant="h5">Please select a dependency</Typography>
        </div>
      );
    }

    if (!this.state.docs) {
      return (
        <div className="dependency-page empty">
          <Typography variant="h5">Loading docs...</Typography>
        </div>
      );
    }

    /* eslint-disable react/no-danger */
    return (
      <div className="dependency-page">
        {this.renderUpgradeBadge()}
        <div
          className="markdown-body"
          dangerouslySetInnerHTML={{
            __html: this.state.docs! as string
          }}
        />
      </div>
    );
  }
}
