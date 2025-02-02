
import { log_error, log_fatal, log_info } from 'micro-nodes-shared';
import { PORT } from './configs/Envs';
import express from './configs/express';
import { Application } from 'express';

(async function () {

  let app: Application;

  try {
    app = express();
  } catch(e) {
    log_error(e, 'Error Configuring Express');
  }

  app.listen(PORT, () => {
    log_info('Listening on port: ' + PORT);
  }).on("error", () => {
    log_fatal("App listen Crashed")
  });

})();
