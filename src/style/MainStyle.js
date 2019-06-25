import { StyleSheet } from 'react-native';
import { default as style, deviceWidth, relativeWidth } from './variables';

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
    },
    floatButtonTextStyle: {
        textAlign: 'center',
        fontFamily: 'system-semibold',
        fontSize: 12,
        marginTop: 5,
        color: '#fff'
    },
    floatButtonArea: {
        position:'absolute',
        right: relativeWidth(5),
        top: 37.5,
        zIndex: 2
    },
    emptyListArea: {
        width: 160,
        height: 160,
        borderRadius: 80,
        borderWidth: 5,
        borderColor: 'rgb(84,84,84)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    emptyListImage: {
        width: 80,
        height: 80
    },
    listArea: {
        flex:1, 
        justifyContent: 'center',
        alignItems: 'center'
    },
    searchInputContainer: {
        width: deviceWidth,
        backgroundColor:'#fff',
        height:50,
        borderBottomWidth:0
    },
    emptyListTitle: {
        fontFamily: 'system-bold',
        fontSize: 16,
        textAlign: 'center'
    },
    emptyListSubtitle: {
        marginTop: 5,
        fontFamily: 'system-semibold',
        textAlign: 'center'
    },
    emptyListTextArea: {
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30
    }
})