import { Queue } from "bullmq";

import redisConnection from "../config/redisConfig";
console.log(redisConnection);

export default new Queue('Sample Queue',{connection:redisConnection});