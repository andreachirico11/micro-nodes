import { rm, rmdirSync, rmSync, rmdir } from 'fs';
import { log_error } from 'micro-nodes-shared';

export default function (filePath: string, folderPath?: string) {
  try {
    rmSync(filePath, { force: true });
    if (!!folderPath) rmdirSync(folderPath);
    return true;
  } catch (error) {
    log_error(error, 'FILE DELETE FUNCTION ERROR');
    return false;
  }
}
export async function deleteFileFsAsync(filePath: string, folderPath?: string) {
  try {
    await promisifyThings(rm, filePath);
    if (!!folderPath) promisifyThings(rmdir, folderPath);
    return true;
  } catch (error) {
    log_error(error, 'FILE DELETE FUNCTION ERROR');
    return false;
  }
}

function promisifyThings(fnToApply, fnArg) {
  return new Promise((res, rej) => {
    fnToApply(fnArg, (err) => {
      if (!!err) rej(err);
      else res(true);
    });
  });
}
