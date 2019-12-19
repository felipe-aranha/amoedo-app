import React from 'react';
import { CatalogService } from '../../service/CatalogService';
import { FlatList, View, Image, ActivityIndicator, Modal } from 'react-native';
import { Text } from '../../components';
import { MainContext } from '../../reducer';
import variables, { ProductUtils } from '../../utils';
import I18n from '../../i18n';
import { catalogStyle, accountStyle, projectStyle } from '../../style';
import { AntDesign } from '@expo/vector-icons';
import { Button } from 'react-native-elements';

export default class ProductBase extends React.PureComponent{

    static contextType = MainContext;

    constructor(props,context){
        super(props,context);
        this.catalogService = new CatalogService();
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
                    const multiplier = ProductUtils.getQtyMultiplier(item)
                    return {
                        ...item,
                        qty: multiplier.x
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
        const multiplier = ProductUtils.getQtyMultiplier(item);
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
        let stock = ProductUtils.getStock(item);
        const multiplier = ProductUtils.getQtyMultiplier(item);
        if(stock == -1){
            const response = await this.catalogService.getProductBySku(item.sku);
            stock = ProductUtils.getStock(response);
            response.qty = item.qty;
            const products = this.state.products.map(p => {
                if(p.sku == response.sku)
                    return response;
                return p;
            });
            await new Promise(resolve => {
                this.setState({ products }, () => { resolve() })
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
        const multiplier = ProductUtils.getQtyMultiplier(item);
        const qty = multiplier.unity == '' ? item.qty : `${item.qty} ${multiplier.unity}`;
        return(
            <View style={catalogStyle.qtyArea}>
                <Text style={catalogStyle.qtdLabel}>{I18n.t('catalog.qty')}</Text>
                <AntDesign onPress={this.decrease.bind(this,item)} name={'minuscircleo'} size={big? 20 : 16} color={'rgb(77,77,77)'} />
                <Text style={catalogStyle.qtyValue}>{qty}</Text>
                <AntDesign onPress={this.increase.bind(this,item)} name={'pluscircleo'} size={big? 20 : 16} color={'rgb(77,77,77)'} />
            </View>
        )
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

    renderItem({item}){
        const image = ProductUtils.getProductImage(item);
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