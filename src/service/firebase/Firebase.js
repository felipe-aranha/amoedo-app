import firebase from 'firebase';
import 'firebase/firestore';
import variables from '../../utils';

export const firebaseImpl = firebase.initializeApp(variables.firebase);
export const firestore = firebase.firestore();

export class FirebaseDB{

    static getFirestore(){
        return firestore;
    }
    
    static getCollection(name){
        return firestore.collection(name);
    }

    static getFirestore(){
        return firestore;
    }

}