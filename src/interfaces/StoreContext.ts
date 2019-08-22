import IAppStore from '~interfaces/AppStore';

export default interface StoreContext {
  store: IAppStore;
  setStore(k: string, v: any): void;
  deleteStoreKey(k: string): void;
}