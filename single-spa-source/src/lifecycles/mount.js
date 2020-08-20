import {MOUNTED, MOUNTING, NOT_MOUNTED} from '../applications/app.helper';

/**
 * 挂载应用
 * @param app
 * @returns {Promise<*>}
 */
export async function toMountPromise(app) {
  if (app.status !== NOT_MOUNTED) {
    return app;
  }
  app.status = MOUNTING;
  await app.mount(app.customerProps);
  app.status = MOUNTED;
  return app;
}
