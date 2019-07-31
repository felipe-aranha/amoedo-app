import React from 'react';
import { View } from 'react-native';
import Customer from "../Customer";
import { primaryColor } from '../../style';
import I18n from '../../i18n';
import { MainContext } from '../../reducer';
import { ListItem } from 'react-native-elements';
import { SelectAddress } from '../../components/SelectAddress';

export default class CustomerCart extends Customer{

    static contextType = MainContext;

    barStyle = 'dark-content';
    barColor=primaryColor;
    titleStyle = {
        color: 'rgb(57,57,57)'
    }
    leftIconColor = 'rgb(226,0,6)';
    title= I18n.t('section.quote');

    constructor(props,context){
        super(props,context);
        this.state = {
            items: [],
            billingAddress: null,
            shippingAddress: null,
            cart: props.room.cart || [],
        }
    }

    renderLeftIcon(){
        return undefined;
    }

    componentDidMount(){
        // console.log(this.props.room);
    }
    renderAddresses(){
        return(
            <View>
                <SelectAddress type='shipping' />
                <SelectAddress type='billing' />
            </View>
        )
    }

    renderContent(){
        return(
            <>
                {this.renderAddresses()}
            </>
        )
    }

}