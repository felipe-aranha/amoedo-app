import { FirebaseDB } from "./Firebase";

const CHAT = 'chat';

export class ChatService {

    static async getRoom(users){
        const db = ChatService.getChatDB();
        const doc = await db.where('professional','==',users.professional).where('client','==',users.client).get();
        if(!doc.empty){
            return db.doc(doc.docs[0].id);
        }
        return db.add({
            professional: users.professional,
            client: users.client,
            messages: []
        }).then(snapshot => {
            return db.doc(snapshot.id)
        })
    }
    
    static getChatDB(){
        return FirebaseDB.getCollection(CHAT)
    }

    static async sendMessage(room, m){
        let message = Object.assign({},m);
        message.pending = false;
        message.sent = true;
        message.createdAt = `${message.createdAt}`;
        if(!message.user.avatar || message.user.avatar == '')
            message.user.avatar = null;
        const db = ChatService.getChatDB().doc(room);
        FirebaseDB.getFirestore().runTransaction(transaction => {
            return transaction.get(db).then(doc => {
                let newMessages = doc.data().messages || [];
                newMessages.push(message);
                transaction.update(db,{messages: newMessages})
            })
        })
    }


}