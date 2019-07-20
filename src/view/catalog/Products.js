import React from 'react';
import { CatalogService } from '../../service/CatalogService';
import { FlatList, View, Image, ActivityIndicator } from 'react-native';
import { Text } from '../../components';
import { MainContext } from '../../reducer';
import variables from '../../utils';
import I18n from '../../i18n';
import { catalogStyle, accountStyle, projectStyle } from '../../style';
import { AntDesign } from '@expo/vector-icons';
import { Button } from 'react-native-elements';

export default class Products extends React.PureComponent{

    static contextType = MainContext;

    constructor(props,context){
        super(props,context);
        this.catalogService = new CatalogService();
        this.baseUrl = `${variables.magento.baseURL}/pub/media/catalog/product`;
        this.state = {
            category: this.props.category || {id: 13},
            loading: false,
            refreshing: true,
            finished: false,
            products: [],
            pageIndex: 1,
            pageSize: 10,
            cart: this.props.cart || []
        }
    }

    componentDidMount(){
        this.loadProducts();
    }

    refresh(){
        this.setState({
            loading: false,
            refreshing: true,
            finished: false,
            pageIndex: 1
        },() => {
            this.loadProducts();
        })
    }

    onEndReached(){
        if(!this.state.finished && !this.state.loading){
            this.loadProducts();
        }
    }

    loadProducts(){
        const { loading, refreshing, products, pageIndex, pageSize, finished, category } = this.state;
        if(loading || finished) return;
        this.setState({
            loading: !refreshing
        },() => {
            this.catalogService.getProductsByCategory(category.id, pageSize, pageIndex).then(response => {
                
                let items = response.items || [];
                items = items.map(item => {
                    return {
                        ...item,
                        qty: 1
                    }
                })
                let p = [];
                if(refreshing) 
                    p = items;
                else 
                    p = products.slice().concat(items);
                this.setState({
                    products: p,
                    loading: false,
                    refreshing: false,
                    pageIndex: pageIndex+1,
                    finished: items.length < pageSize
                })
            }).catch(e => {
                console.log(e);
                this.setState({
                    loading: false,
                    refreshing: false
                })
            })
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
            regular: `${I18n.t('catalog.currency')}${parseFloat(item.price).toFixed(2)}`,
            special: null
        }
        const specialPrice = this.getAttributeValue(item,'special_price');
        if(specialPrice){
            if(Number(specialPrice) < Number(item.price)){
                prices.special = `${I18n.t('catalog.currency')}${parseFloat(specialPrice).toFixed(2)}`
            }
        }
        return prices;
    }

    addToCart(item){
        let cart = this.state.cart.slice();
        if(item.qty)
            cart[item.sku] = {
                name: item.name,
                sku: item.sku,
                qty: item.qty
            }
        else   
            cart = cart.filter(i => i.sku != item.sku);
        this.setState({cart})
        this.props.onCartChange(cart);
    }

    decrease(item){
        if(item.qty > 1)
        this.setQty(item,item.qty - 1)
    }

    increase(item){
        const stock = this.getAttributeValue(item,'quantity_and_stock_status') || 0;
        if(item.qty < stock){
            this.setQty(item,item.qty + 1)
        }
        else if(item.qty == stock){
            this.context.message('limite',1000)
        }
        else {
            this.setQty(item,stock)
        }
    }

    setQty(item,qty){
        const products = this.state.products.map(i => {
            if(i.id == item.id)
                i.qty = qty;
            return i;
        });
        this.setState({products})
    }

    handleFormSubmit(){
        this.props.onBack();
    }

    renderQty(item){
        const stock = this.getAttributeValue(item,'quantity_and_stock_status') || 0;
        return(
            <View style={catalogStyle.qtyArea}>
                <Text style={catalogStyle.qtdLabel}>{I18n.t('catalog.qty')}</Text>
                <AntDesign onPress={this.decrease.bind(this,item)} name={'minuscircleo'} size={16} color={'rgb(77,77,77)'} />
                <Text style={catalogStyle.qtyValue}>{item.qty}</Text>
                <AntDesign style={{opacity: item.qty < stock ? 1 : 0.5}} onPress={this.increase.bind(this,item)} name={'pluscircleo'} size={16} color={'rgb(77,77,77)'} />
            </View>
        )
    }

    renderPrice(item){
        const prices = this.getProductPrices(item);
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

    renderItem({item}){
        const image = this.getProductImage(item);
        return(
            <View style={catalogStyle.prodictListArea}>
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
                        numOfLines={2}
                    >{item.name}</Text>
                    {this.renderPrice(item)}
                    {this.renderQty(item)}
                </View>
                <View style={catalogStyle.actionArea}>
                    <Button
                        onPress={this.addToCart.bind(this,item)} 
                        containerStyle={catalogStyle.addButonContainer}
                        buttonStyle={catalogStyle.addButton}
                        titleProps={{
                            numberOfLines: 1,
                            style: catalogStyle.addButtonTitle
                        }}
                        title={I18n.t('catalog.add')}
                    />
                    <Button 
                        type={'outline'}
                        containerStyle={catalogStyle.detailsButtonContainer}
                        buttonStyle={catalogStyle.detailsButton}
                        titleProps={{
                            numberOfLines: 1,
                            style: catalogStyle.detailsButtonTitle
                        }}
                        title={I18n.t('catalog.details')}
                    />
                </View>
            </View>
        )
    }

    renderLoading(){
        if(this.state.loading)
            return <ActivityIndicator size={'large'} />
        return <></>
    }

    render(){
        return(
            <View style={{flex:1}}>
                <View style={{flex:1}}>
                    <FlatList 
                        data={this.state.products}
                        refreshing={this.state.refreshing}
                        onRefresh={this.refresh.bind(this)}
                        onEndReachedThreshold={0.7}
                        onEndReached={this.onEndReached.bind(this)}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={this.renderItem.bind(this)}
                        numColumns={2}
                        ListFooterComponent={this.renderLoading.bind(this)}
                    />
                </View>
                {this.state.cart.length > 0 &&
                    <View style={catalogStyle.continueButtonArea}>
                        <Button 
                            title={I18n.t('catalog.continue')}
                            containerStyle={accountStyle.accountTypeButtonContainer}
                            buttonStyle={[accountStyle.accountTypeButton,accountStyle.submitButton, projectStyle.projectSaveButton]}
                            titleStyle={[accountStyle.accountTypeButtonTitle,projectStyle.submitButtonTitle]}
                            onPress={this.handleFormSubmit.bind(this)}
                        />
                    </View>
                }
            </View>
        )
    }

}