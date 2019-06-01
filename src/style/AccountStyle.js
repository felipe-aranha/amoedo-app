import { StyleSheet } from 'react-native';
import { default as style } from './variables';

export default StyleSheet.create({
    mainBackground: {
        flex: 1,
        width:'100%',
        height: '100%',
    },
    innerContentView: {
        flex: 1,
        marginHorizontal: 30
    },
    accountText: {
        fontFamily: 'system-bold',
        fontSize: 26,
        letterSpacing: -0.8,
        color: '#fff'
    },
    accountTypeTextHighlight: {
        color: 'rgb(206,205,205)'
    },
    accountTypeButtonsArea: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start'
    },
    accountTypeButtonContainer: {
        width: '100%',
        marginVertical: 5,
    },
    accountTypeButton: {
        paddingVertical: 15,
        borderRadius: 8
    },
    accountTypeButtonTitle: {
        textTransform: 'uppercase',
        fontFamily: 'system-medium',
        letterSpacing: -0.3,
        fontSize: 14,
        color: '#fff'
    },
    accountButtonArchitectButton: {
        backgroundColor: 'rgb(141,2,40)'
    },
    accountCustomerButton: {
        borderColor: '#fff'
    },
    accountTechnicalAssistance: {
        backgroundColor: 'rgb(243,164,51)'
    },
    loginNavBarBackground: {
        width: '100%',
        height: 180
    },
    inputContainterStyle: {
        backgroundColor: 'rgba(52,52,52,0.4)',
        borderBottomWidth: 0,
        borderRadius: 5,
        paddingVertical: 5
    },
    inputStyle: {
        color: '#fff',
        paddingLeft: 10,
        fontFamily: 'system',
        fontSize: 14
    },
    inputWrapperStyle: {
        marginVertical: 10
    },
    loginMainView: {
        marginTop: 50
    },
    loginButton: {
        backgroundColor: '#fff'
    },
    loginButtonContainter: {
        marginVertical: 30,
        paddingHorizontal: 10
    },
    loginButtonTitle: {
        color: '#000'
    },
    forgotPasswordText: {
        color: '#fff',
        textAlign: 'right',
        paddingTop: 10,
        fontSize: 12
    },
    loginHeaderBackArea: {
        marginTop: 35,
        marginLeft: 20
    },
    loginLogoArea: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        top: -40
    },
    loginLogoImage: {
        width: 120        
    },
    loginFormArea: {
        paddingHorizontal: 30
    },
    loginSignInButton: {
        borderWidth: 2,
        borderColor: '#fff',
        borderRadius: 15,
        paddingVertical: 15,
        paddingHorizontal: 10,
        width: '80%'
    },
    loginSignInButtonText: {
        color: '#fff',
        textAlign: 'center'
    },
    loginSignInButtonTextHighlight: {
        color: 'rgb(241,207,0)'
    },
    formRow: {
        flexDirection: 'row',
        marginVertical: 10,
        justifyContent: 'center',
        alignItems: 'center'
    }
})