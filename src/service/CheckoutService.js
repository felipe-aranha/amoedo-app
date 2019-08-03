import { HttpClient } from './HttpClient';

export class CheckoutService extends HttpClient {

    basePath = 'rest/V1/';

    async getCart(){
        // await this.deleteAsync(`${this.basePath}carts/mine`);
        return this.postAsync(`${this.basePath}carts/mine`);
    }

    async getCartItems(){
        return this.getAsync(`${this.basePath}carts/mine/items`);
    }

    async deleteCartItem(item){
        return this.deleteAsync(`${this.basePath}carts/mine/items/${item}`);
    }

    async addToCart(items,quoteId){
        return new Promise((resolve) => {
            items.forEach(async (item,i) => {
                const data = {
                    cartItem: {
                        ...item,
                        quote_id: quoteId
                    }
                }
                console.log(data);
                const response = await this.postAsync(`${this.basePath}carts/mine/items`, data);
                if(i == items.length - 1)
                    resolve(true);
            })
        });
    }

    async getShippingMethods(a,email){
        const address = this.parseAddress(a,email);
        data = {
            address: {
                ...address,
                same_as_billing: 1
            }
        }
        address.region = address.region.region;
        return this.postAsync(`${this.basePath}carts/mine/estimate-shipping-methods`,data)
    }

    async setShippingMethod(shippingAddress,billingAddress,email,method){
        const sa = this.parseAddress(shippingAddress,email);
        const ba = this.parseAddress(billingAddress,email);
        data = {
            addressInformation: {
                shipping_address: sa,
                billingAddress: ba,
                shipping_carrier_code: method.carrier_code,
                shipping_method_code: method.method_code
            }
        }
        console.log(data, method);
        return this.postAsync(`${this.basePath}carts/mine/shipping-information`,data)
    }

    parseAddress(address,email){
        return {
            region: address.region.region,
            region_id: address.region_id,
            region_code: address.region.region_code,
            country_id: address.country_id,
            street: address.street,
            postcode: address.postcode,
            city: address.city,
            firstname: address.firstname,
            lastname: address.lastname,
            customer_id: address.customer_id,
            email,
            telephone: address.telephone,
        }
    }

}