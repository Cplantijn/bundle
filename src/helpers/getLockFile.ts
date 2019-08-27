import fs from 'fs';
import path from 'path';
import util from 'util';
import * as lockFileParser from '@yarnpkg/lockfile';

export default async function getLockFile(projectPath: string) {
  const promiseReadFile = util.promisify(fs.readFile);
  return lockFileParser.parse(await promiseReadFile(path.resolve(projectPath, 'yarn.lock'), 'utf-8'));
}
