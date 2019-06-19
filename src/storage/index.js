import { AsyncStorage } from 'react-native';

const valueToString = (data) =>{
    if(data.length)
    data.forEach((v,k) => {
        if (typeof(v[1]) == 'undefined' || v[1] == null) v[1] = '';
        if (typeof(v[1]) !== 'string') v[1] = v[1].toString();
    })
    return data;
}

storage = '@AvanterMe:'

export class AppStorage {    
    EMAIL = `${storage}email`;
    PASSWORD = `${storage}password`;


    static async getUser(){
        return await AsyncStorage.multiGet([AppStorage.EMAIL,AppStorage.PASSWORD]).then( result => {
            console.log(result);
            return {
                // email: result[AppStorage.EMAIL],
                // password: result[AppStorage.PASSWORD]
            }
        })
    }

    static async setUser(email,password){
        AsyncStorage.multiSet([
            [AppStorage.EMAIL, email],
            [AppStorage.PASSWORD, password]
        ])
    }

}