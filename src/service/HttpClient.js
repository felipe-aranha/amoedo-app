import { Constants } from 'expo';
import variables from '../utils';

export class HttpClient {

    token;
    baseUrl;
    variables;

    constructor(token=null){
        this.token = token != null ? token : variables.magento.auth.accessToken;
        this.variables = variables.magento;
        this.baseUrl = this.variables.baseURL;        
    }

    sendAsync(url, type, data, options){
        url = url.startsWith("http") ? url : this.baseUrl + url;
        let request = {
            method: type,
            headers: new Headers({
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }),
            body: ''
        };
        const opts = Object.assign({
            accept: "application/json",
            contentType: "application/json"
        }, options.headers);

        request.headers = new Headers({
            'Accept': opts.accept,
            'Content-Type': opts.contentType
        });

        if(opts.authorization) request.headers.append("Authorization", opts.authorization);
        else if(this.token != null) request.headers.append("Authorization", 'Bearer ' + this.token);
        if(opts.contentType == 'application/x-www-form-urlencoded'){
            let payload = [];
            if(data){
                for (let property in data) {
                    let encodedKey = encodeURIComponent(property);
                    let encodedValue = encodeURIComponent(data[property]);
                    payload.push(`${encodedKey}=${encodedValue}`);
                }
                request.body = payload.join("&");
            }
        }
        else if(opts.contentType == 'multipart/form-data'){
            request.body = data;
        }
        else if(data){
            request.body = JSON.stringify(data);
        }
        return fetch(url,request).then(async response =>{
            if(options.returnStatus) return response;
            return response.json();
        });
    }
    
    async getAsync(url, data=null, options={}){
        return await this.sendAsync(url, "GET", null, options || {});
    }

    async postAsync(url, data, options={}){
        return await this.sendAsync(url, "POST", data, options || {});
    }

    async putAsync(url, data, options={}){
        return await this.sendAsync(url, "PUT", data, options || {});
    }

    async deleteAsync(url, data, options={}){
        return await this.sendAsync(url, "DELETE", data, options || {});
    }

}
