import React from 'react';
import { View, FlatList, Modal, TouchableOpacity, ScrollView } from 'react-native';
import Customer from "../Customer";
import { primaryColor, accountStyle, catalogStyle, drawerStyle, tertiaryColor } from '../../style';
import I18n from '../../i18n';
import { MainContext } from '../../reducer';
import { ListItem, Button, Image, Divider, CheckBox } from 'react-native-elements';
import { SelectAddress } from '../../components/SelectAddress';
import { CatalogService } from '../../service/CatalogService';
import { Check, Text, GradientButton } from '../../components';
import variables, { ProductUtils } from '../../utils';
import { CheckoutService } from '../../service/CheckoutService';
import { Actions } from 'react-native-router-flux';
import { UserService } from '../../service/firebase/UserService';
import Product from '../catalog/Product';
import { AntDesign } from '@expo/vector-icons';
import Catalog from '../catalog/Catalog';

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
        const room = props.room || {};
        this.state = {
            items: [],
            billingAddress: this.getDefaultAddress('billing'),
            shippingAddress: this.getDefaultAddress('shipping'),
            cart: room.cart || [],
            cartItems: props.cartItems || [],
            selectedCart: props.selectedCart || this.isCheckout ? [] : room.cart || [],
            loading: false,
            project: props.project || null,
            activeProduct: null,
            updateList: new Date().getTime(),
            showCatalog: false,
            room: props.room
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
        super.componentDidMount();
        const room = this.state.room || false;
        if(room != false){
            if(this.state.cart.length > this.state.cartItems.length){
                this.loadCartItems();
            }
            this.cleanCart();
        } else {
            this.openModalLoading();
            const myId = this.context.user.magento.email;
            const myProjects = UserService.getCustomerProjects(myId);
            const { budgetID } = this.props;
            console.log(budgetID);
            if(!budgetID){
                this.closeModalLoading();
                Actions.pop();
            }
            myProjects.get().then( snapshot => {
                if(snapshot.empty){
                    this.closeModalLoading();
                    Actions.pop();
                } else {
                    let myProject = false;
                    let myRoom = false;
                    snapshot.docs.forEach( doc => {
                        const data = doc.data();
                        const id = doc.id;
                        const project = {
                            ...data,
                            id,
                        }
                        data.data.rooms.forEach(room => {
                            if(room.id == budgetID){
                                myRoom = room;
                                myProject = project
                            }
                        })
                    });
                    this.closeModalLoading();
                    if(!myProject || !myRoom){
                        this.closeModalLoading();
                        Actions.pop();
                    }
                    this.setState({
                        cart: myRoom.cart,
                        project: myProject,
                        room: myRoom
                    })
                }
            }).catch(e => {
                console.log(e);
                this.closeModalLoading();
                Actions.pop();
            })
        }
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
            loading: true,
            cartItems: []
        },() => {
            this.state.cart.forEach((item,i) => {
                this.catalogService.getProductBySku(item.sku).then(response => {
                    if(response.sku){
                        const cartItems = this.state.cartItems.slice();
                        cartItems.push(response);
                        this.setState({cartItems})
                    }
                    if(i == this.state.cart.length - 1){
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

    decrease(item){
        const { selectedCart } = this.state;
        const checked = selectedCart.find(i => i.sku == item.sku) || false;
        const multiplier = ProductUtils.getQtyMultiplier(item);
        if(checked.qty > multiplier.x){
            let newQty = 0;
            if(!Number.isInteger(multiplier.x))
                newQty = Number(Number(checked.qty) - Number(multiplier.x)).toFixed(2);
            else 
                newQty = Number(checked.qty) - Number(multiplier.x)
            this.setQty(item, newQty)
        }
    }

    async increase(item){
        const { selectedCart } = this.state;
        const checked = selectedCart.find(i => i.sku == item.sku) || false;
        let stock = ProductUtils.getStock(item);
        const multiplier = ProductUtils.getQtyMultiplier(item);
        if(stock == -1){
            const response = await this.catalogService.getProductBySku(item.sku);
            stock = ProductUtils.getStock(response);
            response.qty = checked.qty;
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
        if(checked.qty < (stock * multiplier.x)){
            let newQty = 0;
            if(!Number.isInteger(multiplier.x))
                newQty = Number(Number(checked.qty) + Number(multiplier.x)).toFixed(2);
            else 
                newQty = Number(checked.qty) + Number(multiplier.x)
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
            selectedCart
        },() => {
            // console.log(this.state.selectedCart);
        })
    }

    toggleCatalog(){
        this.setState({
            showCatalog: !this.state.showCatalog
        })
    }

    handleProductDetails(item){
        if(item && !this.isCheckout){
            this.setState({
                activeProduct: item
            })
        }
    }

    renderPrice(item){
        const prices = ProductUtils.getProductPrices(item);
        return(
            <View style={catalogStyle.priceArea}>
                <Text style={catalogStyle.fromTo}>
                    {prices.special != null && I18n.t('catalog.from')}
                    <Text style={[catalogStyle.productPrice,prices.special != null && catalogStyle.productPriceLine]}>{prices.regular}</Text>
                </Text>
                {prices.special != null &&
                    <Text style={catalogStyle.fromTo}>{I18n.t('catalog.to')}<Text style={catalogStyle.productPrice}>{prices.special}</Text></Text>
                }
            </View>
        )
    }

    renderQty(item,big=false){
        const { selectedCart } = this.state;
        const checked = selectedCart.find(i => i.sku == item.sku) || false;
        const multiplier = ProductUtils.getQtyMultiplier(item);
        const qty = multiplier.unity == '' ? checked.qty : `${checked.qty} ${multiplier.unity}`;
        return(
            <View style={catalogStyle.qtyArea}>
                <Text style={catalogStyle.qtdLabel}>{I18n.t('catalog.qty')}</Text>
                <AntDesign onPress={this.decrease.bind(this,item)} name={'minuscircleo'} size={big? 20 : 16} color={'rgb(77,77,77)'} />
                <Text style={catalogStyle.qtyValue}>{qty}</Text>
                <AntDesign onPress={this.increase.bind(this,item)} name={'pluscircleo'} size={big? 20 : 16} color={'rgb(77,77,77)'} />
            </View>
        )
    }

    renderCartItem({item}){
        const { selectedCart } = this.state;
        const image = ProductUtils.getProductImage(item);
        const checked = selectedCart.find(i => i.sku == item.sku) || false;
        return(
            <TouchableOpacity style={{flex:0.5}} onPress={this.handleProductDetails.bind(this,checked)}>
                <View style={catalogStyle.productListArea}>
                    {!this.isCheckout && 
                        <View style={{ flexDirection: 'row', justifyContent: 'center'}}>
                            <CheckBox 
                                checked={checked != false}
                                onPress={this.toggleItem.bind(this,item)}
                                checkedIcon={'check'}
                                checkedColor={tertiaryColor}
                                containerStyle={{ padding: 0 }}
                            />
                        </View>
                    }
                    
                        {image != null &&
                            <Image 
                                source={{uri: image}}
                                resizeMode={'contain'}
                                style={catalogStyle.productListImage}
                            />
                        }
                    <View style={{
                        padding: 10
                    }}>
                        <Text 
                            numberOfLines={2}
                            weight={'medium'} 
                            size={12}
                        >{item.name}</Text>
                        {this.renderPrice(item)}
                        {!this.isCheckout && checked && this.renderQty(item)}
                        
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    _renderCartItem({item}){
        const { selectedCart } = this.state;
        const checked = selectedCart.find(i => i.sku == item.sku) || false;
        if(this.isCheckout && !checked) return <></>;
        const image = ProductUtils.getProductImage(item);
        const prices = ProductUtils.getProductPrices(item);
        const multiplier = ProductUtils.getQtyMultiplier(item);
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
                                width: 70,
                                height: 50,
                                marginHorizontal: 5
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
                        <Text size={10} weight={'semibold'}>{ProductUtils.value2Currency(value)}</Text>
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
                    key={`${this.state.updateList}`}
                    data={this.state.cartItems}
                    renderItem={this.renderCartItem.bind(this)}
                    keyExtractor={(i,k) => k.toString()}
                    removeClippedSubviews={false}
                    numColumns={2}
                    extraData={this.state.selectedCart}
                />
                {this.renderCartFooter()}
            </View>
        )
    }

    renderCartHeader(){
        const room = this.state.room || {};
        const label = room.room ? room.room.label || '' : '';
        const project = this.state.project || {};
        const data = project.data || { name: '' };
        return(
            <View style={{backgroundColor:'#fff',padding:20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <View style={{flex:1, alignItems: 'flex-start'}}>
                    <Text numberOfLines={1} style={{textAlign: 'left'}} weight={'bold'} size={12} >{room.name || `${label} - ${data.name}`}</Text>
                </View>
                {!this.isCheckout &&
                <View style={{flex:1, alignItems: 'flex-end'}}>
                    <GradientButton
                        vertical
                        colors={['rgb(170,4,8)','rgb(226,0,6)']}
                        width={26}
                        height={26}
                        title={<AntDesign size={18} name={'plus'} />}
                        titleStyle={drawerStyle.editText}
                        onPress={this.toggleCatalog.bind(this)}
                    />
                </View>
                }
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
            const prices = ProductUtils.getProductPrices(i);
            if(found) {
                price += (prices.specialPrice || prices.regularPrice) * found.qty;
            }
        })
        return this.renderFooterItem(I18n.t('checkout.subtotal'),ProductUtils.value2Currency(price));
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
                            ...this.state,
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

    handleCatalogChange(_cart){
        this.toggleCatalog();
        let changed = false;
        const selectedCart = this.state.selectedCart.slice();
        const cart = this.state.cart.slice();
        _cart.forEach(c => {
            const found = this.state.cart.find(cc => cc.sku == c.sku);
            if(!found){
                changed = true;
                selectedCart.push(c);
                cart.push(c);
            } 
        })
        if(changed){
            this.setState({
                cart,
                selectedCart
            }, () => {
                this.loadCartItems();
            })
        }
    }

    renderCatalog(){
        return(
            <Modal
                animationType={'slide'}
                visible={this.state.showCatalog}
                onRequestClose={() => {}}
            >
                <Catalog 
                    cart={this.state.selectedCart}
                    onBack={this.handleCatalogChange.bind(this)}
                    modal
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
                {!this.isCheckout &&
                    this.renderProductModal()
                }
                {this.renderCatalog()}
            </>
        )
    }

}