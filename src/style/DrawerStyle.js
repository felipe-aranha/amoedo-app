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
        fontFamily: 'system-extrabold',
        color: 'rgb(68,68,68)',
        paddingBottom: 5,
        paddingTop: 15,
        fontSize: 20
    },
    userType: {
        fontFamily: 'system-extrabold',
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
    },
    menuArea: {
        flex:2, 
        padding: 20
    },
    menuItemArea: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10
    },
    menuItemIcon: {
        width:20,
        height:20
    },
    menuItemText: {
        fontFamily: 'system-bold',
        fontSize: 14,
        marginLeft: 20,
        color: 'rgb(34,34,34)'
    }
})