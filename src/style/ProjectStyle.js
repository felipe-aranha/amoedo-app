import { StyleSheet } from 'react-native';
import { default as style, secondaryColor } from './variables';

export default StyleSheet.create({
    projectTypeArea: {
        backgroundColor: '#fff',
        alignSelf:'stretch',
        paddingHorizontal: 20,
        paddingTop: 15
    },
    formView: {
        paddingHorizontal: 20,
        paddingVertical:  20
    },
    projectSaveButton: {
        backgroundColor: 'rgb(255,0,0)'
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
    }
})