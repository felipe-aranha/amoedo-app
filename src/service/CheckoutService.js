import { HttpClient } from './HttpClient';
import variables from '../utils';
import * as XML2JS from 'react-native-xml2js';

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
        await this.postAsync(`${this.basePath}carts/mine/billing-address`,{ address: ba });
        return this.postAsync(`${this.basePath}carts/mine/shipping-information`,data)
    }

    async setCreditCardInfo(number,holder_name,exp_month,exp_year,cvv,billingAddress){
        const data = {
            type: "card",
            card: {
                type: "credit",
                number,
                holder_name,
                exp_month,
                exp_year,
                cvv,
                billing_address: {
                    street: billingAddress.street[0] || "",
                    number: billingAddress.street[1] || "",
                    zip_code: billingAddress.postcode,
                    neighborhood: billingAddress.street[3] || "",
                    complement: billingAddress.street[2] || "",
                    city: billingAddress.city,
                    state: billingAddress.region.region_code,
                    country: billingAddress.country_id
                }
            }
        }
        return this.postAsync(`https://api.mundipagg.com/core/v1/tokens?appId=${variables.mundipagg.appId}`, data);
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

    getInstallments(value){
        return fetch(`https://www.amoedo.com.br/rest/default/V1/mundipagg/installments/brandbyamount/Visa/${value}/`)
                    .then(response => {
                        return response.text();
                    })
                    .then(async response => {
                        let r = null;
                        await XML2JS.parseString( response , (err, result) => {
                            r = response;
                        })
                        return JSON.parse(r);
                    })
    }

    order(request,installments=1){
        const card = request.card || {};
        const data = {
            paymentMethod: {
                method: "mundipagg_creditcard",
                additional_data:{
                    cc_savecard: 0,
                    cc_saved_card: "",
                    cc_type: card.brand,
                    cc_last_4: card.last_four_digits,
                    cc_exp_year: card.exp_year,
                    cc_exp_month: card.exp_month,
                    cc_owner: card.holder_name,
                    cc_installments: installments,
                    cc_token_credit_card: request.id
                }
            }
        }
        return this.postAsync(`${this.basePath}carts/mine/payment-information`,data);
    }

    orderBillet(){
        const data = {
            paymentMethod: {
                method: 'mundipagg_billet',
                additional_data: {
                }
            }
        }
        return this.postAsync(`${this.basePath}carts/mine/payment-information`,data);
    }

    getOrder(orderId){
        return this.getAsync(`${this.basePath}orders/${orderId}`);
    }

    setOrderComment(orderId,project){
        data = {
            statusHistory: {
                comment: `{"Origin":"AppAmoedo","customer_id":"${project.customer}","professional_id":"${project.professional}","project_id":"${project.id}"}`
            }
        }
        return this.postAsync(`${this.basePath}orders/${orderId}/comments`, data);
    }

}

/*

{paymentMethod":{"method":"mundipagg_creditcard","additional_data":{"cc_type":"Visa","cc_last_4":"1111","cc_exp_year":"2029","cc_exp_month":"12","cc_owner":"cvs","cc_savecard":0,"cc_saved_card":"","cc_installments":1,"cc_token_credit_card":"token_YoL7qgrSJCz3lKMQ"}}}

*/