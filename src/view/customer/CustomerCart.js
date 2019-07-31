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
            billingAddress: this.getDefaultAddress('billing'),
            shippingAddress: this.getDefaultAddress('shipping'),
            cart: props.room.cart || [],
        }
        console.log(this.state);
    }

    getDefaultAddress(type){
        const { magento } = this.context.user;
        return magento.addresses.find(address => address[`default_${type}`] == true) || null;
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
                <SelectAddress 
                    type='shipping'
                    selected={this.state.shippingAddress} 
                />
                <SelectAddress 
                    type='billing' 
                    selected={this.state.billingAddress}
                />
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