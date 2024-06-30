import { JAVA_IMAGE } from "../utils/constants";
import createContainer from "./containerFactory";
import decodeDockerStream from "./dockerHelper";

async function runJava(code:string, inputTestCase: string)
{

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rawLogBuffer:Buffer[]=[];
    const runCommand = `echo '${code.replace(/'/g, `'\\"`)}' > Main.java && javac Main.java && echo '${inputTestCase.replace(/'/g, `'\\"`)}' | java Main`;
    console.log(runCommand);
    // const pythonDockerContainer = await createContainer(PYTHON_IMAGE, ['python3', '-c', code, 'stty -echo']); 
    const javaDockerContainer = await createContainer(JAVA_IMAGE, [
        '/bin/sh', 
        '-c',
        runCommand
    ]); 

    await javaDockerContainer.start();

    console.log("started the docker container");

    const loggerStream=await javaDockerContainer.logs({
        stdout:true,
        stderr:true,
        timestamps:false,
        follow:true   //whether the logs are streamed or returned as a string. for real-time log monitoring
    });

    loggerStream.on('data',(chunk)=>{
        rawLogBuffer.push(chunk);
    });

    await new Promise((res)=>{
        loggerStream.on('end',()=>{
        console.log(rawLogBuffer);
        const completeBuffer = Buffer.concat(rawLogBuffer);
        const decodedStream = decodeDockerStream(completeBuffer);
        console.log(decodedStream);
        console.log(decodedStream.stdout);    
        res(decodeDockerStream);
        });
    });
    await javaDockerContainer.remove();
 
}

export default runJava;