import { HttpClient } from '.';

export class AdminService extends HttpClient {

    async getToken(){
        const data = { username, password } = this.variables.auth;
        return await this.postAsync('rest/V1/integration/admin/token', data);
    }

}