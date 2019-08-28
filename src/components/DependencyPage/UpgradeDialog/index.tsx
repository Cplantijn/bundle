import React from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Radio from '@material-ui/core/Radio';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import cx from 'classnames';
import Typography from '@material-ui/core/Typography';
import upgradeDependency from '~helpers/upgradeDependency';

import IDependency from '~interfaces/Dependency';
import IProject from '~interfaces/Project';
import './UpgradeDialog.scss';

interface IUpgradeDialogProps {
  isOpen: boolean;
  onRequestClose(): void;
  dependency: IDependency;
  project: IProject;
  onRequestReloadAll(): void;
}

interface IUpgradeDialogState {
  currentSemVer: string;
  upgrading: boolean;
}

export default class UpgradeDialog extends React.PureComponent<
IUpgradeDialogProps,
IUpgradeDialogState
> {
  state = { currentSemVer: '', upgrading: false };

  componentDidMount() {
    this.setState({
      currentSemVer: this.getDefaultSemVer()
    });
  }

  handleClose = () => this.setState({ upgrading: false }, this.props.onRequestClose);

  getDefaultSemVer = () => {
    switch (this.props.dependency.semVer.substr(0, 1)) {
      case '^':
        return 'minor';
      case '~':
        return 'patch';
      default:
        return 'strict';
    }
  };

  handleSemverChange = e => this.setState({ currentSemVer: e.target.value });

  handleUpgrade = () => {
    this.setState({
      upgrading: true
    }, async () => {
      let caret = '';
      if (this.state.currentSemVer === 'minor') {
        caret = '^';
      } else if (this.state.currentSemVer === 'patch') {
        caret = '~';
      }

      await upgradeDependency({
        projectPath: this.props.project.path,
        dependencyName: this.props.dependency.name,
        versionToUpgrade: `${caret}${this.props.dependency.latestAvailableVersion}`
      });

      this.handleClose();
      this.props.onRequestReloadAll();
    });
  };

  renderRadioGroup = () => {
    if (this.state.upgrading) {
      return (
        <div style={{ width: '100%', textAlign: 'center' }}>
          <Typography variant="h4">Upgrading...</Typography>
        </div>
      );
    }

    return (
      <RadioGroup
        aria-label="semver"
        className="semver-radio-group"
        value={this.state.currentSemVer}
        onChange={this.handleSemverChange}
        row
      >
        <FormControlLabel
          value="minor"
          control={<Radio color="primary" />}
          label={
            <Typography variant="subtitle2">Minor</Typography>
          }
          labelPlacement="bottom"
        />
        <FormControlLabel
          value="patch"
          control={<Radio color="primary" />}
          label={
            <Typography variant="subtitle2">Patch</Typography>
          }
          labelPlacement="bottom"
        />
        <FormControlLabel
          value="strict"
          control={<Radio color="primary" />}
          label={
            <Typography variant="subtitle2">Strict</Typography>
          }
          labelPlacement="bottom"
        />
      </RadioGroup>
    );
  };

  getCaret = () => {
    if (this.state.currentSemVer === 'minor') {
      return <span className="minor">^</span>;
    }

    if (this.state.currentSemVer === 'patch') {
      return <span className="patch">~</span>;
    }

    return '';
  };

  renderVersioning = () => {
    const caret = this.getCaret();

    const labelCls = cx({
      minor: this.state.currentSemVer === 'minor',
      patch: this.state.currentSemVer === 'patch',
    }, 'version-to-upgrade');

    return (
      <div className={labelCls}>
        <Typography variant="subtitle1">{caret}{this.props.dependency.latestAvailableVersion}</Typography>
      </div>
    );
  };

  renderDialogActions = () => (
    <DialogActions>
      <Button
        disabled={this.state.upgrading}
        onClick={this.handleClose}
      >
        Close
      </Button>
      <Button
        disabled={this.state.upgrading}
        onClick={this.handleUpgrade}
        className="upgrade-confirm"
      >
        Upgrade
      </Button>
    </DialogActions>
  )

  render() {
    return (
      <Dialog
        open={this.props.isOpen}
        onClose={() => {
          if (!this.state.upgrading) {
            this.handleClose();
          }
        }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Upgrade {this.props.dependency.name}</DialogTitle>
        {this.renderRadioGroup()}
        {this.renderVersioning()}
        {this.renderDialogActions()}
      </Dialog>
    );
  }
}
