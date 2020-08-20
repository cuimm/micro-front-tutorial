import {MOUNTED, NOT_MOUNTED, UNMOUNTING} from '../applications/app.helper';

/**
 * 卸载应用
 * @param app
 * @returns {Promise<*>}
 */
export async function toUnmountPromise(app) {
  if (app.status !== MOUNTED) {
    return app;
  }
  app.status = UNMOUNTING;
  await app.unmount(app.customerProps);
  app.status = NOT_MOUNTED;
  return app;
}
