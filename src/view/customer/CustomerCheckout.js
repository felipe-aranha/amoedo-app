import React from 'react';
import CustomerCart from './CustomerCart';
import { tertiaryColor, accountStyle, primaryColor, mainStyle, projectStyle, catalogStyle } from '../../style';
import { Button, Divider, ListItem } from 'react-native-elements';
import I18n from '../../i18n';
import { View, Modal, ScrollView, Keyboard, Alert, Platform, Picker } from 'react-native';
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
            paymentMethod: null,
            paymentMethodStep: 1,
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
            installments: 1,
            installmentsAvailable: [],
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
        const { onBack } = this.props;
        Actions.pop();
        onBack();
    }

    async componentDidMount(){
        this.loadCartItems();
        this.loadShipping().then(r => {
            if(r){
                this.loadCartItems();
            }
            else {
                this.context.message(I18n.t('checkout.error.shippingNotAvailable'))
                this.handleBack();
            }
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
                let error = false;
                if(response.length == 0) 
                    error = true;
                response.forEach(item => {
                    if(item.price == 0)
                        error = true;
                });
                if(error){
                    this.context.message(I18n.t('checkout.error.items'), 3000);
                    this.handleBack();
                    return;
                }
                this.setState({
                    loading: false,
                    selectedCart: response
                })
                this.closeModalLoading();
            }).catch(e => {
                this.handleBack();
            })
        })
    }

    togglePaymentModal(){
        this.setState({
            paymentModal: !this.state.paymentModal,
            paymentMethodStep: 1
        })
    }

    handleFormSubmit(){
        const { loading, shippingAddress, billingAddress, selectedCart, selectedPayment, card, paymentMethod, selectedShipping, installments } = this.state;
        if(loading) return;
        if(selectedShipping.amount == 'indisponível'){
            this.context.message(I18n.t('checkout.error.addressNotAvailable'));
            return;
        }
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
        if(selectedPayment == null && paymentMethod != 'billet'){
            this.context.message(I18n.t('checkout.error.noPayment'));
            return;
        }
        this.setState({
            loading: true
        },() => {
            this.openModalLoading();
            if(paymentMethod == 'billet'){
                this.checkoutService.orderBillet().then(order => {
                    this.handleOrderSuccess(order)
                }).catch(e => {
                    this.handleOrderError(e);
                })
            }
            else { 
                this.checkoutService.setCreditCardInfo(card.number,card.name,card.month,card.year,card.cvv,billingAddress).then(response => {
                    if(response.errors){
                        this.closeModalLoading();
                        this.context.message(I18n.t('checkout.error.generic'));
                        this.setState({
                            loading: false
                        })
                    } else {
                        this.checkoutService.order(response, installments).then( order => {
                            this.handleOrderSuccess(order);
                        }).catch(e => {
                            this.handleOrderError(e);
                        })
                    }
                }).catch(e => {
                    this.closeModalLoading();
                    this.context.message(I18n.t('checkout.error.generic'));
                    this.setState({
                        loading: false
                    })
                })
            }
        })
    }

    handleOrderSuccess(order){
        this.closeModalLoading();
        this.setState({
            loading: false
        })
        if(typeof(order) === 'object' && order.message)
            this.context.message(I18n.t('checkout.error.refused'),2000);
        else 
            Actions.reset('order', { order, project: this.props.project, paymentMethod: this.state.paymentMethod, room: this.props.room })
    }

    handleOrderError(e){
        this.closeModalLoading();
        this.context.message(I18n.t('checkout.error.generic'));
        this.setState({
            loading: false
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
        const { selectedPayment, paymentMethod, installments } = this.state;
        let label = I18n.t('checkout.add')
        if(selectedPayment != null && paymentMethod == 'credit'){
            label = `${I18n.t('checkout.creditLabel')} - ${installments}x`;
        }
        if(paymentMethod == 'billet')
        label = I18n.t('checkout.billetLabel');
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
        const { selectedCart, loading } = this.state;
        let value = I18n.t('checkout.loading');
        if(selectedCart && selectedCart.length && selectedCart.length > 0){
            let price = 0;
            selectedCart.forEach(i => {
                price += i.price * i.qty;
            });
            value = this.value2Currency(price)
        }
        
        return this.renderFooterItem(I18n.t('checkout.subtotal'),value);
    }

    renderShipping(){
        const { selectedShipping, loadingShipping } = this.state;
        value = loadingShipping ? I18n.t('checkout.loading') : 
            selectedShipping != null ? this.value2Currency(selectedShipping.amount) : I18n.t('checkout.unavailableShipping')
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
        return this.renderFooterItem(I18n.t('checkout.total'),this.value2Currency(price));
    }

    renderPaymentModal(){
        const { paymentMethod, paymentMethodStep, installments } = this.state;
        return(
            <Modal
                visible={this.state.paymentModal}
                animationType={'slide'}
                transparent={false}
                onRequestClose={() => {
                    this.setState({
                        paymentMethodStep: 1
                    })
                }}
            >
                <Header 
                    containerStyle={Platform.OS == 'android' ? {
                        borderBottomWidth: 0,
                        paddingTop:0,
                        height: 60
                    } : undefined}
                    title={paymentMethodStep == 1 ?  I18n.t('checkout.paymentMethodTitle') : paymentMethod == 'billet' ? I18n.t('checkout.billetTitle') : I18n.t('checkout.creditCardTitle')}
                    handleBack={this.togglePaymentModal.bind(this)}
                    leftIconColor={'rgb(226,0,6)'}
                    titleStyle={[accountStyle.registerHeaderText,{color: 'rgb(57,57,57)'}]}
                    backgroundColor={primaryColor}
                />
                {paymentMethodStep == 1 ?
                    this.renderPaymentMethods() :
                    this.renderCreditCardModal()
                }
            </Modal>
        )
    }

    renderPaymentMethods(){
        return(
            <View style={{flex:1, backgroundColor: 'rgb(238,238,238)'}}>
                <ListItem 
                    title={I18n.t('checkout.billetTitle')}
                    onPress={this.handleBillet.bind(this)}
                    titleStyle={catalogStyle.checkoutPaymentMethodText}
                    containerStyle={catalogStyle.checkoutPaymentMethodArea}
                    chevron={{
                        color: tertiaryColor,
                        name: 'chevron-right',
                        type: 'entypo'
                    }}
                />
                <ListItem 
                    title={I18n.t('checkout.creditCardTitle')}
                    onPress={this.handleCreditCard.bind(this)}
                    titleStyle={catalogStyle.checkoutPaymentMethodText}
                    containerStyle={catalogStyle.checkoutPaymentMethodArea}
                    chevron={{
                        color: tertiaryColor,
                        name: 'chevron-right',
                        type: 'entypo'
                    }}
                />
            </View>
        )
    }

    handleBillet(){
        this.setState({
            paymentMethodStep: 1,
            paymentMethod: 'billet',
            paymentModal: false
        })
    }

    handleCreditCard(){
        this.setState({
            paymentMethodStep: 2,
            paymentMethod: 'credit',
            installments: 1,
            installmentsAvailable: []
        },() => {
            this.getInstallments();
        })
    }

    getInstallments(){
        const { selectedCart, selectedShipping } = this.state;
        let price = 0;
        selectedCart.forEach(i => {
            price += i.price * i.qty;
        });
        if(selectedShipping != null) 
            price += selectedShipping.amount;
        this.checkoutService.getInstallments(price).then( result => {
            if(Array.isArray(result)){
                this.setState({
                    installmentsAvailable: result
                })
            }
        })
        
    }

    renderCreditCardModal(){
        return(
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
                    <View style={accountStyle.formRow}>
                        {Array.isArray(this.state.installmentsAvailable) && this.state.installmentsAvailable.length > 0 && 
                        <Picker
                            selectedValue={this.state.installments}
                            style={[{height: 60, flex: 1}, mainStyle.inputLabel, { fontSize: 10 }]}
                            onValueChange={(itemValue, itemIndex) => { this.setState({ installments: itemValue }) }}

                        >
                            {this.state.installmentsAvailable.map(i => {
                                return <Picker.Item style={mainStyle.inputLabel} key={i.id.toString()} label={i.label} value={i.id} />
                            })}
                        </Picker>
                        }
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