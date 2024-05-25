import bodyParser from "body-parser";
import express from "express";

import bullBoardAdapter from "./config/bullBoardConfig";
import serverConfig from "./config/serverConfig";
import sampleQueueProducer from "./producers/sampleQueueProducer";
import apiRouter from "./routes";
import SampleWorker from "./workers/sampleWorker";


const app = express();
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(bodyParser.text());

app.use('/api',apiRouter); //attaching the middleware to the '/api'
app.use('/dashboard', bullBoardAdapter.getRouter());

app.listen(serverConfig.PORT, () => {
  console.log(`Server started at PORT: ${serverConfig.PORT}`);
  console.log(`BullBoard is running on: http://localhost:${serverConfig.PORT}/dashboard`);

  SampleWorker('SampleQueue');

  sampleQueueProducer('SampleJob',{
    name:"Keshav",
    college:"ABESEC",
    interests:"ProblemSolving"
  });
});
