import React from 'react';
import { CatalogService } from '../../service/CatalogService';
import { FlatList, View, Image, ActivityIndicator, Modal } from 'react-native';
import { Text } from '../../components';
import { MainContext } from '../../reducer';
import variables from '../../utils';
import I18n from '../../i18n';
import { catalogStyle, accountStyle, projectStyle } from '../../style';
import { AntDesign } from '@expo/vector-icons';
import { Button } from 'react-native-elements';

export default class ProductBase extends React.PureComponent{

    static contextType = MainContext;

    constructor(props,context){
        super(props,context);
        this.catalogService = new CatalogService();
        this.baseUrl = `${variables.magento.baseURL}/pub/media/catalog/product`;
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

    getProducts(){
        const { pageIndex, pageSize,  category, term } = this.state;
        if(term != null){
            return this.catalogService.searchForProducts(term, pageSize, pageIndex);
        }
        return this.catalogService.getProductsByCategory(category.id, pageSize, pageIndex);
    }

    loadProducts(){
        const { loading, refreshing, products, pageIndex, pageSize, finished } = this.state;
        if(loading || finished) return;
        this.setState({
            loading: !refreshing
        },() => {
            this.getProducts().then(response => { 
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

    getStock(item){
        let stock = this.getAttributeValue(item,'quantity_and_stock_status') || 0;
        if(Array.isArray(stock) && stock[0]){
            stock = stock[1] || 1
        }
        return stock;
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
        let cart = this.state.cart.slice(0);
        let found = cart.find(c => c.sku == item.sku);
        if(found){
            cart = cart.filter(c => c.sku != item.sku);
            this.setState({
                cart
            })
            this.props.onCartChange(cart);
            return;
        }
        else {
            if(item.qty > 0){
                cart.push({
                    name: item.name,
                    sku: item.sku,
                    qty: item.qty
                });
            }
        }          
        if(cart == null) cart = [];
        this.setState({cart})
        this.props.onCartChange(cart);
    }

    decrease(item){
        if(item.qty > 1)
        this.setQty(item,item.qty - 1)
    }

    increase(item){
        let stock = this.getStock(item);
        if(Array.isArray(stock) && stock[0]){
            stock = stock[1] || 1
        }   
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

    renderQty(item,big=false){
        const stock = this.getStock(item);
        return(
            <View style={catalogStyle.qtyArea}>
                <Text style={catalogStyle.qtdLabel}>{I18n.t('catalog.qty')}</Text>
                <AntDesign onPress={this.decrease.bind(this,item)} name={'minuscircleo'} size={big? 20 : 16} color={'rgb(77,77,77)'} />
                <Text style={catalogStyle.qtyValue}>{item.qty}</Text>
                <AntDesign style={{opacity: item.qty < stock ? 1 : 0.5}} onPress={this.increase.bind(this,item)} name={'pluscircleo'} size={big? 20 : 16} color={'rgb(77,77,77)'} />
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
        let cart = this.state.cart.slice(0);
        const found = cart.find(c => c.sku == item.sku);
        return(
            <View style={catalogStyle.productListArea}>
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
                    {this.renderQty(item)}
                </View>
                <View style={catalogStyle.actionArea}>
                    <Button
                        onPress={this.addToCart.bind(this,item)} 
                        containerStyle={catalogStyle.addButonContainer}
                        buttonStyle={found ? catalogStyle.removeButton : catalogStyle.addButton}
                        titleProps={{
                            numberOfLines: 1,
                            style: catalogStyle.addButtonTitle
                        }}
                        title={I18n.t(`catalog.${found ? 'remove' : 'add'}`)}
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
                        onPress={() => { this.setState({activeProduct: item})}}
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
        return <></>
    }
}