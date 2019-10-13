import { StyleSheet } from 'react-native';
import { secondaryColor, primaryColor, tertiaryColor } from './variables';

export default StyleSheet.create({
    beginButtonText: {
        fontFamily: 'system-medium',
        fontWeight: 'normal',
        color: '#fff',
        fontSize: 12,
        padding: 5
    },
    beginButtonArea: {
        backgroundColor: tertiaryColor,
        borderRadius: 15,
    },
    listItemArea: {
        backgroundColor: 'transparent',

    },
    listItemTitle: {
        fontFamily: 'system-medium',
        fontSize: 14,
        color: 'rgb(77,77,77)'
    },
    listItemSubtitle: {
        fontFamily: 'system-medium',
        fontSize: 12,
    },
    rightText: {
        fontSize: 12,
        fontFamily: 'system-medium',
        color: '#fff'
    },
    leftText: {
        fontSize: 12,
        fontFamily: 'system-medium',
        color: 'rgb(77,77,77)'
    },
    rightBubble: {
        backgroundColor: secondaryColor
    },
    leftBubble: {
        backgroundColor: '#fff'
    },
    roomTitle: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    sendArea: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        padding: 10,
        backgroundColor: 'rgb(238,238,238)'
    }
})