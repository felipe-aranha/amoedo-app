import React from 'react';
import { View, FlatList, Modal, TouchableOpacity, ScrollView } from 'react-native';
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
import { UserService } from '../../service/firebase/UserService';
import Product from '../catalog/Product';

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
            loading: false,
            project: props.project,
            activeProduct: null,
            updateList: new Date().getTime()
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
        this.cleanCart();
    }

    async loadShipping(){
        return this.checkoutService.getShippingMethods(this.state.shippingAddress, this.context.user.magento.email, this.state.billingAddress).then(response => {
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
                return true;
            } return false;
        }).catch(e => {
            console.log(e)
            this.setState({
                loadingShipping: false
            })
            return false;
        })
    }

    cleanCart(){
        this.openModalLoading();
        this.checkoutService.getCartItems().then(response =>{
            if(response.length > 0){
                response.forEach( async item => {
                    await this.checkoutService.deleteCartItem(item.item_id);
                });
                this.closeModalLoading();
            } else {
                this.closeModalLoading();
            }
        }).catch(() => {
            this.closeModalLoading();
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

    loadCartItems(){
        if(this.state.loading) return;
        this.setState({
            loading: true
        },() => {
            this.openModalLoading();
            this.state.cart.forEach((item,i) => {
                this.catalogService.getProductBySku(item.sku).then(response => {
                    if(response.sku){
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

    getQtyMultiplier(item){
        const value = this.getAttributeValue(item,'revestimento_m2_caixa');
        if(!value)
            return {
                unity: '',
                x: 1
            }
        else 
            return {
                unity: 'm²',
                x: Number(value) > 0 ? Number(value) : 1
            }
    }

    decrease(item){
        const multiplier = this.getQtyMultiplier(item);
        if(item.qty > multiplier.x){
            let newQty = 0;
            if(!Number.isInteger(multiplier.x))
                newQty = Number(Number(item.qty) - Number(multiplier.x)).toFixed(2);
            else 
                newQty = Number(item.qty) - Number(multiplier.x)
            this.setQty(item, newQty)
        }
    }

    async increase(item){
        let stock = this.getStock(item);
        const multiplier = this.getQtyMultiplier(item);
        if(stock == -1){
            const response = await this.catalogService.getProductBySku(item.sku);
            stock = this.getStock(response);
            response.qty = item.qty;
            const selectedCart = this.state.selectedCart.map(p => {
                if(p.sku == response.sku)
                    return response;
                return p;
            });
            await new Promise(resolve => {
                this.setState({ selectedCart }, () => { resolve() })
            })
        }
        if(Array.isArray(stock) && stock[0]){
            stock = stock[1] || 1
        }   
        if(item.qty < (stock * multiplier.x)){
            let newQty = 0;
            if(!Number.isInteger(multiplier.x))
                newQty = Number(Number(item.qty) + Number(multiplier.x)).toFixed(2);
            else 
                newQty = Number(item.qty) + Number(multiplier.x)
            this.setQty(item, newQty)
        }
        else if(item.qty == (stock * multiplier.x)){
            this.context.message('limite',1000)
        }
        else if(stock != -1){
            this.setQty(item,multiplier.x)
        }
    }

    setQty(item,qty){
        let found = false;
        const selectedCart = this.state.selectedCart.map(i => {
            if(i.sku == item.sku){
                found = i.qty != qty
                i.qty = qty;
            }
            return i;
        });
        if(found)
            this.setState({
                selectedCart,
                updateList: new Date().getTime()
            })
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
            regular: this.value2Currency(item.price),
            regularPrice: item.price,
            special: null,
            specialPrice: null
        }
        const specialPrice = this.getAttributeValue(item,'special_price');
        if(specialPrice){
            if(Number(specialPrice) < Number(item.price)){
                prices.special = this.value2Currency(specialPrice)
                prices.specialPrice = specialPrice
            }
        }
        return prices;
    }

    value2Currency(value){
        return `${I18n.t('catalog.currency')}${parseFloat(value).toFixed(2)}`;
    }

    toggleItem(item){
        if(this.isCheckout) return;
        let selectedCart = this.state.selectedCart.slice();
        const checked = selectedCart.find(i => i.sku == item.sku) || false;
        if(checked != false){
            selectedCart = this.state.selectedCart.slice().filter(i => i.sku != item.sku) || [];
        } else {
            const i = this.state.cart.find(c => c.sku == item.sku);
            if(i)
                selectedCart.push(i);
        }
        this.setState({
            selectedCart,
            updateList: new Date().getTime()
        },() => {
            // console.log(this.state.selectedCart);
        })
    }

    handleProductDetails(item){
        if(item && !this.isCheckout){
            this.setState({
                activeProduct: item
            })
        }
    }

    renderCartItem({item}){
        const { selectedCart } = this.state;
        const checked = selectedCart.find(i => i.sku == item.sku) || false;
        if(this.isCheckout && !checked) return <></>;
        const image = this.getProductImage(item);
        const prices = this.getProductPrices(item);
        const multiplier = this.getQtyMultiplier(item);
        const divider = Number.isInteger(multiplier.x) ? 
                            Math.ceil(Number(checked.qty) / multiplier.x) : 
                            Number(Number(checked.qty) / multiplier.x).toFixed(2);
        const value = checked ? Number(prices.specialPrice || prices.regularPrice) * divider : (prices.specialPrice || prices.regularPrice);
        return(
            <TouchableOpacity onPress={this.handleProductDetails.bind(this,checked)}>
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
                        <Text size={10} weight={'semibold'}>{this.value2Currency(value)}</Text>
                    </View>
                    <Divider />
                </View>
            </TouchableOpacity>
        )
    }

    renderCartItems(){
        return(
            <View style={{flex:1}}>
                {this.renderCartHeader()}
                <FlatList
                    key={`${this.state.updateList}${this.state.selectedCart.length}`}
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

    renderSubtotal(){
        const { cartItems, selectedCart } = this.state;
        let price = 0;
        cartItems.forEach(i => {
            const found = selectedCart.find(ii => ii.sku == i.sku);
            const prices = this.getProductPrices(i);
            if(found) {
                price += (prices.specialPrice || prices.regularPrice) * found.qty;
            }
        })
        return this.renderFooterItem(I18n.t('checkout.subtotal'),this.value2Currency(price));
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

    onBack(){
        this.cleanCart();
    }

    handleDetailsBack(item){
        const { selectedCart } = this.state;
        if(item && selectedCart){
            const found = selectedCart ? selectedCart.find(c => c.sku == item.sku) : false;
            if(found) 
                this.setQty(item, item.qty);
        }
        this.setState({ activeProduct: null })
    }

    handleFormSubmit(){
        if(this.state.loading) return;
        if(this.state.billingAddress == null){
            this.context.message(I18n.t('checkout.error.noBillingAddress'));
            return;
        }
        if(this.state.shippingAddress == null){
            this.context.message(I18n.t('checkout.error.noShippingAddress'));
            return;
        }
        if(this.state.selectedCart.length == 0){
            this.context.message(I18n.t('checkout.error.noCartItems'))
            return;
        }
        this.setState({
            loading: true
        }, async () => {
            this.checkoutService.getCart().then(response => {
                this.checkoutService.addToCart(this.state.selectedCart,response).then( async r => {
                    await this.loadShipping();
                    this.setState({
                        loading: false
                    },() => {
                        Actions.push('checkout', {
                            ...this.props,
                            cartItems: this.state.cartItems,
                            selectedCart: this.state.selectedCart,
                            billingAddress: this.state.billingAddress,
                            shippingAddress: this.state.shippingAddress,
                            onBack: this.onBack.bind(this)
                        })
                    })
                })
            }).catch(e => {
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

    renderProductModal(){
        return(
            <Modal
                visible={this.state.activeProduct != null}
                animationType={'slide'}
                onRequestClose={() => {}}
            >
                <Product 
                    item={this.state.activeProduct}
                    onBack={this.handleDetailsBack.bind(this)}
                    checkout
                />
            </Modal>
        )
    }

    renderContent(){
        return(
            <>
                <ScrollView>
                    {this.renderAddresses()}
                    {this.renderCartItems()}
                
                {this.renderSubmit()}
                </ScrollView>
                {this.renderProductModal()}
            </>
        )
    }

}