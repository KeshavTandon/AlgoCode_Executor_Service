import { PYTHON_IMAGE } from "../utils/constants";
import createContainer from "./containerFactory";
import decodeDockerStream from "./dockerHelper";

async function runPython(code:string, inputTestCase: string)
{

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rawLogBuffer:Buffer[]=[];
    const runCommand = `echo '${code.replace(/'/g, `'\\"`)}' > test.py && echo '${inputTestCase.replace(/'/g, `'\\"`)}' | python3 test.py`;
    console.log(runCommand);
    // const pythonDockerContainer = await createContainer(PYTHON_IMAGE, ['python3', '-c', code, 'stty -echo']); 
    const pythonDockerContainer = await createContainer(PYTHON_IMAGE, [
        '/bin/sh', 
        '-c',
        runCommand
    ]); 

    await pythonDockerContainer.start();

    console.log("started the docker container");

    const loggerStream=await pythonDockerContainer.logs({
        stdout:true,
        stderr:true,
        timestamps:false,
        follow:true   //whether the logs are streamed or returned as a string. for real-time log monitoring
    });

    loggerStream.on('data',(chunk)=>{
        rawLogBuffer.push(chunk);
    });

    loggerStream.on('end',()=>{
        console.log(rawLogBuffer);
        const completeBuffer = Buffer.concat(rawLogBuffer);
        const decodedStream = decodeDockerStream(completeBuffer);
        console.log(decodedStream);
        console.log(decodedStream.stdout);
        
        
    });

    return pythonDockerContainer;
}

export default runPython;