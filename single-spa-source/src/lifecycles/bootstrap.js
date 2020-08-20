import {BOOTSTRAPPING, NOT_BOOTSTRAPPED, NOT_MOUNTED} from '../applications/app.helper';

/**
 * 加载应用
 * @param app
 * @returns {Promise<*>}
 */
export async function toBootstrapPromise(app) {
  if (app.status !== NOT_BOOTSTRAPPED) {
    return app;
  }
  app.status = BOOTSTRAPPING;
  await app.bootstrap(app.customerProps);
  app.status = NOT_MOUNTED;
  return app;
}
