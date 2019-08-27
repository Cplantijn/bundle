import { ipcRenderer } from 'electron';

export default async function getOudated(projectPath: string): Promise<{ [k: string]: string }> {
  ipcRenderer.send('GET_OUTDATED', { projectPath });

  return new Promise(resolve => {
    ipcRenderer.on('RETURN_OUTDATED', (event, arg) => resolve(arg.upgrades));
  });
}
