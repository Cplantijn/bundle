import React from 'react';
import LogoWithText from '~components/SVG/LogoWithText';
import Typography from '@material-ui/core/Typography';

import './SplashPage.scss';

export default function () {
  return (
    <div className="splash-container">
      <LogoWithText />
      <Typography variant="h5">Select or add a project</Typography>
    </div>
  );
}