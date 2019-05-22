import { HttpClient } from '.';

export class CustomerService extends HttpClient {

    basePath = 'rest/V1/customers';

    async isEmailAvailable(customerEmail){
        return this.postAsync(`${basePath}/isEmailAvailable`, customerEmail)
    }

    async register(customer, password){
        const data  = {
            customer,
            password
        }
        return this.postAsync(`${this.basePath}`, data);
    }

    async getCustomerGroups(){
        return this.getAsync('rest/V1/customerGroups/search?searchCriteria[currentPage]=0');
    }

}