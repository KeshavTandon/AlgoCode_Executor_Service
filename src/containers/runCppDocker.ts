import { CPP_IMAGE } from "../utils/constants";
import createContainer from "./containerFactory";
import decodeDockerStream from "./dockerHelper";

async function runCpp(code:string, inputTestCase: string)
{

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rawLogBuffer:Buffer[]=[];
     const runCommand = `echo '${code.replace(/'/g, `'\\"`)}' > main.cpp && g++ main.cpp -o main && echo '${inputTestCase.replace(/'/g, `'\\"`)}' | ./main`;
     
    const cppDockerContainer = await createContainer(CPP_IMAGE, [
        '/bin/sh', 
        '-c',
        runCommand
    ]); 

    await cppDockerContainer.start();

    console.log("started the docker container");

    const loggerStream=await cppDockerContainer.logs({
        stdout:true,
        stderr:true,
        timestamps:false,
        follow:true   //whether the logs are streamed or returned as a string. for real-time log monitoring
    });

    loggerStream.on('data',(chunk)=>{
        rawLogBuffer.push(chunk);
    });

    const response=await new Promise((res)=>{
        loggerStream.on('end',()=>{
        console.log(rawLogBuffer);
        const completeBuffer = Buffer.concat(rawLogBuffer);
        const decodedStream = decodeDockerStream(completeBuffer);
        console.log(decodedStream);
        console.log(decodedStream.stdout);    
        res(decodedStream);
        });
    });
    await cppDockerContainer.remove();
    return response;
 
}

export default runCpp;