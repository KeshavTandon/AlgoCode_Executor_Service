import express from "express";

import serverConfig from "./config/serverConfig";
import sampleQueueProducer from "./producers/sampleQueueProducer";
import apiRouter from "./routes";
import SampleWorker from "./workers/sampleWorker";

const app = express();

app.use('/api',apiRouter); //attaching the middleware to the '/api'

app.listen(serverConfig.PORT, () => {
  console.log(`Server started at PORT: ${serverConfig.PORT}`);

  SampleWorker('SampleQueue');

  sampleQueueProducer('SampleJob',{
    name:"Keshav",
    college:"ABESEC",
    interests:"ProblemSolving"
  });
});
