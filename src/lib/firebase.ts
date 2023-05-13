import { getAuth } from 'firebase-admin/auth';
import { applicationDefault, initializeApp } from 'firebase-admin/app';
import admin from 'firebase-admin';
import { CannotGetFirebaseUserByEmail } from '../utils/errors';
// get this JSON from the Firebase board
// you can also store the values in environment variables
// import {default as serviceAccount} from "./koala-retailer-network-2f4064579dde.json"

export const firebaseAdmin = initializeApp({
  credential: "adsas" as any, //admin.credential.cert(serviceAccount as any),
  projectId:"koala-retailer-network",
  databaseURL: "https://koala-retailer-network-default-rtdb.europe-west1.firebasedatabase.app"
});

export const defaultAuth = getAuth();


interface IFirebaseUser {
    email?:string,
    phoneNumber?: string,
    emailVerified?: boolean,
    password?: string,
    displayName?: string,
    photoURL?: string,
    disabled?: boolean,
}

// https://firebase.google.com/docs/admin/setup
export const createFirebaseUser = async (email:string,password:string) =>{
    const user = await defaultAuth.createUser({
        email,
        password,
        emailVerified: false,
        disabled: false,
    })
    return user
}

export const destroyFirebaseUserByEmail = async (email:string) =>{
    const user = await defaultAuth.getUserByEmail(email)
    return await defaultAuth.deleteUser(user.uid)
}

export const getFirebaseUserByEmail = async (email:string) =>{
    try {
        return await defaultAuth.getUserByEmail(email)
   } catch (error:any) {
    throw new CannotGetFirebaseUserByEmail(email)
   }
}

export const updateFirebaseProfile = async (uid:string,updateProps:IFirebaseUser)=>{
    return await defaultAuth.updateUser(uid, {
        ...updateProps
    })

}