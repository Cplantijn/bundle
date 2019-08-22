import React from 'react';
import IStoreContext from '~interfaces/StoreContext';
import StoreContext from '~contexts/store';

export default function withStore(PassedComponent: React.ComponentType<object>) {
  return function (props) {
    return (
      <StoreContext.Consumer>
        {(contextProps: IStoreContext) => <PassedComponent {...props} {...contextProps} />}
      </StoreContext.Consumer>
    );
  };
}
