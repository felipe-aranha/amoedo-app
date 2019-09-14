import { StyleSheet } from 'react-native';
import { default as style, deviceWidth, relativeWidth, secondaryColor } from './variables';

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
    searchInput: {
        paddingHorizontal: 10,
        fontFamily: 'system-semibold',
        fontSize: 16,
        color: 'rgb(77,77,77)'
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
    },
    sectionArea: {
        paddingHorizontal: 20,
        paddingVertical:30,
    },
    sectionTitle: {
        fontFamily: 'system-bold',
        fontSize: 24,
        color: 'rgb(77,77,77)'
    },
    sectionSubtitle: {
        marginTop: 5,
        fontFamily: 'system-medium',
        fontSize: 12,
        color: 'rgb(132,132,132)'
    },
    inputLabel: {
        fontFamily: 'system-medium',
        color: 'rgb(77,77,77)',
        fontSize: 12,
        fontWeight: 'normal'
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
    textArea: {
        backgroundColor: '#fff',
        marginVertical: 10,
        height: 90,
        fontFamily: 'system-medium',
        color: secondaryColor,
        fontSize: 14,
        textAlignVertical: 'top',
        padding: 5
    },
    textAreaContainer: {
        flex:1, 
    }
});

export const tagsStyles = {
    p: {
        fontSize: 14,
        fontFamily: 'system',
        color: 'rgb(77,77,77)',
        marginTop: 10
    },
    a: {
        color: secondaryColor,
        textDecorationLine: 'none'
    }
}