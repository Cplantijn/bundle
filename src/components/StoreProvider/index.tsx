import React from 'react';
import Store from 'electron-store';
import StoreContext from '~contexts/store';
import IAppStore from '~interfaces/AppStore';

interface IStoreProviderState {
  store: IAppStore;
}

export default class StoreProvider extends React.PureComponent<{}, IStoreProviderState> {
  electronStore = new Store();

  state = {
    store: {
      projects: []
    }
  };

  componentDidMount() {
    this.electronStore.onDidAnyChange(this.handleStoreChanged);
    this.setState({
      store: this.electronStore.store as any
    });
  }

  handleStoreChanged = (newValue: unknown) => this.setState({ store: newValue as IAppStore });

  getStore = (keyPath: string) => this.electronStore.get(keyPath);

  setStore = (keyPath: string, value: string) => this.electronStore.set(keyPath, value);

  deleteStoreKey = (keyPath: string) => this.electronStore.delete(keyPath);

  render() {
    return (
      <StoreContext.Provider value={{
        store: this.state.store,
        setStore: this.setStore,
        deleteStoreKey: this.deleteStoreKey
      }}
      >
        {this.props.children}
      </StoreContext.Provider>
    );
  }
}
