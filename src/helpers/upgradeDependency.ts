import { ipcRenderer } from 'electron';


interface IUpgradeDependencyArg {
  projectPath: string;
  dependencyName: string;
  versionToUpgrade: string;
}

export default async function upgradeDependency({ projectPath, dependencyName, versionToUpgrade }: IUpgradeDependencyArg): Promise<{ [k: string]: string }> {
  ipcRenderer.send('UPGRADE_DEPENDENCY', {
    projectPath,
    dependencyName,
    versionToUpgrade
  });

  return new Promise(resolve => {
    ipcRenderer.on('DEPENDENCY_UPGRADED', (event, arg) => resolve(arg.stdout));
  });
}
