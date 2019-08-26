import React from 'react';
import IStoreContext from '~interfaces/StoreContext';
import StoreContext from '~contexts/store';

export default function withStore(PassedComponent: React.ComponentType<any>) {
  return function (props: any) {
    return (
      <StoreContext.Consumer>
        {(contextProps: IStoreContext) => <PassedComponent {...props} {...contextProps} />}
      </StoreContext.Consumer>
    );
  };
}
