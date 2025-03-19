import { BASE_URL, PORT } from './configs/Envs';
import { log_error, log_fatal, log_info, configApp } from 'micro-nodes-shared';
import * as express from 'express';
import { Application } from 'express';
import { mongooseConnect } from './configs/mongoose';
import router from './configs/routes';

(async function () {
  let app: Application;

  try {
    app = configApp(express(), BASE_URL, router);
  } catch (e) {
    log_error(e, 'Error Configuring Express');
  }

  try {
    await mongooseConnect();
    log_info('Db connected');
  } catch (e) {
    log_error(e, "Can't connect to db");
  }

  app
    .listen(PORT, () => {
      log_info('Listening on port: ' + PORT);
    })
    .on('error', () => {
      log_fatal('App listen Crashed');
    });
})();
