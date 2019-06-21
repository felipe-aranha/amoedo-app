import { StyleSheet } from 'react-native';
import { default as style, secondaryColor } from './variables';

export default StyleSheet.create({
    accountArea: {
        backgroundColor: 'rgb(227,227,227)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 30
    },
    avatarArea: {
        backgroundColor: 'rgb(179,179,179)',
        width: 80,
        height: 80,
        borderRadius: 15
    },
    userName: {
        fontFamily: 'system-bold',
        color: 'rgb(68,68,68)',
        paddingBottom: 5,
        paddingTop: 15,
        fontSize: 20
    },
    userType: {
        fontFamily: 'system-bold',
        fontSize:12,
        color: 'rgb(136,136,136)',
        paddingBottom: 15
    },
    editText: {
        fontFamily: 'system-bold',
        fontSize: 14,
        color: '#fff'
    },
    checkArea: {
        position: 'absolute',
        bottom: 0,
        right: -16
    }
})