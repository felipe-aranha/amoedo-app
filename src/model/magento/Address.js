export class Address{
    constructor(address="",number="",complement="",neighborhood=""){
        this.city = "";
        this.company = "";
        this.country_id = "BR";
        this.firstname = "";
        this.lastname = "";
        this.postcode = "";
        this.street = [
            address,
            number,
            complement,
            neighborhood
        ];
        this.region_id = 502;
        this.telephone = "";
        this.default_billing = true;
        this.default_shipping = true;
        this.fax = "";
    }
}