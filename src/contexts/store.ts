import React from 'react';
import IStoreContext from '~interfaces/StoreContext';

export default React.createContext({
  store: {},
  setStore: () => {},
  deleteStoreKey: () => undefined
} as IStoreContext);
