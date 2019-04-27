import { HttpClient } from '.';

export class CustomerService extends HttpClient {

    basePath = 'rest/V1/customers';

    async isEmailAvailable(customerEmail){
        return await this.postAsync(`${basePath}/isEmailAvailable`, customerEmail)
    }

    async register(customer, password){
        const data  = {
            customer,
            password
        }
        return await this.postAsync(`${this.basePath}`, data);
    }

}