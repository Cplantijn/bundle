import fs from 'fs';
import path from 'path';
import util from 'util';

export default async function getPackageFile(projectPath: string) {
  const promiseReadFile = util.promisify(fs.readFile);
  return JSON.parse(await promiseReadFile(path.resolve(projectPath, 'package.json'), 'utf-8'));
}
