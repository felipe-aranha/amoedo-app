export default {
    magento: {
        baseURL: "http://homologa.amoedo.com.br/",
        auth: {
            "username": "oliadm",
            "password": "0qwe1478!!!",
            "consumerKey": "qvvykzuop4rjqy6d4lwv2hk96qvof9z8",
            "consumerSecret": "v193cvx8wzy89zcy32x5ca3ru1pc19yj",
            "accessToken": "vsbbhwjzdqekkhj1ibi29mc3y64zvi2z",
            "secretToken": "ryisa2yn7ugdk7ty3cxv9rn1l1u7puzi"
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
                    'balcony'
                ]
            }
        } 
    },
    style: {
        primaryColor: "rgb(241,206,0)",
        secondaryColor: "rgb(88,12,33)",
        tertiaryColor: "",
        quaternaryColor: "",
        mainBgColor: "rgb(238,238,238)"
    }
}