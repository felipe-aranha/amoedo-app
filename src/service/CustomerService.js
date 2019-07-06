import { HttpClient } from './HttpClient';
import { AppStorage } from '../storage';

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

    updateCustomer(id,customer){
        console.log(customer);
        const data = {
            customer
        }
        return this.putAsync(`${this.basePath}/${id}`, data)
    }

    getCustomerToken(username,password){
        const data = {
            username, password
        }
        return this.postAsync('rest/V1/integration/customer/token', data).then( async token => {
            return token;
        })
    }

    getMe(){
        return this.getAsync(`${this.basePath}/me`);
    }

    async login(username,password){
        const token = await this.getCustomerToken(username, password);
        if(typeof(token) === 'string'){
            this.setToken(token);
            await AppStorage.setUser(username,password);
            return this.getMe();
        }
        return false;
    }

    async getCustomerGroups(){
        return this.getAsync('rest/V1/customerGroups/search?searchCriteria[currentPage]=0').then(result => {
            if(!result.items) return [];
            profiles = result.items.filter(item => item.code.startsWith('Perfil'));
            return profiles.map(profile => {
                name = profile.code.replace('Perfil ','');
                subProfiles = result.items.filter(item => item.code.endsWith(name) && item.id != profile.id);
                subProfiles = subProfiles.map(sub => {
                    return {
                        ...sub,
                        name: sub.code.replace(` ${name}`,'')
                    }
                })
                return {
                    ...profile,
                    name,
                    children: subProfiles
                }
            });
        }).catch(e => {
            // console.log(e);
            return []
        })
    }

}