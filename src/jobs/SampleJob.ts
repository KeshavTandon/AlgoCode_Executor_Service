import { Job } from "bullmq";

import { IJob } from "../types/bullMqJobDefinition";

export default class SampleJob implements IJob{
    name:string;
    payload: Record<string, unknown> | undefined;
    constructor(payload: Record<string,unknown>){
        this.payload=payload;
        this.name=this.constructor.name;
    }

    handle=()=>{
        console.log("Handler for the job");
    };

    failed=(job?:Job)=>{
        console.log("Job failed");
        if(job)
        {
            console.log(job.id);
        }
    };
}