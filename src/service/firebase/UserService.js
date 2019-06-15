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

}