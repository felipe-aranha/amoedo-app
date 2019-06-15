export class User {
    constructor(documents=[]){
        this.id = -1;
        this.type = -1;
        this.status = "pending";
        this.email = "";
        this.rg = "";
        this.cau = "";
        this.telephone = "";
        this.cellphone = "";
        this.instagram = "";
        this.cnpj = "";
        this.monthlyProjects = "";
        this.avatar = "";
        this.documents = documents;
        this.createdAt = new Date();
    }
}