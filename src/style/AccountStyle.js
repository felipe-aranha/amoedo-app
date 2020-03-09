import { StyleSheet } from 'react-native';
import { default as style, secondaryColor, tertiaryColor } from './variables';

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
    submitButtonTitle: {
        color: 'rgb(71,71,71)'
    },
    accountButtonArchitectButton: {
        backgroundColor: 'rgb(141,2,40)'
    },
    accountTakePhotoButton: {
        backgroundColor: secondaryColor
    },
    accountLoadMediafromPhoneButton: {
        borderColor: 'rgb(77,77,77)'
    },
    accountLoadMediafromPhoneButtonText: {
        color: 'rgb(77,77,77)'
    }, 
    accountCustomerButton: {
        backgroundColor: '#FF0001'
    },
    submitButton: {
        borderColor: 'rgb(71,71,71)'
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
    inputForgotStyle: {
        color: 'rgb(77,77,77)',
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
        marginLeft: 20,
        overflow: 'visible'
    },
    loginLogoArea: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        top: -40
    },
    loginLogoImage: {
        width: 120,
        top: -30        
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
    },
    logFormRow: {
        flexDirection: 'row',
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    editProfileRow: {
        flexDirection: 'row',
        marginVertical: 10,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    inputLabel: {
        fontFamily: 'system-medium',
        color: 'rgb(163,163,163)',
        textTransform: 'uppercase',
        fontSize: 12
    },
    input: { 
        fontFamily: 'system-medium',
        color: secondaryColor,
        fontSize: 14
    },
    inputError: {
        position: 'absolute',
        bottom: -20,
        color: 'rgb(177,3,3)',
        fontFamily: 'system-medium',
        fontSize: 10
    },
    inputContainter: {
        borderBottomColor: 'rgba(77,77,77,0.3)'
    },
    formSubmit: {
        backgroundColor: 'rgb(50,0,14)',
        width: '100%',
        paddingVertical: 20,
        justifyContent:'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0
    },
    formSubmitText: {
        color: '#fff',
        fontSize: 14
    },
    formAvatarArea: {
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 30,
        marginHorizontal: 10,
    },
    formAvatarIcon: {
        width: 24,
        height: 24
    },
    formAvatarBadge: {
        color: secondaryColor,
        position: 'absolute',
        top: 0,
        right: -5
    },
    sectionTitleArea: {
        marginHorizontal:30,
        marginVertical: 30,
        flex: 1
    },
    sectionTitleText: {
        color: 'rgb(125,125,125)'
    },
    sectionTitleTextHighlight: {
        color: 'rgb(88,12,33)',
    },
    formContent: {
        marginHorizontal: 20,
        marginBottom: 30
    },
    registerHeaderText: {
        fontFamily: 'system-medium',
        color: 'rgb(242,242,242)',
        fontSize: 14,
        textTransform: 'uppercase'
    },
    registerContentArea: {
        backgroundColor: secondaryColor,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    registerCustomerContentArea: {
        backgroundColor: tertiaryColor,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    sectionHeaderArea: {
        backgroundColor: 'rgb(50,0,14)',
        marginHorizontal: 2,
        paddingTop: 10,
        paddingBottom: 10,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4
    },
    sectionHeaderAreaActive: {
        backgroundColor: 'rgb(242,242,242)'
    },
    sectionHeaderIcon: {
        marginHorizontal: 20,
        width: 30,
        height: 30
    },
    sectionHeaderIconInactive: {
        tintColor: '#fff'
    },
    maskedInputArea: {
        flex:1, 
        marginHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(163,163,163,0.8)'
    },
    logInputArea: {
        flex:1, 
        marginHorizontal: 10,
    },
    maskedInputLabel: {
        fontSize: 12,
        color: 'rgb(163,163,163)',
        fontFamily: 'system-medium',
        textTransform:'uppercase'
    },
    maskedInputText: {
        color: 'rgb(88,12,33)',
        fontSize: 14,
        minHeight:40,
        textAlignVertical: 'center',
        fontFamily: 'system-medium'
    },
    maskedInputTextIOS: {
        color: 'rgb(88,12,33)',
        fontSize: 14,
        paddingVertical:10,
        textAlignVertical: 'center',
        fontFamily: 'system-medium'
    },
    maskedInputError: {
        bottom: -15,
        left: -5
    },
    pendingArea: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pendingBg: {
        backgroundColor: 'transparent'
    },
    pendingTitleArea: {
        backgroundColor: 'rgba(241,207,48,0.7)',
        height: 150,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 30
    },
    pendingTitleText: {
        fontSize: 20,
        fontFamily: 'system-bold',
        color: 'rgb(45,45,45)',
        textAlign: 'center'
    },
    pendingDescriptionArea: {
        height: 225,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 30,
        backgroundColor: 'rgba(254,254,254,0.8)',
    },
    pendingDescriptionText: {
        fontFamily: 'system-medium',
        fontSize: 15,
        color: 'rgb(45,45,45)',
        textAlign: 'center'
    },
    editProfileTitle: {
        fontFamily: 'system-bold',
        color: 'rgb(45,45,45)',
        fontSize: 14
    },
    editProfileSubtitle: {
        fontFamily: 'system-medium',
        fontSize: 12,
        color: 'rgb(121,121,121)',
    }
})