import { Customer } from "./Customer";

export class CustomerRegister {
    constructor(customer={}, password=''){
        this.customer = Object.assign(new Customer(), customer);
        this.password = password;
    }

}