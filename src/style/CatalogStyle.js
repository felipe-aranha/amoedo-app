import { StyleSheet } from 'react-native';
import { secondaryColor } from './variables';

export default StyleSheet.create({
    categoryListTitle: {
        fontFamily: 'system-bold',
        fontSize: 14,
        textTransform: 'uppercase',
        color: secondaryColor
    },
    list: {
        backgroundColor: '#fff',
        marginHorizontal: 20
    },
    listContainer: {
        paddingHorizontal: 0,
        paddingVertical: 25
    },
    productListArea: {
        flex:0.5,
        borderWidth: 1,
        borderRadius: 4,
        borderColor: 'rgb(179,179,179)',
        backgroundColor: '#fff',
        margin: 10,
        paddingTop: 10
    },
    productListImage: {
        width: '100%',
        height: 80
    },
    productPrice: {
        fontFamily: 'system-bold',
        fontSize: 12,
        color: 'rgb(255,0,0)'
    },
    productPriceLine: {
        textDecorationLine: 'line-through'
    },
    priceArea: {
        height: 40
    },
    fromTo: {
        fontFamily: 'system-bold',
        fontSize: 10,
        color: 'rgb(112,112,112)'
    },
    qtyArea: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginVertical: 10
    },
    qtdLabel: {
        fontFamily: 'system-semibold',
        fontSize: 10,
        marginRight: 15
    },
    qtyValue: {
        fontFamily: 'system-semibold',
        fontSize: 10,
        marginHorizontal: 15
    },
    actionArea: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    addButonContainer: {
        flex:1,
        marginVertical:10,
        marginLeft: 10,
        marginRight: 5
    },
    addButton:{
        backgroundColor:'rgb(226,0,6)',
        borderRadius: 5
    },
    addButtonTitle: {
        fontFamily: 'system-semibold',
        color: '#fff',
        fontSize: 10
    },
    detailsButtonContainer:{
        flex:1,
        marginVertical:10,
        marginLeft: 0,
        marginRight: 10
    },
    detailsButton:{
        borderColor:'rgb(77,77,77)',
        borderRadius: 5
    },
    detailsButtonTitle:{
        fontFamily: 'system-semibold',
        color: 'rgb(77,77,77)',
        fontSize: 10
    },
    deleteButtonTitle:{
        fontFamily: 'system-semibold',
        color: 'rgb(77,77,77)',
        fontSize: 14
    },
    continueButtonArea: {
        justifyContent: 'center',
        height: 60,
        marginVertical: 20,
        paddingHorizontal: 20
    }

})