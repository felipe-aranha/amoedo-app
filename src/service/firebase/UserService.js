import { FirebaseDB } from "./Firebase";

export class UserService extends FirebaseDB{

    static CUSTOMER = 'customer';
    static PROFESSIONAL = 'professional'

    static insertOrUpdateProfessionalAsync(user){
        user = Object.assign({},user);
        const db = UserService.getProfessionalDB();
        return db.doc(user.id.toString()).set({
            user
        })
    }
    
    static insertOrUpdateCustomerAsync(customer){
        customer = Object.assign({},customer);
        const db = UserService.getCustomerDB();
        return db.doc(customer.email).set(customer);
    }

    static insertAndAttachCustomer(customer,professionalDoc){
        return UserService.insertOrUpdateCustomerAsync(customer).then(() => {
            return UserService.addCustomerToProfessional(customer,professionalDoc);
        }).catch(e => {
            console.log(e);
            return false;
        })
    }

    static async getMyClients(clients){
        c = [];
        if(clients.length == 0) return [];
        await new Promise((resolve,reject) => {
            clients.forEach( async (client, i) => {
                _c = await this.getClient(client.email);
                if(_c != null){
                    c.push(_c);
                }
                if(i == clients.length - 1)
                    resolve()
            })
        })
        return c;
    }

    static async getClient(email){
        doc = await UserService.getCustomerDB().doc(email).get();
        if(doc.exists){
            return doc.data();
        } else {
            return null;
        }
    }

    static addCustomerToProfessional(customer,professionalDoc){
        FirebaseDB.getFirestore().runTransaction(transaction => {
            return transaction.get(professionalDoc).then(doc => {
                clients = doc.data().clients || [];
                found = clients.find(client => client.email == customer.email);
                if(!found){
                    clients.push({
                        email: customer.email,
                        approved: true,
                        dateAdded: new Date()
                    })
                }
                user.clients = clients;
                transaction.update(professionalDoc,{clients})
            })
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

    static getProfessionalDoc(docID){
        return UserService.getProfessionalDB().doc(docID.toString());
    }

    static getProfessionalDB(){
        return FirebaseDB.getCollection(UserService.PROFESSIONAL)
    }

    static getCustomerDB(){
        return FirebaseDB.getCollection(UserService.CUSTOMER)
    }

}