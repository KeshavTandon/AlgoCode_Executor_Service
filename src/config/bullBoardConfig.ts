import { createBullBoard } from "@bull-board/api";
import {BullMQAdapter} from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";

import SampleQueue from "../queues/SampleQueue";
import SubmissionQueue from "../queues/SubmissionQueue";

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/dashboard');

createBullBoard({
    queues: [new BullMQAdapter(SampleQueue),new BullMQAdapter(SubmissionQueue)],
    serverAdapter,
});

export default serverAdapter;
