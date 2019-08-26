import IAppStore from '~interfaces/AppStore';
import IProject from '~interfaces/Project';

export default interface StoreContext {
  store: IAppStore;
  setStore(k: string, v: any): void;
  deleteStoreKey(k: string): void;
  addProject(p: IProject): void;
}
