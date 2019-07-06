import { Address } from "./Address";

export class Customer {
    constructor(address={},telephone=""){
        this.email = "";
        this.firstname = "";
        this.lastname = "";
        this.taxvat = "";
        this.group_id = 0;
        this.created_in = "app";
        if(address && Object.keys(address).length > 0)
            this.addresses = [
                Object.assign(new Address(), address)
            ];
        this.dob = "";
        this.custom_attributes = [
            {
                attribute_code: "custom_telephone",
                value: telephone
            }
        ]
    }
}