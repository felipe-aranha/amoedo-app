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
    static EMAIL = `${storage}email`;
    static PASSWORD = `${storage}password`;


    static async getUser(){
        return await AsyncStorage.multiGet([AppStorage.EMAIL,AppStorage.PASSWORD]).then( result => {
            if(result){
                user = {
                    email: null,
                    password: null
                }
                result.forEach(item => {
                    switch(item[0]){
                        case AppStorage.EMAIL:
                            user.email = item[1];
                            return;
                        case AppStorage.PASSWORD:
                            user.password = item[1];
                            return;
                    }
                })
                return user;
            }
            null;
        })
    }

    static async setUser(email,password){
        return AsyncStorage.multiSet([
            [AppStorage.EMAIL, `${email}`],
            [AppStorage.PASSWORD, `${password}`]
        ])
    }

}