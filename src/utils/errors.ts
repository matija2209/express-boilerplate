import dotenv from 'dotenv'
import {logger} from '../lib/winston'
import { NextFunction, Request, Response } from 'express'
dotenv.config()

export const logError =  (err:any, req:Request, res:Response, next:NextFunction)=> {
    logger.error(`${err.name} — ${err.message} — ${req.originalUrl}`,{err})
    return next(err)
}

export const returnError =  (err:any, req:Request, res:Response, next:NextFunction)=> {
    const code = err?.errorInfo?.code
    const message = err?.errorInfo?.message
    
    // Special Firebase error
    if (code === 'auth/id-token-expired') {
        return res.status(401).json({name:code,message})
    }

    return res.status(err.statusCode || 500).json({message:err.message,name:err.name,statusCode:err.statusCode,missingValues:err?.missingValues})
}



export class IncompleteRequest extends Error {
    missingValues:object
    constructor(message:string,missingValues:{type:string,value:string}[]){
        super()
        this.name = "IncompleteRequest"
        this.message = message
        this.missingValues = missingValues
        Object.setPrototypeOf(this, IncompleteRequest.prototype);
    }
}

export class CannotGetFirebaseUserByEmail extends Error {
    constructor(email:string){
        super()
        this.name = "CannotGetFirebaseUserByEmail"
        this.message = `email ${email} not found in Firebase`
        Object.setPrototypeOf(this, CannotGetFirebaseUserByEmail.prototype);
    }
}

export class MissingFunArgs extends Error {
    missingArgs:string[]
    constructor(missingValues:string) {
        super()
        this.name = "MissingFunArgs"
        this.message = `Missing values for the following arguments: ${missingValues}`
        this.missingArgs = missingValues ? missingValues.split(",") : []
        Object.setPrototypeOf(this, MissingFunArgs.prototype);
    }
}


export class RedisError extends Error {
    constructor(error:any){
        super()
        this.name = "RedisError"
        this.message = error.message
        Object.setPrototypeOf(this, RedisError.prototype);
    }
}

// STRIPE

export class CannotCreateStripeCard extends Error {
    constructor(message:string){
        super()
        this.name = "CannotCreateStripeCard"
        this.message = message
        Object.setPrototypeOf(this,CannotCreateStripeCard.prototype)
    }
}

export class CannotDeleteStripeCard extends Error {
    constructor(message:string){
        super()
        this.name = "CannotDeleteStripeCard"
        this.message = message
        Object.setPrototypeOf(this,CannotDeleteStripeCard.prototype)
    }
}