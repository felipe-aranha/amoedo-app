import { StyleSheet } from 'react-native';
import { default as style } from './variables';

export default StyleSheet.create({
    mainView: {
        backgroundColor: style.mainBgColor,
        flex: 1
    },
    wizardDot: {
        borderRadius: 5,
        width: 100,
        height: 5,
        backgroundColor: 'rgb(191,193,193)'
    },
    wizardActiveDot: {
        borderRadius: 5,
        width: 100,
        height: 5,
        backgroundColor: 'rgb(160,160,152)'
    }
})