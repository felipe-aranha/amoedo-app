import firebase from 'firebase';
import 'firebase/firestore';
import variables from '../../utils';

export const firebaseImpl = firebase.initializeApp(variables.firebase);
export const firestore = firebase.firestore();

export class FirebaseDB{
    
}