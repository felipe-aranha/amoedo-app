import { HttpClient } from './HttpClient';

export class CustomerService extends HttpClient {

    basePath = 'rest/V1/customers';

    async isEmailAvailable(customerEmail){
        return this.postAsync(`${this.basePath}/isEmailAvailable`, {customerEmail})
    }

    async register(customer, password){
        const data  = {
            customer,
            password
        }
        return this.postAsync(`${this.basePath}`, data);
    }

    getCustomerToken(username,password){
        const data = {
            username, password
        }
        return this.postAsync('rest/V1/integration/customer/token', data)
    }

    getMe(){
        return this.getAsync(`${this.basePath}/me`);
    }

    async login(username,password){
        const token = await this.getCustomerToken(username, password);
        if(typeof(token) === 'string'){
            this.setToken(token);
            const customerInfo = this.getMe();
            
        }
        return false;
    }

    async getCustomerGroups(){
        return this.getAsync('rest/V1/customerGroups/search?searchCriteria[currentPage]=0');
    }

}