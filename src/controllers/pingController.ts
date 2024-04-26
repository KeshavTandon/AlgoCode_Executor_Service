import {Request,Response} from 'express';

const pingCheck=(_:Request,res:Response)=>{
    return res.status(200).json({
        message:"Ping is ok"
    });
};

export default pingCheck;