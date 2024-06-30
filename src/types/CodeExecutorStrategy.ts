export default interface CodeExecutorStrategy{
    execute( code : string , inputTestCase : string ) : Promise<ExecutionResponse>;
// eslint-disable-next-line semi
};

export type ExecutionResponse={output:string,status:string};