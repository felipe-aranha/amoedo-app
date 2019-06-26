export class Customer{
    constructor(address={}){
        this.avatar = "";
        this.name = "";
        this.email = "";
        this.cpf = "";
        this.rg = "";
        this.telephone = "";
        this.cellphone = "";
        this.address = address;
        this.instagram = "";
        this.magento_id = null;
        this.deviceToken = null;
        this.createdAt = new Date();
    }
}