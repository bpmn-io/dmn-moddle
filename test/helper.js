import fs from 'fs';

import SimpleDmnModdle from '../lib';

export function ensureDirExists(dir) {

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}

export function readFile(filename) {
  return fs.readFileSync(filename, { encoding: 'UTF-8' });
}

export function createModdle(additionalPackages, options) {
  return new SimpleDmnModdle(additionalPackages, options);
}
