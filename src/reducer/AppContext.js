import React from 'react';

export const AppContext = {
    isReady: false,
    app: {
        groups: []
    },
    message: () => {},
    removeMessage: () => {}
}

export const MainContext = React.createContext(AppContext);