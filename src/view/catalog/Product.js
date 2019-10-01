import React from 'react';
import { accountStyle, tagsStyles, catalogStyle, projectStyle } from '../../style';
import { View, ActivityIndicator, ScrollView, Platform } from 'react-native';
import { Header, Text } from '../../components';
import I18n from '../../i18n';
import { MainContext } from '../../reducer';
import { Image, Button } from 'react-native-elements';
import HTML from 'react-native-render-html';
import ProductBase from './ProductBase';

export default class Product extends ProductBase{

    static contextType = MainContext;

    constructor(props,context){
        super(props,context);
        this.state = {
            loading: false,
            product: this.props.product || null,
        }
    }

    componentDidMount(){
        if(this.state.product == null)
            this.getProduct();
    }

    handleBack(){
        this.props.onBack();
    }

    getProduct(){
        const { loading } = this.state;
        const { qty, sku } = this.props.item;
        if(loading) return;
        this.setState({
            loading: true
        },() => {
            this.catalogService.getProductBySku(sku).then(response => {
                if(response.id){
                    response.qty = qty || 0;
                    this.setState({
                        loading: false,
                        product: response
                    })
                } else 
                    this.handleError();
            }).catch(e => {
                this.handleError();
            })
        })

    }

    setQty(item,qty){
        const product = Object.assign({},this.state.product);
        product.qty = qty;
        this.setState({product})
    }

    handleDelete(){
        const product = Object.assign({},this.state.product);
        product.qty = 0;
        this.context.message(I18n.t('catalog.deleted'));
        this.props.onBack(product);
    }

    handleSave(){
        this.props.onBack(this.state.product);
    }

    handleError(){
        this.context.message(I18n.t('catalog.productError'));
        this.props.onBack();
    }

    renderProduct(){
        const { cart } = this.props;
        const item = this.state.product;
        const image = this.getProductImage(item);
        const description = this.getAttributeValue(item,'description') || '';
        const found = cart ? cart.find(c => c.sku == item.sku) : true;
        return(
            <View style={{flex:1}}>
                <ScrollView style={{paddingHorizontal:20}}>
                    {image != null &&
                        <View style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginVertical: 20
                        }}>
                            <Image 
                                source={{uri:image}}
                                style={{width:250, height:250}}
                                resizeMode={'contain'}
                            />
                        </View>
                    }
                    <View>
                        <Text 
                            numberOfLines={2}
                            weight={'medium'} 
                            size={12}
                        >{item.name}</Text>
                        {this.renderPrice(item)}
                        {!this.state.loading && this.renderQty(item,true)}
                    </View>
                    <View style={{marginVertical:20}}>
                        {description != '' &&
                            <HTML html={description} tagsStyles={tagsStyles} />
                        }
                    </View>
                </ScrollView>
                <View style={{padding:20}}>
                    {found &&
                    <Button 
                        type={'outline'}
                        containerStyle={catalogStyle.accountTypeButtonContainer}
                        buttonStyle={[accountStyle.accountTypeButton,catalogStyle.detailsButton]}
                        titleStyle={[accountStyle.accountTypeButtonTitle,catalogStyle.deleteButtonTitle]}
                        title={I18n.t('catalog.delete')}
                        onPress={this.handleDelete.bind(this)}
                    />
                    }
                    <Button 
                        title={I18n.t(cart? 'catalog.add' : 'room.save')}
                        containerStyle={accountStyle.accountTypeButtonContainer}
                        buttonStyle={[accountStyle.accountTypeButton,projectStyle.projectSaveButton]}
                        titleStyle={[accountStyle.accountTypeButtonTitle,projectStyle.submitButtonTitle]}
                        onPress={this.handleSave.bind(this)}
                    />
                </View>
            </View>
        )
    }

    renderLoading(){
        return(
            <View style={{flex:1,justifyContent: 'center', alignItems:'center'}}>
                <ActivityIndicator size={'large'} />
            </View>
        )
    }

    render(){
        return(
            <View style={{flex:1}}>
                <Header 
                    containerStyle={Platform.OS == 'android' &&  this.props.cart ? {
                        borderBottomWidth: 0,
                        paddingTop:0,
                        height: 60
                    } : { borderBottomWidth: 0 }}
                    title={I18n.t('section.room')}
                    handleBack={this.handleBack.bind(this)}
                    leftIconColor={'rgb(226,0,6)'}
                    titleStyle={accountStyle.registerHeaderText}
                    backgroundColor={'rgb(103,4,28)'}
                />
                {(this.state.loading || this.state.product == null) ?
                    this.renderLoading() :
                    this.renderProduct()
                }
            </View>
        )
    }

}