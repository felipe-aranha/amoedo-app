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

    constructor(props,context){
        super(props,context);
        this.state = {
            items: [],
            cart: props.room.cart || [],
            selectedCart: [],
            cartItems: props.cartItems,
            billingAddress: props.billingAddress,
            shippingAddress: props.shippingAddress,
            shippingMethods: null,
            selectedShipping: null,
            loading: false,
            loadingShipping: true,
        }
    }

    componentDidMount(){
        this.loadCartItems();
        this.loadShipping();
    }

    loadShipping(){
        this.checkoutService.getShippingMethods(this.state.shippingAddress, this.context.user.magento.email).then(response => {
            if(Array.isArray(response) && response.length > 0){
                let selectedShipping = null;
                if(response.length > 1) {
                    response.forEach( item => {
                        if(selectedShipping == null || selectedShipping.amount > item.amount){
                            selectedShipping = item;
                        }
                    })
                }
                else selectedShipping = response[0];
                if(selectedShipping != null){
                    this.setShippingMethod(selectedShipping)
                }
                this.setState({
                    shippingMethods: response,
                })
            }
        }).catch(e => {
            console.log(e);
            this.setState({
                loadingShipping: false
            })
        })
    }

    setShippingMethod(method){
        const { shippingAddress, billingAddress } = this.state;
        this.setState({loadingShipping: true})
        this.checkoutService.setShippingMethod(shippingAddress,billingAddress,this.context.user.magento.email,method).then(response => {
            console.log(response);
            this.setState({
                selectedShipping: method,
                loadingShipping: false
            })

        }).catch(e => {
            console.log(e);
            this.setState({
                selectedShipping: null,
                loadingShipping: false
            })
        });
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

    renderShipping(){
        return(
            <></>
        )
    }

    renderCartFooter(){
        return(
            <View style={{backgroundColor:'#fff',padding:20}}>
                {this.renderSubtotal()}
                {this.renderShipping()}
                {this.renderTotal()}
            </View>
        );
    }

    renderSubtotal(){
        const { selectedCart } = this.state;
        let price = 0;
        selectedCart.forEach(i => {
            price += i.price * i.qty;
        });
        return this.renderFooterItem(I18n.t('checkout.subtotal'),this.getCurrencyValue(price));
    }

    renderShipping(){
        const { selectedShipping, loadingShipping } = this.state;
        value = loadingShipping ? I18n.t('checkout.loading') : 
            selectedShipping != null ? this.getCurrencyValue(selectedShipping.amount) : I18n.t('checkout.unavailableShipping')
        return this.renderFooterItem(I18n.t('checkout.shipping'),value);
    }

    renderTotal(){
        const { selectedCart, selectedShipping } = this.state;
        let price = 0;
        selectedCart.forEach(i => {
            price += i.price * i.qty;
        });
        if(selectedShipping != null) 
            price += selectedShipping.amount;
        return this.renderFooterItem(I18n.t('checkout.total'),this.getCurrencyValue(price));
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