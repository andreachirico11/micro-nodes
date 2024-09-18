import { PORT } from './configs/Envs';
import { log_error, log_fatal, log_info } from './utils/log';
import express from './configs/express';
import { Application } from 'express';
import initSequelize from './configs/sequelize';
import { staticFileInfoInitInit } from './model/StaticFileInfo';



(async function () {
  let app: Application;

  try {
    app = express();
  } catch (e) {
    log_error(e, 'Error Configuring Express');
  }

    try {
      await initSequelize(staticFileInfoInitInit);
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
