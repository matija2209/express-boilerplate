import axios,{AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse, HeadersDefaults} from "axios";
import dotenv from 'dotenv'

type MakeApiRequest = <T = any>(endpoint:string,opts:AxiosRequestConfig)=>Promise<AxiosResponse<T>>
export const makeApiRequest:MakeApiRequest = async (endpoint,opts) => {
    
    if (!endpoint) throw new Error("No endpoint provided in the request!");
    const env = process.env.NODE_ENV
 
    
    const fullUrl = "https://api1.pushbackbuster.com/"+endpoint

    const config:AxiosRequestConfig = {
        url:fullUrl,
        method:opts?.method ? opts.method : "get",
        ...opts
    }
    try {
        const response = await axios(config);
        return response;
    } catch (err:any){
        const errorName = err.response?.data?.name ?? "Unknown Error"
        const errorMessage = err.response?.data?.message ?? "Cannot provide any details at this time. Please try again later."
        throw Error(`Error on external API: ${err.name} - ${err.message}`)
    }
};

dotenv.config()
