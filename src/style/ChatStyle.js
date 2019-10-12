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
    }
})