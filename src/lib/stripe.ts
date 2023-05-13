import { CannotCreateStripeCard, CannotDeleteStripeCard } from '../utils/errors';
import moment from 'moment';
// https://stripe.com/docs/payments
import Stripe from 'stripe'
import dotenv from 'dotenv'

dotenv.config()

export const stripe = new Stripe(process.env.STRIPE_SECRET as string,{apiVersion: '2022-11-15'});

type CreateCardStripe = (customerId:string,payload:any)=>Promise<any>
export const createCardStripe:CreateCardStripe = async (customerId,payload)=>{
    try {
        const newCard = await stripe.customers.createSource(customerId,{source:payload})
        return newCard
    } catch (error:any){
        throw new CannotCreateStripeCard(error.message)
    }
}

type GetCardsStripe = (customerId:string)=>Promise<any>
export const getCardsStripe:GetCardsStripe = async (customerId)=> {
    const cards = await stripe.customers.listSources(
        customerId,
        {object: 'card', limit: 5}
      );
    return cards
}

type DeleteCardStripe = (customerId:string,cardId:string)=>Promise<any>
export const deleteCardStripe:DeleteCardStripe = async (customerId,cardId)=>{
    try {
        const deleted = await stripe.customers.deleteSource(
            customerId,
            cardId
        );
        return deleted
    } catch (error:any) {
        throw new CannotDeleteStripeCard(`cannot delete Stripe card for customer ${customerId}`)
    }
}

export const createSubscriptionWithTrial = async (customerId:string)=>{
    const monthFromNow = moment().add(30,"days").unix()
    const priceId = "price_1LxBZZDC72yzd5UnD2w3nEAI"
    try {
        const subscription = await stripe.subscriptions.create({
            customer: customerId,
            items: [{price: priceId}],
            trial_end: monthFromNow,
          });
        return subscription
    } catch (error:any) {
        throw Error()
    }
}

export const getSubscriptions = async (customerId:string)=>{
    try {
        const subscriptions = await stripe.subscriptions.list({
            customer:customerId
          });
        return subscriptions.data
    } catch (error:any) {
        throw Error()
    }
}