export default {
    magento: {
        baseURL: "http://homologa.amoedo.com.br/",
        auth: {
            "username": "oliadm",
            "password": "0qwe1478!!!",
            "consumerKey": "qvvykzuop4rjqy6d4lwv2hk96qvof9z8",
            "consumerSecret": "v193cvx8wzy89zcy32x5ca3ru1pc19yj",
            "accessToken": "oo7yxahwjlt83rzec3n15j9394c67fpp",
            "secretToken": "1bs076sl0cajmgcfiu8lqih1zu6tvrjx"
        }
    },
    firebase: {
        apiKey: "AIzaSyDz7ZGAcBmNue81aEEcDMbKpg6V8CxKbHY",
        authDomain: "app-amoedo-dev.firebaseapp.com",
        databaseURL: "https://app-amoedo-dev.firebaseio.com",
        projectId: "app-amoedo-dev",
        storageBucket: "gs://app-amoedo-dev.appspot.com/",
        messagingSenderId: "259660110621",
        appId: "1:259660110621:web:2fb9034f44d7cbc3"
    },
    mundipagg: {
        // appId: 'pk_YMjLq3UvGHyRrpk4' // production
        appId: 'pk_test_rY1KjxxIdPHBjpLa'
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