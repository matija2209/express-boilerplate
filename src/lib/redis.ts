import { RedisError } from '../utils/errors';
import { createClient } from 'redis';
import { logger } from './winston';

export const getRedisClient = async ()=> {
    const client = createClient({
        password:process.env.REDIS_URI_PASS,
        socket:{
            host:process.env.REDIS_IP_HETNZER as string,
            port:process.env.REDIS_PORT_HETNZER as unknown as number
        }
      });
    
    client.on('error', err => {
        logger.error("redis connection failed",{err})
        // throw new RedisError(err)
    });
    client.on('connect', () => logger.debug("redis connected"));
    client.on('reconnecting', () => logger.debug("redis reconnecting"));
    client.on('ready', () => logger.debug("redis ready"));

    await client.connect();

    return client;
}


// https://flaviocopes.com/how-to-use-redis-nodejs/
type SetTokenRedis = (integration:string,uid:string,type:string,value:string)=>Promise<void>
export const setTokensRedis:SetTokenRedis = async (integration,uid,type,value)=>{
    const RedisClient = await getRedisClient()

    const query = `${uid}-${integration}-${type}-token`

    await RedisClient.setEx(query,30*60,value) // Added automatic expiry date
    await RedisClient.expire(query, 1800,)
    RedisClient.quit();
    return
}

type tokenType = "access" | "refresh"

type GetTokensRedis = (integration:string,uid:string,type:tokenType)=>Promise<string>
export const getTokensRedis:GetTokensRedis = async (integration,uid,type:tokenType)=>{
    if (!uid || !integration || !type) throw new Error("Missing parameters for getTokensRedis")
    const RedisClient = await getRedisClient()
    try {
        const isToken = await RedisClient.get(`${uid}-${integration}-${type}-token`)
        return isToken as string
    } finally {
        RedisClient.quit();
    }
}
type DeleteTokensRedis = (integration:string,uid:string,type:tokenType)=>Promise<void>
export const deleteTokensRedis:DeleteTokensRedis = async (integration,uid,type:tokenType)=>{
    const RedisClient = await getRedisClient()
    await RedisClient.del(`${uid}-${integration}-${type}-token`)
    RedisClient.quit();
    return 
}
