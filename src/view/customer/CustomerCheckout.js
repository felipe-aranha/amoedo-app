import React from 'react';
import CustomerCart from './CustomerCart';
import { tertiaryColor, accountStyle, primaryColor, mainStyle, projectStyle } from '../../style';
import { Button, Divider } from 'react-native-elements';
import I18n from '../../i18n';
import { View, Modal, ScrollView, Keyboard, Alert, Platform } from 'react-native';
import { MainContext } from '../../reducer';
import { Header, Text, Input, DatePicker, KeyboardSpacer } from '../../components';
import { Actions } from 'react-native-router-flux';


export default class CustomerCheckout extends CustomerCart{

    static contextType = MainContext;

    isCheckout = true;

    title= I18n.t('section.payment');

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
            selectedPayment: null,
            paymentModal: false,
            cardLoading: false,
            cardNumber: '',
            cardDate: '',
            cardCvv: '',
            cardName: '',
            card: {
                number: '',
                month: '',
                year: '',
                name: '',
                cvv: ''
            }
        }
    }

    handleBack(){
        Actions.reset('customer',{index:1})
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
            this.setState({
                loadingShipping: false
            })
        })
    }

    setShippingMethod(method){
        const { shippingAddress, billingAddress } = this.state;
        this.setState({loadingShipping: true})
        this.checkoutService.setShippingMethod(shippingAddress,billingAddress,this.context.user.magento.email,method).then(response => {
            this.setState({
                selectedShipping: method,
                loadingShipping: false
            })

        }).catch(e => {
            this.setState({
                selectedShipping: null,
                loadingShipping: false
            })
        });
    }

    handleCardSubmit(){
        Keyboard.dismiss();
        const { cardLoading, cardNumber, cardDate, cardCvv, cardName, billingAddress } = this.state;
        if(cardLoading) return;
        this.setState({
            cardLoading: true
        },() => {
            const month = cardDate.split('/')[0];
            const year = cardDate.split('/')[1] || '';
            this.checkoutService.setCreditCardInfo(cardNumber,cardName,month,year,cardCvv,billingAddress).then(response => {
                if(response.errors){
                    Alert.alert('',I18n.t('checkout.card.error'));
                    this.setState({
                        cardLoading: false,
                        selectedPayment: null
                    })
                } else {
                    this.setState({
                        selectedPayment: response,
                        cardLoading: false,
                        card: {
                            number: cardNumber,
                            name: cardName,
                            cvv: cardCvv,
                            month,
                            year
                        }
                    })
                    this.togglePaymentModal();
                }
                
                
            }).catch(e => {
                Alert.alert('',I18n.t('checkout.card.error'));
                this.setState({
                    cardLoading: false
                })
            })
        })
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

    togglePaymentModal(){
        this.setState({
            paymentModal: !this.state.paymentModal
        })
    }

    handleFormSubmit(){
        const { loading, shippingAddress, billingAddress, selectedCart, selectedPayment, card } = this.state;
        if(loading) return;
        if(billingAddress == null){
            this.context.message(I18n.t('checkout.error.noBillingAddress'));
            return;
        }
        if(shippingAddress == null){
            this.context.message(I18n.t('checkout.error.noShippingAddress'));
            return;
        }
        if(selectedCart.length == 0){
            this.context.message(I18n.t('checkout.error.noCartItems'));
            return;
        }
        if(selectedPayment == null){
            this.context.message(I18n.t('checkout.error.noPayment'));
            return;
        }
        this.setState({
            loading: true
        },() => {
            this.openModalLoading();
            this.checkoutService.setCreditCardInfo(card.number,card.name,card.month,card.year,card.cvv,billingAddress).then(response => {
                if(response.errors){
                    this.closeModalLoading();
                    this.context.message(I18n.t('checkout.error.generic'));
                } else {
                    this.checkoutService.order(response).then( order => {
                        this.closeModalLoading();
                        Actions.reset('order',{order})
                    }).catch(e => {
                        this.closeModalLoading();
                        this.context.message(I18n.t('checkout.error.generic'));
                    })
                }
            }).catch(e => {
                console.log(e);
                this.closeModalLoading();
                this.context.message(I18n.t('checkout.error.generic'));
            })
        })
    }

    renderShipping(){
        return(
            <></>
        )
    }

    handleCardNumberChange(cardNumber){
        if(this.state.cardLoading) return;
        this.setState({cardNumber})
    }

    handleCardDateChange(cardDate){
        if(this.state.cardLoading) return;
        this.setState({cardDate})
    }

    handleCardCvvChange(cardCvv){
        if(this.state.cardLoading) return;
        this.setState({cardCvv})
    }

    handleCardNameChange(cardName){
        if(this.state.cardLoading) return;
        this.setState({cardName})
    }

    renderCartFooter(){
        return(
            <View style={{backgroundColor:'#fff',padding:20}}>
                {this.renderSubtotal()}
                {this.renderShipping()}
                {this.renderTotal()}
                {this.renderPayment()}
            </View>
        );
    }

    renderPayment(){
        const { selectedPayment } = this.state;
        let label = I18n.t('checkout.add')
        if(selectedPayment != null){
            label = 'Crédito'
        }
        return(
            <View style={{paddingVertical: 20}}>
                <View style={{marginBottom:20}}>
                    <Text weight={'bold'} size={14}>{I18n.t('checkout.payment')}</Text>
                </View>
                <Divider />
                <View style={{flexDirection: 'row', alignItems:'center',paddingVertical: 10}}>
                    <Text weight={'medium'} size={10} color={'rgb(57,57,57)'} style={{textAlign:'left',flex:1}}>{I18n.t('checkout.paymentMethod')}</Text>
                    <Text 
                        weight={'medium'} size={10}
                        color={tertiaryColor}
                        onPress={this.togglePaymentModal.bind(this)} 
                        style={{textAlign:'right',flex:1}}
                    >{label}</Text>
                </View>
                {this.renderPaymentModal()}
                <Divider />
            </View>
        )
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

    renderPaymentModal(){
        return(
            <Modal
                visible={this.state.paymentModal}
                animationType={'slide'}
                transparent={false}
                onRequestClose={() => {}}
            >
                <Header 
                    containerStyle={Platform.OS == 'android' ? {
                        borderBottomWidth: 0,
                        paddingTop:0,
                        height: 60
                    } : undefined}
                    title={I18n.t('checkout.creditCardTitle')}
                    handleBack={this.togglePaymentModal.bind(this)}
                    leftIconColor={'rgb(226,0,6)'}
                    titleStyle={[accountStyle.registerHeaderText,{color: 'rgb(57,57,57)'}]}
                    backgroundColor={primaryColor}
                />
                <View style={[mainStyle.mainView,{padding:20}]}>
                    <ScrollView>
                        <View style={accountStyle.formRow}>
                            <Input 
                                label={I18n.t('checkout.card.number')}
                                keyboardType={'numeric'}
                                value={this.state.cardNumber}
                                onChangeText={this.handleCardNumberChange.bind(this)}
                            />
                        </View>
                        <View style={accountStyle.formRow}>
                            <DatePicker 
                                label={I18n.t('checkout.card.date')}
                                type={'datetime'}
                                options={{
                                    format: 'MM/YYYY'
                                }}
                                value={this.state.cardDate}
                                onChangeText={this.handleCardDateChange.bind(this)}
                            />
                            <Input 
                                label={I18n.t('checkout.card.cvv')}
                                keyboardType={'numeric'}
                                value={this.state.cardCvv}
                                onChangeText={this.handleCardCvvChange.bind(this)}
                            />
                        </View>
                        <View style={accountStyle.formRow}>
                            <Input 
                                label={I18n.t('checkout.card.name')}
                                value={this.state.cardName}
                                onChangeText={this.handleCardNameChange.bind(this)}
                            />
                        </View>
                    </ScrollView>
                    <View style={{flex:1, justifyContent: 'flex-end',marignTop:20}}>
                        <Button 
                            title={I18n.t('checkout.card.save')}
                            containerStyle={accountStyle.accountTypeButtonContainer}
                            buttonStyle={[accountStyle.accountTypeButton,accountStyle.submitButton, projectStyle.projectSaveButton]}
                            titleStyle={[accountStyle.accountTypeButtonTitle,projectStyle.submitButtonTitle]}
                            onPress={this.handleCardSubmit.bind(this)}
                            loading={this.state.cardLoading}
                        />
                    </View>
                </View>
            </Modal>
        )
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