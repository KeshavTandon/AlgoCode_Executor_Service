import CodeExecutorStrategy, { ExecutionResponse } from "../types/CodeExecutorStrategy";
import { JAVA_IMAGE } from "../utils/constants";
import createContainer from "./containerFactory";
import { fetchDecodedStream } from "./dockerHelper";
import pullImage from "./pullImage";

class JavaExecutor implements CodeExecutorStrategy {

    async execute(code: string, inputTestCase: string): Promise<ExecutionResponse> {

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
    await pullImage(JAVA_IMAGE);

    const loggerStream=await javaDockerContainer.logs({
        stdout:true,
        stderr:true,
        timestamps:false,
        follow:true   //whether the logs are streamed or returned as a string. for real-time log monitoring
    });

    loggerStream.on('data',(chunk)=>{
        rawLogBuffer.push(chunk);
    });

    try {
        const codeResponse :string = await fetchDecodedStream(loggerStream,rawLogBuffer);
        return {output:codeResponse,status:"COMPLETED"};
    } catch (error) {
        return {output:error as string ,status:"ERROR"};
    } finally{
        await javaDockerContainer.remove();
    }

    }
}

export default JavaExecutor;