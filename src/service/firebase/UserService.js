import { FirebaseDB } from "./Firebase";
import uuid from 'uuid';
import { CustomerService } from "../CustomerService";

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
        user.avatar = avatarUrl ? avatarUrl : null
        user = Object.assign({},user);
            const db = UserService.getProfessionalDB();
        await db.doc(user.id.toString()).set({
            user,
            points: 0,
            transactions: [],
            clients: [],
            documents: docMap,
        })
            
    }

    static async updateCellphone(user, cellphone, professional){
        const doc = professional ? UserService.getProfessionalDB().doc(user.id.toString()) : UserService.getCustomerDB().doc(user.email);
        return FirebaseDB.getFirestore().runTransaction(transaction => {
            return transaction.get(doc).then(d => {
                const data = d.data();
                if(professional){
                    let u = data.user;
                    u.cellphone = cellphone;
                    return transaction.update(doc,{user: u})
                } else {
                    return transaction.update(doc, {cellphone})
                }
                
            })
        })
    }

    static async updateInstagram(user, instagram, professional){
        const doc = professional ? UserService.getProfessionalDB().doc(user.id.toString()) : UserService.getCustomerDB().doc(user.email);
        return FirebaseDB.getFirestore().runTransaction(transaction => {
            return transaction.get(doc).then(d => {
                const data = d.data();
                if(professional){
                    let u = data.user;
                    u.instagram = instagram;
                    return transaction.update(doc,{user: u})
                } else {
                    return transaction.update(doc, {instagram})
                }
                
            })
        })
    }

    static async updateAvatar(user, avatar, professional){
        let avatarUrl = false;
        if(avatar!= '' && avatar != null)
            avatarUrl = await UserService.uploadImageAsync(avatar);
        user.avatar = avatarUrl ? avatarUrl : null;
        user = Object.assign({},user);
        const doc = professional ? UserService.getProfessionalDB().doc(user.id.toString()) : UserService.getCustomerDB().doc(user.email);
        return FirebaseDB.getFirestore().runTransaction(transaction => {
            return transaction.get(doc).then(d => {
                const data = d.data();
                if(professional){
                    let u = data.user;
                    u.avatar = user.avatar;
                    return transaction.update(doc,{user: u})
                } else {
                    return transaction.update(doc, {
                        avatar: user.avatar
                    })
                }
                
            })
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
            return UserService.uploadImageAsync(uri);
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
        customer.email = customer.email.toLowerCase();
        const db = UserService.getCustomerDB();
        if(customer.avatar && customer.avatar != '' && customer.avatar != null){
            customer.avatar = await UserService.uploadImageAsync(customer.avatar);
        }
        const exists = verify ? await UserService.userExists(customer.email,db) : false;
        if(!exists){
            customer = {
                ...customer,
                points: 0,
                transactions: [],
            }
            if(verify){
                const cs = new CustomerService();
                cs.sendEmail(customer.email, 'cliente', customer.name);
            }
            return await db.doc(customer.email).set(customer);
        }
    }

    static async insertAndAttachCustomer(customer,professionalDoc){
        await UserService.insertOrUpdateCustomerAsync(customer,true);
        return UserService.addCustomerToProfessional(customer,professionalDoc);
    }

    static createOrUpdateProject(professionalId,customer,project,id=null, status){
        let data = {
            professional: professionalId,
            customer: customer.email.toLowerCase(),
            data: project,
            status
        }
        const cs = new CustomerService();
        if(id != null){
            /* data = {
                ...data,
                status: 'in_progress',
            } */
            
            const projectDoc = UserService.getProjectDB().doc(id);
            return FirebaseDB.getFirestore().runTransaction(transaction => {
                return transaction.get(projectDoc).then(doc => {
                    const rooms = doc.data().data.rooms || [];
                    const found = data.data.rooms.filter(r => {
                        return rooms.find( d => d.id == r.id) ? false : true;
                    });
                    if(found){
                        found.forEach( r => {
                            cs.sendEmail(customer.email.toLowerCase(), 'budget', customer.name);
                        })
                    }
                    return transaction.update(projectDoc,data)
                })
            })
        } else {
            cs.sendEmail(customer.email.toLowerCase(), 'project', customer.name);
            data.data.rooms.forEach(() => {
                cs.sendEmail(customer.email.toLowerCase(), 'budget', customer.name);
            });
            return UserService.getProjectDB().add(data)
        }
    }

    static async getMyClients(professional, clients){
        if(clients.length == 0) return [];
        return new Promise(async resolve => {
            const fullClients = [];
            clients.forEach( async (c,i) => {
                const newClient = await UserService.getClient(c.email.toLowerCase());
                fullClients.push(newClient);
                if(i == clients.length - 1)
                    resolve(fullClients);
            })
        });
    }

    static async getClient(email){
        doc = await UserService.getCustomerDB().doc(email.toLowerCase()).get();
        if(doc.exists){
            return doc.data();
        } else {
            return null;
        }
    }

    static addCustomerToProfessional(customer,professionalDoc){
        customer.email = customer.email.toLowerCase();
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
        const response = await db.doc(id.toString().toLowerCase()).get();
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
        return db.where('customer','==',customer.toLowerCase());
    }

    static getCustomerProfessionals(customer){
        return UserService.getCustomerProjects(customer).get().then( snapshot => {
            const professionals = [];
            snapshot.docs.forEach(doc => {
                const data = doc.data();
                professionals.push(data.professional)
            });
            const p = new Promise((resolve) => {
                let fullProfessionals = [];
                professionals.forEach(async (id,i) => {
                    const doc = await UserService.getProfessionalDoc(id).get();
                    fullProfessionals.push(doc.data().user);
                    if(i == professionals.length - 1)
                        resolve(fullProfessionals);
                })
            });
            return Promise.resolve(p);
        })
    }

    static getMutualProjects(professional, customer){
        const db = UserService.getProjectDB();
        return db.where('professional','==',professional).where('customer','==',customer.toLowerCase());
    }

    static getProfessionalProjectsQty(professional){        
        return UserService.getProjects(professional).get().then(snapshot => {
            let customers = {}
            snapshot.docs.forEach(doc => {
                const s = doc.data().status;
                const customer = doc.data().customer;
                const obj = customers[customer][s];
                customers[customer][s] = obj ? obj + 1 : 1;
            });
            return status;
        });
    }

    static setQuoteStatus(projectId, room, status){
        const doc = UserService.getProjectDB().doc(projectId);
        return FirebaseDB.getFirestore().runTransaction(transaction => {
            return transaction.get(doc).then(d => {
                let data = d.data().data || { rooms: [] };
                let rooms = data.rooms.slice() || [];
                rooms.forEach(r => { 
                    if(r.id == room.id){
                        r.status = status;
                    }
                });
                data.rooms = rooms;
                return transaction.update(doc,{data})
            })
        })
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