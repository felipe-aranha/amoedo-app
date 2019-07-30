import { FirebaseDB } from "./Firebase";
import uuid from 'uuid';

export class UserService{

    static CUSTOMER = 'customer';
    static PROFESSIONAL = 'professional';
    static PROJECT = 'project';

    static async insertOrUpdateProfessionalAsync(user,documents=[],avatar=''){
        storage = FirebaseDB.getStorage().ref();
        docMap = documents.length > 0 ? await UserService.uploadDocuments(documents) : [];
        avatarUrl = false;
        if(avatar!= '' && avatar != null)
            avatarUrl = await UserService.uploadImageAsync(avatar);
        user = Object.assign({},user);
            const db = UserService.getProfessionalDB();
        await db.doc(user.id.toString()).set({
            user,
            clients: [],
            documents: docMap,
            avatar: avatarUrl ? avatarUrl : null
        })
            
    }

    static async uploadDocuments(documents){
        docs = [];
        await new Promise((resolve,reject) => {
            documents.forEach(async (document,i) => {
                if(document.uri){
                    const url = await UserService.uploadImageAsync(document.uri);
                    doc = {
                        image: url,
                        name: document.name,
                        status: 'pending'
                    }
                    docs.push(doc);
                }
                if(i == documents.length -1){
                    resolve();
                }
            }) 
        })
        return docs;
    }

    static async uploadImageAsync(uri) {
        const blob = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.onload = function() {
            resolve(xhr.response);
          };
          xhr.onerror = function(e) {
            console.log(e);
            reject(new TypeError('Network request failed'));
          };
          xhr.responseType = 'blob';
          xhr.open('GET', uri, true);
          xhr.send(null);
        });
        storage = FirebaseDB.getStorage().ref();
        d = new Date();
        const ref = storage.child(`images/${uuid.v4()}`);
        const snapshot = await ref.put(blob);
        blob.close();
      
        return await snapshot.ref.getDownloadURL();
      }
    
    static async insertOrUpdateCustomerAsync(customer,verify){
        customer = Object.assign({},customer);
        const db = UserService.getCustomerDB();

        const exists = verify ? await UserService.userExists(customer.email,db) : false;
        if(!exists)
            return await db.doc(customer.email).set(customer);
    }

    static async insertAndAttachCustomer(customer,professionalDoc){
        await UserService.insertOrUpdateCustomerAsync(customer,true);
        return UserService.addCustomerToProfessional(customer,professionalDoc);
    }

    static createOrUpdateProject(professionalId,customerEmail,project,id=null){
        const data = {
            professional: professionalId,
            customer: customerEmail,
            data: project
        }
        console.log(data);
        if(id != null)
            return UserService.getProjectDB().doc(id).set(data)
        return UserService.getProjectDB().add(data)
    }

    static async getMyClients(clients){
        c = [];
        if(!clients || clients.length == 0) return [];
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

    static getProjects(professional){
        const db = UserService.getProjectDB();
        return db.where('professional','==',professional);
    }

    static getCustomerProjects(customer){
        const db = UserService.getProjectDB();
        return db.where('customer','==',customer);
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

    static getProjectDB(){
        return FirebaseDB.getCollection(UserService.PROJECT)
    }

}