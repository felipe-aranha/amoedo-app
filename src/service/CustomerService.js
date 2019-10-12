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
        const data = {
            customer
        }
        return this.putAsync(`${this.basePath}/${id}`, data)
    }

    getCustomer(id){
        return this.getAsync(`${this.basePath}/${id}`)
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

    sendRecoveryEmail(email){
        const data = {
            email,
            template: 'email_reset'
        }
        return this.putAsync(`${this.basePath}/password`,data);
    }

    changePassword(currentPassword,newPassword){
        const data = { currentPassword, newPassword }
        return this.putAsync(`${this.basePath}/me/password`, data);
    }

    async getCustomerGroups(){
        return this.getAsync('rest/V1/customerGroups/search?searchCriteria[currentPage]=0').then(result => {
            if(!result.items) return [];
            profiles = result.items.filter(item => item.code.startsWith('Perfil') || item.code == 'app');
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
                    customer: profile.code == 'app',
                    children: subProfiles
                }
            });
        }).catch(e => {
            // console.log(e);
            return []
        })
    }

    sendEmail(email, type='client', additional=''){
        const data = {
            email,
            type,
            additional
        }
        return this.postAsync('rest/V1/appamoedo/send-email-notification', data);
    }

}