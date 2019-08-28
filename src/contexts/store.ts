import React from 'react';
import IStoreContext from '~interfaces/StoreContext';
import IProject from '~interfaces/Project';

export default React.createContext({
  store: {},
  addProject: (p: IProject) => {},
  setStore: () => {},
  deleteStoreKey: () => undefined
} as IStoreContext);
