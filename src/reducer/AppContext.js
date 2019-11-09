import React from 'react';

export const AppContext = {
    isReady: false,
    app: {
        groups: [],
        categories: []
    },
    user: {
        token: null,
        group: null,
        isProfessional: null,
        magento: {},
        firebase: {},
        clients: []
    },
    userType: null,
    redirect: false,
    message: () => {},
    removeMessage: () => {},
    login: () => {},
    logout: () => {}
}

export const MainContext = React.createContext(AppContext);