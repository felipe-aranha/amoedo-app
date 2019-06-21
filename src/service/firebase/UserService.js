import { FirebaseDB } from "./Firebase";

export class UserService extends FirebaseDB{

    static CUSTOMER = 'customer';
    static PROFESSIONAL = 'professional'

    static insertOrUpdateProfessionalAsync(user){
        user = Object.assign({},user);
        const db = FirebaseDB.getCollection(UserService.PROFESSIONAL);
        return db.doc(user.id.toString()).set({
            user
        })
    }  

    static async userExists(id,db){
        const response = await db.doc(id.toString()).get();
        if(response.exists){
            return true;
        } else {
            return false;
        }
    }

    static getProfessionalDB(){
        return FirebaseDB.getCollection(UserService.PROFESSIONAL)
    }

    static getCustomerDB(){
        return FirebaseDB.getCollection(UserService.CUSTOMER)
    }

}