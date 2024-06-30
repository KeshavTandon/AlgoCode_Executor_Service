import bodyParser from "body-parser";
import express from "express";

import bullBoardAdapter from "./config/bullBoardConfig";
import serverConfig from "./config/serverConfig";
import submissionQueueProducer from "./producers/submissionQueueProducer";
// import sampleQueueProducer from "./producers/sampleQueueProducer";
import apiRouter from "./routes";
import { submission_queue } from "./utils/constants";
import SampleWorker from "./workers/sampleWorker";
import SubmissionWorker from "./workers/submissionWorker";


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
  SubmissionWorker(submission_queue);
  

  // sampleQueueProducer('SampleJob',{
  //   name:"Keshav",
  //   college:"ABESEC",
  //   interests:"ProblemSolving"
  // });

  const code = `
  #include<bits/stdc++.h>
  using namespace std;
  int main()
  {
    int x;
    cin>>x;
    for(int i=0;i<x;i++)
      {
        cout << i << " ";
      }
      cout << endl;
  }
`;

const inputCase = `10`;

submissionQueueProducer({"1234":{
  language:"CPP",
  inputCase,
  code
}});

  // runCpp(code, inputCase);
});
