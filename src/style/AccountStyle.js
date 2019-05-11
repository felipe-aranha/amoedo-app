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
    }
})