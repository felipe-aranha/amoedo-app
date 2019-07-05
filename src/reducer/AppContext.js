import React from 'react';

export const AppContext = {
    isReady: false,
    app: {
        groups: []
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
    message: () => {},
    removeMessage: () => {},
    login: () => {},
    logout: () => {}
}

export const MainContext = React.createContext(AppContext);