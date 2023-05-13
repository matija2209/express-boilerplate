import { CannotFetchScrapeDoAPI, CannotMakeApi2Request, InvalidUrl, WebsiteNotProvided } from "./errors";
import { HIGH_SEVERITY, LOW_SEVERITY, MEDIUM_SEVERITY, NOTIFICATION_SEO_IMAGE, NOTIFICATION_SEO_ONPAGE, NOTIFICATION_SITEMAP_CHANGE, OPPORTUNITIES, WARNINGS } from "./constants";

import { Blob, Buffer} from 'buffer'
import {NoTokenDataProvidedWithRequest} from "./errors";
import _ from "lodash";
import axios from "axios";
import dotenv from 'dotenv'
import { getAuth } from "firebase-admin/auth";
import jwt from 'jsonwebtoken'
import moment from "moment";

export const delay = (ms:number) => new Promise(res => setTimeout(res, ms));
export const compose = (f:any,g:any) => (...args:any) => f(g(...args))

export const composeReducer = (...fns:any)=>{
    return fns.reduce(compose)
}

export const DEFAULT_NOTIFICATION_PREFERENCES = {
    email:{
        updates:true,
        [WARNINGS] : {severity:[HIGH_SEVERITY,MEDIUM_SEVERITY,LOW_SEVERITY]},
        [OPPORTUNITIES] : {severity:[HIGH_SEVERITY,MEDIUM_SEVERITY,LOW_SEVERITY]},
        active:true
        
    },
    hubspot:{
        [WARNINGS] : {severity:[HIGH_SEVERITY,MEDIUM_SEVERITY,LOW_SEVERITY]},
        [OPPORTUNITIES] : {severity:[HIGH_SEVERITY,MEDIUM_SEVERITY,LOW_SEVERITY]},
        active:true
        
    },
    slack:{
        [WARNINGS] : {severity:[HIGH_SEVERITY,MEDIUM_SEVERITY,LOW_SEVERITY]},
        [OPPORTUNITIES] : {severity:[HIGH_SEVERITY,MEDIUM_SEVERITY,LOW_SEVERITY]},
        active:true
        
    },
}


export const prepareLinks = (...fns)=>{
    return fns.reduce(compose)
}

export const extractDomainFromWebsite = (website)=>{
    if (!website) throw new WebsiteNotProvided()
    try {
         let domain = (new URL(website)).hostname
         domain = domain.replace("www.","")
         return domain
    } catch (error:any){
        throw new Error("domain could not be extracted.")
    }
}

export const monitor = (req,res,next)=>{
    console.log(`${req.method} request sent from: ${req.originalUrl}`);
    return next()
}
export const isUrl = string => {
    try {
        return Boolean(new URL(string)); 
    }
    catch(e:any){
        throw new InvalidUrl()
    }
}

export const checkConvertObjectArray = <T>(input):T[] =>{
    let array:T[] = []
    if (!Array.isArray(input) && typeof input === "object") {
        array.push(input)
    } else if (Array.isArray(input)) {
        array = input
    }
    return array
}

export const checkWebsiteValidity = async (link)=>{
    
    const url = "http://api.scrape.do/"
    const params = {
        Render:false,
        Token:"cc5bc3ebec3a411d9e3fff61797535d7171c16b044d",
        Url:link
    }
    const config = {
        url,
        params,
        method:"get"
    }

    try {
        await axios(config)
        return true
    } catch (error:any) {
        if (error.response.status === 400){
            return false
        }
        throw new CannotFetchScrapeDoAPI("cannot fetch ")
    }
}

export const decodeBase64 = (req,res,next) => {
    try {
        let data = req.params.encodedString;
        if (!data) next(new Error("No encoded string to decode"))
        let buff = new Buffer(data, 'base64');
        let decodedString = buff.toString('ascii');
        req.body.decodedString = decodedString
        next()
    } catch (error:any) {
        next(error)
    }
}


dotenv.config()


export const additionalArrayManipulation = (productPagesMatches,minScore,domain,uid)=>{
    let urlsArray
    urlsArray = appendKeyValueToArray("uid",uid,productPagesMatches)
    urlsArray = appendKeyValueToArray("domain",domain,urlsArray)
    urlsArray = filterArrayByKeyValueGreater("totalScore",minScore,urlsArray)
    urlsArray = createCustomIdWithUrlUid(uid,urlsArray)
    return urlsArray
}

export const createCustomIdWithUrlUid = (value,array) => {
    return array.map(page=>{
        return {
            ...page,
            "_customId":`${page.url}-${value}`
        }
    })
}


export const SOCIAL_MEDIA_NAMES = "pintrest|facebook|twitter|linkedin|youtube|snapchat|tiktok|instagram|trustpilot|xing"

export const getTodayDate = () =>  moment().startOf("day").toDate()

export const getPastDate = (daysPast) => moment().startOf("day").subtract(daysPast,"days").toDate()

export const convertObjectArray = <T,>(input:T|T[]):T[] =>{
    let array:any = []
    if (!Array.isArray(input) && typeof input === "object") {
        array.push(input)
    } else if (Array.isArray(input)) {
        array = input
    }
    return array
}

export const appendMultiplePairsToArray = (keys,values,array)=>{
    let result = array
    for (const [index, key] of keys.entries()) {
        result = appendKeyValueToArray(key,values[index],result)
    }
    return result
}

export const appendKeyValueToArray = (key,value,array)=>{
    return array.map(page=>{return{...page,[key]:value}})
}

export const filterArrayByKeyValueGreater = (key,criteria,array)=>{
    return array.filter(element=>element[key] >= criteria)
}

export const mergeTwoArrays = (array1,array2)=>{
    const combined = [...array1, ...array2]
    return combined
}

export const deduplicateArrayByKey = (array,key)=>{
    return _.uniqBy(array,key)
}

export const createApiAccessToken = data => {
    if (!data) throw new NoTokenDataProvidedWithRequest()
    const token = jwt.sign(data, process.env.API_SECRET as string);
    return token
}

// https://stackoverflow.com/questions/70050001/javascript-how-to-compose-asynchronous-functions
const asyncCompose = (f, g) => async (...args) => f(await g(...args))

export const asyncComposeReducer = (...fns) => fns.reduce(asyncCompose)

export const getArrayIdsWhatever = (array,key="id"):Array<string|number>=>{
    if (!Array.isArray(array)) throw new Error("Input is not an array")

    if (typeof array[0] !== "string" && typeof array[0] !== "number") {
        var ids = array.map(product=>product[key])
    } else {
        var ids = array
    }
    return ids
}

export const decodeBase64String = encoded => {
    return (new Buffer(encoded, 'base64',)).toString('utf8');
}


export const reduceArray = <T,>(array:T[],perChunk:number):T[][]=>{
    return array.reduce((resultArray:any, item, index) => { 
        const chunkIndex = Math.floor(index/perChunk)
      
        if(!resultArray[chunkIndex]) {
          resultArray[chunkIndex] = [] // start a new chunk
        }
      
        resultArray[chunkIndex].push(item)
      
        return resultArray
      }, [])

}

export const cleanBaseUrl = (website:string) => {
    return new URL(website).origin.replace(/\/$/,"")
}

export const blobToBytea = async(blob:Blob)=>{
    const x = await blob.arrayBuffer()
    const buffer = Buffer.from(x as any, "binary")
    return buffer
}

export async function getBase64ImageFromUrl(imageUrl:string|undefined) {
    if (!imageUrl) return null
    var res = await fetch(imageUrl);
    var blob = await res.blob();
    var buffer = await blob.arrayBuffer();
    buffer = Buffer.from(buffer)
    return buffer
    // return new Promise((resolve, reject) => {
    //   var reader  = new FileReader();
    //   reader.addEventListener("load", function () {
    //       resolve(reader.result);
    //   }, false);
  
    //   reader.onerror = () => {
    //     return reject();
    //   };
    //   reader.readAsDataURL(blob);
    // })
  }

export const convertBlobToBase64 = <T,>(data:T,imageKey)=>{
    const blob = data[imageKey]
    if (!blob) return data
    else {
        const buffer = new Buffer( blob );
        var bufferBase64 = buffer.toString('base64');
        const retailerRow = {...data,[imageKey]:bufferBase64}
        return retailerRow
    }
}