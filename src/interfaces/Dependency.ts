export default interface Dependency {
  semVer: string;
  name: string;
  isDevDependency: boolean;
  version: string;
  canUpgrade: boolean;
  latestAvailableVersion: string;
}
