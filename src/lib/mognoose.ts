import {
    COMPETITOR_PAGES_SCHEMA,
    COMPETITOR_PRODUCT_PAGE,
    FRIENDLY_PAGES_SCHEMA,
    INSIGHTS_PAGES_SCHEMA,
    NOTIFICATIONS_SCHEMA,
    NOTIFICATION_SCHEMA,
    ON_PAGE_DFS_SCHEMA,
    PAGES_SCHEMA,
    PRODUCT_PAGE,
    SEO_PAGES_SCHEMA,
    SITEMAP_CHANGE_SCHEMA,
    SITEMAP_PAGES_SCHEMA,
} from '../utils/constants'
import { CannotDeleteManyMongo, CannotDeleteMongo, CannotFindDocumentByKey, CannotFindManyMongo, CannotFindOneUpdateByKey, CannotInsertManyMongo, CannotInsertOneDocument } from "../utils/errors"

import {sitemapModel} from '../db/schemas/sitemap.model';
import { serpModel } from '../db/schemas/serp.schema';
import { delay } from '../utils/helpers';

export const findDocumentByKey = async (collectionName,key)=>{
    let results
    try {
        switch (collectionName) {
            case SITEMAP_PAGES_SCHEMA:
                results = await sitemapModel.findOne({...key})
                break;
            default:
                break;
        }
        return results
    } catch (error:any) {
        throw new CannotFindDocumentByKey()
    }
}

export const findOneUpdateByKey = async (collectionName,key,data)=>{
    try {
        switch (collectionName) {
            case SITEMAP_PAGES_SCHEMA:
                await sitemapModel.findOneAndUpdate(key,data)
                break;
      
            default:
                break;
        }
        return
    } catch (error:any) {
        throw new CannotFindOneUpdateByKey()
    }
}

export const insertOneDocument = async (collectionName,data)=> {

    switch (collectionName) {
        case SITEMAP_PAGES_SCHEMA:
            await sitemapModel.create(data)
            break;
        case FRIENDLY_PAGES_SCHEMA:

        default:
            throw new CannotInsertOneDocument("no matching case for switch")
        }
    return
    
}

export const insertManyDocuments = async (collectionName,arrayOfDocuments,opts={})=> {
    if (arrayOfDocuments.length === 0) return
    switch (collectionName) {
        case SITEMAP_PAGES_SCHEMA:
            await sitemapModel.insertMany(arrayOfDocuments,opts)
            break;
        case INSIGHTS_PAGES_SCHEMA:
            // await insightModel.insertMany(arrayOfDocuments,opts)
            console.log("INSIGHTS_PAGES_SCHEMA missing");
            break

        default:
            throw new CannotInsertManyMongo(`no matching case for ${collectionName} in switch`)
    }
    return arrayOfDocuments
    
}

export const findManyDocuments = async (collectionName,searchKeys,sortOpts={})=> {
    let results
    switch (collectionName) {
        case SITEMAP_PAGES_SCHEMA:
            // https://stackoverflow.com/questions/9952649/convert-mongoose-docs-to-json
            results = await sitemapModel.find(searchKeys,{},sortOpts).lean()
            break;
        default:
            throw new CannotFindManyMongo(`have you provided a valid collection key in your query?`)
    }
    return results
}

export const deleteManyDocumentsByKeys = async (collectionName,key,array)=>{
    switch (collectionName) {
        case SITEMAP_PAGES_SCHEMA:
            // https://stackoverflow.com/questions/9952649/convert-mongoose-docs-to-json
            await sitemapModel.deleteMany().where(key).in(array).exec()
            break;

        default:
            throw new CannotDeleteManyMongo(`no matching case for ${collectionName} in switch`)
    }
    return
}

export const deleteMany = async (collection,searchKeys)=>{
    let results
    switch (collection) {
        case SITEMAP_PAGES_SCHEMA:
            // https://stackoverflow.com/questions/9952649/convert-mongoose-docs-to-json
            results = await sitemapModel.deleteMany(searchKeys)
            break;

        default:
            throw new CannotDeleteMongo(`no matching case for ${collection} in switch`)
    }
    return results
}


export const flattenTempDeletMe = async ()=>{
    // const listisngs:any = await serpModel.find({createdAt:{"$gte":"2023-03-02"}}).lean().exec()
    // for (const chunkedListing of listisngs) {
    //     const arrazyo = Object.keys(chunkedListing).map(k=>{
    //         return chunkedListing[k]
    //     }).slice(0,10)
    //     for (const listing of arrazyo) {
            
    //         await serpModel.create(listing)
    //         await delay(50)
    //     }
    //     await serpModel.deleteOne({_id:chunkedListing._id})
    //     console.log("deleted listing",chunkedListing._id);
        
    // }
    return 
}