import React from 'react';
import { View, FlatList } from 'react-native';
import Customer from "../Customer";
import { primaryColor, accountStyle, catalogStyle } from '../../style';
import I18n from '../../i18n';
import { MainContext } from '../../reducer';
import { ListItem, Button, Image, Divider } from 'react-native-elements';
import { SelectAddress } from '../../components/SelectAddress';
import { CatalogService } from '../../service/CatalogService';
import { Check, Text } from '../../components';
import variables from '../../utils';
import { CheckoutService } from '../../service/CheckoutService';
import { Actions } from 'react-native-router-flux';

export default class CustomerCart extends Customer{

    static contextType = MainContext;

    barStyle = 'dark-content';
    barColor=primaryColor;
    titleStyle = {
        color: 'rgb(57,57,57)'
    }
    leftIconColor = 'rgb(226,0,6)';
    title= I18n.t('section.quote');
    isCheckout = false;

    constructor(props,context){
        super(props,context);
        this.catalogService = new CatalogService();
        this.checkoutService = new CheckoutService(this.context.user.token);
        this.baseUrl = `${variables.magento.baseURL}/pub/media/catalog/product`;
        this.state = {
            items: [],
            billingAddress: this.getDefaultAddress('billing'),
            shippingAddress: this.getDefaultAddress('shipping'),
            cart: props.room.cart || [],
            cartItems: props.cartItems || [],
            selectedCart: props.selectedCart || this.isCheckout ? [] : props.room.cart || [],
            loading: false
        }
    }

    getDefaultAddress(type){
        const { magento } = this.context.user;
        return magento.addresses.find(address => address[`default_${type}`] == true) || null;
    }

    renderLeftIcon(){
        return undefined;
    }

    componentDidMount(){
        if(this.state.cart.length > this.state.cartItems.length){
            this.loadCartItems();
        }
        this.checkoutService.getCartItems().then(response =>{
            if(response.length > 0){
                response.forEach(item => {
                    this.checkoutService.deleteCartItem(item.item_id);
                })
            }
        })
    }

    loadCartItems(){
        if(this.state.loading) return;
        this.setState({
            loading: true
        },() => {
            this.openModalLoading();
            this.state.cart.forEach((item,i) => {
                this.catalogService.getProductBySku(item.sku).then(response => {
                    if(response.sku){
                        response.qty = item.qty;
                        const cartItems = this.state.cartItems.slice();
                        cartItems.push(response);
                        this.setState({cartItems})
                    }
                    if(i == this.state.cart.length - 1){
                        this.closeModalLoading();
                        this.setState({
                            loading: false
                        })
                    }
                }).catch(e => {
                    console.log(e);
                })
            })
        })
    }

    handleShippingAddressChange(shippingAddress){
        this.setState({shippingAddress})
    }
    handleBillingAddressChange(billingAddress){
        this.setState({billingAddress});
    }

    renderAddresses(){
        return(
            <View>
                <SelectAddress 
                    type='shipping'
                    selected={this.state.shippingAddress} 
                    onSelect={this.handleShippingAddressChange.bind(this)}
                />
                <SelectAddress 
                    type='billing' 
                    selected={this.state.billingAddress}
                    onSelect={this.handleBillingAddressChange.bind(this)}
                />
            </View>
        )
    }

    getAttributeValue(item,attribute){
        const attr = item.custom_attributes.find(attr => attr.attribute_code == attribute);
        return attr ? attr.value : undefined;
    }

    getProductImage(item){
        const image = this.getAttributeValue(item,'image');
        return image ? `${this.baseUrl}${image}` : null;
    }

    getProductPrices(item){
        let prices = {
            regular: `${I18n.t('catalog.currency')}${parseFloat(item.price).toFixed(2)}`,
            regularPrice: item.price,
            special: null,
            specialPrice: null
        }
        const specialPrice = this.getAttributeValue(item,'special_price');
        if(specialPrice){
            if(Number(specialPrice) < Number(item.price)){
                prices.special = `${I18n.t('catalog.currency')}${parseFloat(specialPrice).toFixed(2)}`
                prices.specialPrice = specialPrice
            }
        }
        return prices;
    }

    toggleItem(item){
        return;
        if(this.isCheckout) return;
        let selectedCart = this.state.selectedCart.slice();
        const checked = selectedCart.find(i => i.sku = item.sku) || false;
        if(checked != false){
            selectedCart = this.state.selectedCart.slice().filter(i => i.sku != item.sku) || [];
        } else {
            selectedCart.push(item);
        }
        this.setState({
            selectedCart
        },() => {
            // console.log(this.state.selectedCart);
        })
    }

    renderCartItem({item}){
        const { selectedCart } = this.state;
        const checked = selectedCart.find(i => i.sku = item.sku) || false;
        if(this.isCheckout && !checked) return <></>;
        const image = this.getProductImage(item);
        const prices = this.getProductPrices(item);
        return(
            <View
                style={{
                    flexDirection: 'row',
                    backgroundColor: '#fff',
                    paddingHorizontal:20,
                    paddingVertical: 10,
                }}
            >
                <View style={{
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Check 
                        checked={checked != false}
                        onPress={this.toggleItem.bind(this,item)}
                    />
                </View>
                <View>
                    <Image 
                        source={{uri: image}}
                        resizeMode={'contain'}
                        style={{
                            width: 80,
                            height: 50
                        }}
                    />
                </View>
                <View>
                    <Text weight={'medium'} size={10}>{checked.qty}</Text>
                </View>
                <View style={{flex:1, paddingHorizontal: 10}}>
                    <Text weight={'medium'} size={10}>{item.name}</Text>
                </View>
                <View style={{alignSelf:'flex-end'}}>
                    <Text size={10} weight={'semibold'}>{prices.special || prices.regular}</Text>
                </View>
                <Divider style={{ backgroundColor: 'rgba(77,77,77,0.8)' }} />
            </View>
        )
    }

    renderCartItems(){
        return(
            <View style={{flex:1}}>
                {this.renderCartHeader()}
                <FlatList
                    key={this.state.selectedCart.length}
                    data={this.state.cartItems}
                    renderItem={this.renderCartItem.bind(this)}
                    keyExtractor={(i,k) => k.toString()}
                    removeClippedSubviews={false}
                />
                {this.renderCartFooter()}
            </View>
        )
    }

    renderCartHeader(){
        const { room, project } = this.props;
        return(
            <View style={{backgroundColor:'#fff',padding:20}}>
                <Text weight={'bold'} size={12} >{`${room.room.label} - ${project.data.name}`}</Text>
            </View>
        );
    }

    renderCartFooter(){
        return(
            <View style={{backgroundColor:'#fff',padding:20}}>
                {this.renderSubtotal()}
            </View>
        );
    }

    getCurrencyValue(value){
        return `R$ ${value.toFixed(2)}`;
    }

    renderSubtotal(){
        const { cartItems, selectedCart } = this.state;
        let price = 0;
        cartItems.forEach(i => {
            const found = selectedCart.find(ii => ii.sku == i.sku);
            if(found)
                price += i.price * found.qty;
        })
        return this.renderFooterItem(I18n.t('checkout.subtotal'),this.getCurrencyValue(price));
    }

    renderFooterItem(label,value){
        return(
            <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <View style={{flex:1,flexDirection:'row',justifyContent:'flex-start'}}>
                    <Text weight={'medium'} size={10} color={'rgb(57,57,57)'} >{label}</Text>
                </View>
                <View style={{flex:1,flexDirection:'row',justifyContent:'flex-end'}}>
                <Text weight={'medium'} size={10} color={'rgb(57,57,57)'} >{value}</Text>
                </View>
            </View>
        )
    }

    handleFormSubmit(){
        if(this.state.loading) return;
        if(this.state.billingAddress == null){
            this.context.message('checkout.error.noBillingAddres');
            return;
        }
        if(this.state.shippingAddress == null){
            this.context.message('checkout.error.noShippingAddres');
            return;
        }
        if(this.state.selectedCart.length == 0){
            this.context.message('checkout.error.noCartItems')
            return;
        }
        this.setState({
            loading: true
        }, () => {
            this.checkoutService.getCart().then(response => {
                this.checkoutService.addToCart(this.state.selectedCart,response).then(r => {
                    this.setState({
                        loading: false
                    },() => {
                        Actions.push('checkout', {
                            ...this.props,
                            cartItems: this.state.cartItems,
                            billingAddress: this.state.billingAddress,
                            shippingAddress: this.state.shippingAddress
                        })
                    })
                })
            }).catch(e => {
                console.log(e);
                this.setState({
                    loading: false
                })
            })
        })
    }

    renderSubmit(){
        return(
            <View style={{padding: 20}}>
                <Button 
                    title={I18n.t('checkout.send')}
                    containerStyle={accountStyle.accountTypeButtonContainer}
                    buttonStyle={[accountStyle.accountTypeButton,{backgroundColor:primaryColor}]}
                    titleStyle={[accountStyle.accountTypeButtonTitle,{color:'rgb(57,57,57)'}]}
                    onPress={this.handleFormSubmit.bind(this)}
                    loading={this.state.loading}
                />
            </View>
        )
    }

    renderContent(){
        return(
            <>
                {this.renderAddresses()}
                {this.renderCartItems()}
                {this.renderSubmit()}
            </>
        )
    }

}