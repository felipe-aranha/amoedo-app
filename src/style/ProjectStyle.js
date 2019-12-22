import { StyleSheet } from 'react-native';
import { default as style, secondaryColor, tertiaryColor } from './variables';

export default StyleSheet.create({
    projectTypeArea: {
        backgroundColor: '#fff',
        alignSelf:'stretch',
        paddingHorizontal: 20,
        paddingTop: 15,
        flex: 1
    },
    formView: {
        paddingHorizontal: 20,
        paddingVertical:  20
    },
    projectSaveButton: {
        backgroundColor: 'rgb(255,0,0)'
    },
    buttonSecondary: {
        backgroundColor: secondaryColor
    },
    buttonTertiary: {
        backgroundColor: tertiaryColor
    },
    submitButtonTitle: {
        color: '#fff'
    },
    addClientArea: {
        flex:1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingRight: 20
    },
    addClientClickArea: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    addClientText: {
        color: 'rgb(191,8,17)',
        fontFamily: 'system-semibold',
        fontSize: 12
    },
    clientLabelArea: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    roomInputArea: {
        flex:1,
        marginHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(163,163,163,0.8)',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    roomInputBorder: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(163,163,163,0.8)',
        marginHorizontal: 10
    },
    projectFilesText: {
        color: 'rgb(88,12,33)',
        fontFamily: 'system-bold',
        fontSize: 12
    },
    roomAddPhotoArea:{
        backgroundColor: '#fff',
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        margin:10
    }
})