import { BASE_URL, PORT } from './configs/Envs';
import { configApp, log_error, log_fatal, log_info } from 'micro-nodes-shared';
import * as express from 'express';
import { Application } from 'express';
import initSequelize from './configs/sequelize';
import { staticFileInfoInitInit } from './model/StaticFileInfo';
import { pingTestInit } from './model/PingTest';
import router from './configs/routes';



(async function () {
  let app: Application;

  try {
    app = configApp(express(), BASE_URL, router);
  } catch (e) {
    log_error(e, 'Error Configuring Express');
  }

    try {
      await initSequelize(pingTestInit, staticFileInfoInitInit);
      log_info('Connected to Db');
    } catch (e) {
      log_error(e, 'Error with Database Connection');
    }


  app
    .listen(PORT, () => {
      log_info('Listening on port: ' + PORT);
    })
    .on('error', err => {
      
      log_fatal(err, 'App listen Crashed');
    });
})();
