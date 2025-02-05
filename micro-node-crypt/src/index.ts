
import { log_error, log_fatal, log_info, configApp } from 'micro-nodes-shared';
import { PORT, BASE_URL } from './configs/Envs';
import * as express from 'express';
import { Application } from 'express';
import router from './configs/routes';

(async function () {

  let app: Application;

  try {
    app = configApp(express(), BASE_URL, router);
  } catch(e) {
    log_error(e, 'Error Configuring Express');
  }

  app.listen(PORT, () => {
    log_info('Listening on port: ' + PORT);
  }).on("error", () => {
    log_fatal("App listen Crashed")
  });

})();
