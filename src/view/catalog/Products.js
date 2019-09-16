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
import Product  from './Product';
import ProductBase from './ProductBase';

export default class Products extends ProductBase{

    static contextType = MainContext;

    constructor(props,context){
        super(props,context);
        this.state = {
            category: this.props.category || {id: 13},
            term: props.term || null,
            loading: false,
            refreshing: true,
            finished: false,
            products: [],
            pageIndex: 1,
            pageSize: 10,
            cart: this.props.cart || [],
            activeProduct: null
        }
    }

    componentDidMount(){
        this.loadProducts();
    }

    handleDetailsBack(item){
        const { cart } = this.state;
        if(item && cart){
            const found = cart ? cart.find(c => c.sku == item.sku) : true;
            if(!found) this.addToCart(item);
            else this.setQty(item, item.qty);
        }
        this.setState({ activeProduct: null })
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
                <Modal
                    visible={this.state.activeProduct != null}
                    animationType={'slide'}
                    onRequestClose={() => {}}
                >
                    <Product 
                        item={this.state.activeProduct}
                        onBack={this.handleDetailsBack.bind(this)}
                        cart={this.state.cart}
                    />
                </Modal>
            </View>
        )
    }

}