import CodeExecutorStrategy, { ExecutionResponse } from "../types/CodeExecutorStrategy";
import { PYTHON_IMAGE } from "../utils/constants";
import createContainer from "./containerFactory";
import { fetchDecodedStream } from "./dockerHelper";
import pullImage from "./pullImage";

class PythonExecutor implements CodeExecutorStrategy{
    async execute(code: string, inputTestCase: string): Promise<ExecutionResponse> {
        
    const rawLogBuffer:Buffer[]=[];
    const runCommand = `echo '${code.replace(/'/g, `'\\"`)}' > test.py && echo '${inputTestCase.replace(/'/g, `'\\"`)}' | python3 test.py`;
    console.log(runCommand);
    
    const pythonDockerContainer = await createContainer(PYTHON_IMAGE, [
        '/bin/sh', 
        '-c',
        runCommand
    ]); 

    await pythonDockerContainer.start();
 
    console.log("started the docker container");
    await pullImage(PYTHON_IMAGE);

    const loggerStream=await pythonDockerContainer.logs({
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
        await pythonDockerContainer.remove();
    }

    
    }
}

export default PythonExecutor;