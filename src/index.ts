import express from "express";

import serverConfig from "./config/serverConfig";
import apiRouter from "./routes";

const app = express();

app.use('/api',apiRouter); //attaching the middleware to the '/api'

app.listen(serverConfig.PORT, () => {
  console.log(`Server started at PORT: ${serverConfig.PORT}`);
});
