export default {
    magento: {
        baseURL: "http://www.amoedo.com.br/",
        auth: {
            "username": "neivaldo.duraes",
            "password": "avanter@2019",
            "consumerKey": "ffurn84u14x9z4gy98v4elcxttbd5heq",
            "consumerSecret": "t3isjw1j1t1febba5mg49lhebt0a7las",
            "accessToken": "u7og8s0sqar9ixor8dps2hz3csgv9rvm",
            "secretToken": "hrv5ynbibxhbgn9nf44p4hwdhc9dfna7"
        }
    },
    firebase: {
        apiKey: "AIzaSyBUUkebWbTFwKbTQXuepp9cmtGfP43NRr8",
        authDomain: "app-amoedo.firebaseapp.com",
        databaseURL: "https://app-amoedo.firebaseio.com",
        projectId: "app-amoedo",
        storageBucket: "app-amoedo.appspot.com",
        messagingSenderId: "892754699544",
        appId: "1:892754699544:web:d4bb10b9bcf6d47ec86a6d",
        measurementId: "G-VX4T77B8NS"
    },
    mundipagg: {
        appId: 'pk_YMjLq3UvGHyRrpk4'
        // appId: 'pk_test_rY1KjxxIdPHBjpLa'
    },
    app: {
        project:{
            projectType: [
                {name: 'all', rooms: 'default'},
                {name: 'commercial', rooms: 'default'},
                {name: 'residential', rooms: 'default'},
                {name: 'others', rooms: 'default'}
            ],
            rooms: {
                default: [
                    'bathroom',
                    'kitchen',
                    'bedroom',
                    'livinRoom',
                    'balcony',
                    'other'
                ]
            },
            statuses: {
                0: 'in_progress',
                1: 'closed'
            },
            logs: {
                0: 'occurrence',
                1: 'scheduling',
                2: 'agreement'
            }
        } 
    },
    style: {
        primaryColor: "rgb(241,206,0)",
        secondaryColor: "rgb(88,12,33)",
        tertiaryColor: "rgb(226,0,6)",
        quaternaryColor: "",
        mainBgColor: "rgb(238,238,238)"
    }
}