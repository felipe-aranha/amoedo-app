export class DocumentModel{
    constructor(name,uri){
        this.uri = uri;
        this.name = name;
        this.status = "pending";
    }
}