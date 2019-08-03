import React from 'react';
import CustomerCart from './CustomerCart';
import { tertiaryColor, accountStyle } from '../../style';
import { Button } from 'react-native-elements';
import I18n from '../../i18n';
import { View } from 'react-native';
import { MainContext } from '../../reducer';


export default class CustomerCheckout extends CustomerCart{

    static contextType = MainContext;

    isCheckout = true;

    componentDidMount(){
        this.loadCartItems();
        console.log(this.context.user.token);
    }

    loadCartItems(){
        if(this.state.loading) return;
        this.setState({
            loading: true
        },() => {
            this.openModalLoading();
            this.checkoutService.getCartItems().then(response => {
                this.setState({
                    loading: false,
                    selectedCart: response
                })
                this.closeModalLoading();
            })
        })
    }

    handleFormSubmit(){
        return;
    }

    renderSubmit(){
        return(
            <View style={{padding: 20}}>
                <Button 
                    title={I18n.t('checkout.finish')}
                    containerStyle={accountStyle.accountTypeButtonContainer}
                    buttonStyle={[accountStyle.accountTypeButton,{backgroundColor:tertiaryColor}]}
                    titleStyle={[accountStyle.accountTypeButtonTitle]}
                    onPress={this.handleFormSubmit.bind(this)}
                    loading={this.state.loading}
                />
            </View>
        )
    }

}