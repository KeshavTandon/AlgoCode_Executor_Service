import CodeExecutorStrategy, { ExecutionResponse } from "../types/CodeExecutorStrategy";
import { CPP_IMAGE } from "../utils/constants";
import createContainer from "./containerFactory";
import { fetchDecodedStream } from "./dockerHelper";
import pullImage from "./pullImage";

class CppExecutor implements CodeExecutorStrategy{
    async execute(code: string, inputTestCase: string): Promise<ExecutionResponse> {
         const rawLogBuffer:Buffer[]=[];
     const runCommand = `echo '${code.replace(/'/g, `'\\"`)}' > main.cpp && g++ main.cpp -o main && echo '${inputTestCase.replace(/'/g, `'\\"`)}' | ./main`;
     
    const cppDockerContainer = await createContainer(CPP_IMAGE, [
        '/bin/sh', 
        '-c',
        runCommand
    ]); 

    await cppDockerContainer.start();

    console.log("started the docker container");
    await pullImage(CPP_IMAGE);

    const loggerStream=await cppDockerContainer.logs({
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
        await cppDockerContainer.remove();
    }
    
    }
}


export default CppExecutor;