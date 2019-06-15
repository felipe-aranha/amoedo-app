export class DocumentModel{
    constructor(name,hash){
        this.base64 = hash;
        this.name = name;
        this.status = "pending";
    }
}