import { ipcRenderer } from 'electron';


export default async function getDependencyDocs(dependencyPath: string): Promise<string> {
  ipcRenderer.send('GET_DEPENDENCY_README', { dependencyPath });

  return new Promise(resolve => {
    ipcRenderer.on('RETURN_DEPENDENCY_README', (event, arg) => resolve(arg.html));
  });
}
