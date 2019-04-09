export const AccountActions = {
    LOGIN: 'LOGIN'
};

export const doLogin = (user) => {
    {
        type: AccountActions.LOGIN,
        user
    }
}