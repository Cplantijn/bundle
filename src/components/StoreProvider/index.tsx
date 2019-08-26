import React from 'react';
import Store from 'electron-store';
import StoreContext from '~contexts/store';
import IAppStore from '~interfaces/AppStore';
import IProject from '~interfaces/Project';

interface IStoreProviderState {
  store: IAppStore;
}

export default class StoreProvider extends React.Component<{}, IStoreProviderState> {
  electronStore = new Store();

  state = {
    store: {
      projects: []
    }
  };

  componentDidMount() {
    // this.electronStore.delete('projects');
    this.electronStore.onDidAnyChange(this.handleStoreChanged);
    this.setState({
      store: this.electronStore.store as any
    });
  }

  addProject = (newProject: IProject) => {
    const currentProjects = this.electronStore.get('projects') || [];
    this.setStore('projects', (currentProjects as IProject[]).concat(newProject));
  };

  handleStoreChanged = (newValue: unknown) => this.setState({ store: newValue as IAppStore });

  getStore = (keyPath: string) => this.electronStore.get(keyPath);

  setStore = (keyPath: string, value: any) => this.electronStore.set(keyPath, value);

  deleteStoreKey = (keyPath: string) => this.electronStore.delete(keyPath);

  render() {
    return (
      <StoreContext.Provider value={{
        store: this.state.store,
        setStore: this.setStore,
        deleteStoreKey: this.deleteStoreKey,
        addProject: this.addProject
      }}
      >
        {this.props.children}
      </StoreContext.Provider>
    );
  }
}
