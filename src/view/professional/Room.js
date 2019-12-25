import React from 'react';
import { Header, Text, KeyboardSpacer, SizeInput, TextArea, Select, MediaSelect, Input } from '../../components';
import { View, ScrollView, TouchableOpacity, Modal, StyleSheet, Image, Share, Platform, FlatList } from 'react-native';
import { accountStyle, secondaryColor, mainStyle, projectStyle, catalogStyle } from '../../style';
import { Actions } from 'react-native-router-flux';
import I18n from '../../i18n';
import { AntDesign } from '@expo/vector-icons';
import { Button, ButtonGroup, Divider, CheckBox } from 'react-native-elements';
import Catalog from '../catalog/Catalog';
import Product from '../catalog/Product';
import uuid from 'uuid';
import { CatalogService } from '../../service/CatalogService';
import variables, { ProductUtils } from '../../utils';

export default class Room extends React.PureComponent {

    constructor(props,context){
        super(props,context);
        this.state = {
            ...this.getInitialState(),
            index: this.props.index || -1,
            filesModal: false,
            productsModal: false,
            product: null,
            currentCategory: null,
            fileIndex: 0,
            cartItems: []
        }
        this.catalogService = new CatalogService();
    }

    componentDidMount(){
        this.loadCartItems()
    }

    loadCartItems(){
        if(this.state.loading) return;
        this.setState({
            cartItems: []
        },() => {
            this.state.cart.forEach((item,i) => {
                this.catalogService.getProductBySku(item.sku).then(response => {
                    if(response.sku){
                        const cartItems = this.state.cartItems.slice();
                        cartItems.push(response);
                        this.setState({cartItems})
                    }
                }).catch(e => {
                    console.log(e);
                })
            })
        })
    }

    handleCatalogChange(cart){
        this.setState({cart}, this.loadCartItems.bind(this))
        this.toggleProductsModal();
    }

    handleUpdateProduct(item){
        if(!item) {
            this.setState({
                product: null
            })
            return;
        }
        let cart = this.state.cart.slice(0);
        if(item.qty == 0){
            cart = cart.filter(i => i.sku != item.sku);
        } else {
            cart.forEach(c => {
                if(c.sku == item.sku){
                    c.qty = item.qty
                }
            })
        }          
        if(cart == null) cart = [];
        this.setState({
            cart,
            product: null
        })
    }

    getFiles(){
        const { fileIndex, files } = this.state;
        const category = this.getFileCategories()[fileIndex].type;
        return files[category];
    }

    handleSelectCategory(cat){
        this.setState({
            currentCategory: cat
        })
    }

    updateFilesIndex(fileIndex){
        this.setState({fileIndex})
    }

    renderCartFooter(){
        return(
            <View style={{backgroundColor:'#fff',padding:20}}>
                {this.renderSubtotal()}
            </View>
        );
    }

    renderSubtotal(){
        const { cartItems, cart } = this.state;
        let price = 0;
        cartItems.forEach(i => {
            const found = cart.find(ii => ii.sku == i.sku);
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

    getInitialState(){
        const roomState = this.props.roomState || {};
        let sequential = this.props.sequential || 1;
        let zeros = '';
        for(let i=0; i < (4 - sequential.toString().length); i++){
            zeros = `0${zeros}`;
        }
        const label = roomState.room ? roomState.room.label : this.props.room ? this.props.room.label : ''
        return {
            name: roomState.name || `${label} - ${zeros}${sequential}` || '',
            width: roomState.width || '',
            height: roomState.height || '',
            depth: roomState.depth || '',
            description: roomState.description || '',
            room: roomState.room || this.props.room || {},
            files: roomState.files || {
                before: [],
                after: [],
                files: []
            },
            status: roomState.status || 'pending',
            cart: roomState.cart || [],
            id: roomState.id || uuid.v4()
        }
    }

    getFileCategories(){
        return [
            {type: 'before', label: I18n.t('room.files.before') },
            {type: 'after', label: I18n.t('room.files.after') },
            {type: 'files', label: I18n.t('room.files.files') },
        ]
    }

    getFileOptions(){
        return [
            {type: 'delete', label: I18n.t('room.files.delete')},
            {type: 'share', label: I18n.t('room.files.share')}
        ]
    }

    handleFileOptionSelected(option){
        switch(option.type){
            case 'delete':
                this.handleDelete(option.file);
                break;
            case 'share':
                this.handleShare(option.file);
        }
    }

    handleDelete(f){
        let files = Object.assign({},this.state.files);
        Object.keys(files).forEach(cat => {
            files[cat] = files[cat].filter(file => file.uri != f.uri) || [];
        });
        this.setState({
            files
        })
    }

    handleShare(file){
        const data = {}
        if(Platform.OS == 'ios'){
            data.url = file.uri
        } else {
            data.message = file.uri
        }
        Share.share(data);
    }

    toggleFilesModal(){
        if(!this.props.customer)
            this.setState({
                filesModal: !this.state.filesModal,
                currentCategory: null
            })
    }

    toggleProductsModal(){
        if(!this.props.customer)
            this.setState({
                productsModal: !this.state.productsModal
            })
    }

    handleBack(){
        this.props.onBack();
    }

    handleFormSubmit(){
        if(this.props.customer) return;
        const { width, height, depth, description, room, files, cart, id, name } = this.state;
        const data = {
            width, height, depth, description, room, files, cart, id, name
        }
        this.props.onSave(data);
    }

    handleWidthChange(width){
        if(!this.props.customer)
            this.setState({width})
    }
    
    handleHeightChange(height){
        if(!this.props.customer)
            this.setState({height})
    }

    handleNameChange(name){
        if(!this.props.customer)
            this.setState({name})
    }

    handleDepthChange(depth){
        if(!this.props.customer)
            this.setState({depth})
    }

    handleDescChange(description){
        if(!this.props.customer)
            this.setState({description})
    }

    handleActiveProduct(product){
        if(!this.props.customer)
            this.setState({product})
    }

    handleSelectMedia(media){
        if(media.cancelled) return;
        const { currentCategory } = this.state;
        if(currentCategory != null){
            const files = Object.assign({},this.state.files);
            files[currentCategory.type].push({
                uri: media.uri,
                process: true,
                description: ''
            });
            this.setState({
                files
            })
        }
    }

    renderFilesModal(){
        return(
            <Modal
                visible={this.state.filesModal}
                onRequestClose={() => {}}
                animationType={'fade'}
            >
                <View style={[StyleSheet.absoluteFill, mainStyle.mainView]}>
                    <View style={{paddingHorizontal:30, flex:1}}>
                        <View
                            style={{
                                marginVertical:30,
                            }}
                        >
                            <AntDesign 
                                name={'close'}
                                color={secondaryColor}
                                onPress={this.toggleFilesModal.bind(this)}
                                size={24}
                                style={{alignSelf: 'flex-end'}}
                            />
                        </View>
                        <View style={{marginRight: 20}}>
                            <Text size={16} weight={'semibold'}>{I18n.t('room.files.title')}</Text>
                        </View>
                        <View style={[accountStyle.formRow,{marginTop:20}]}>
                            <View style={[projectStyle.roomInputArea,{marginVertical:0}]}>
                                <View>
                                    <Text style={mainStyle.inputLabel}>{I18n.t('room.files.label')}</Text>
                                    <Select
                                        options={this.getFileCategories()}
                                        onOptionSelected={this.handleSelectCategory.bind(this)}
                                        arrowColor={secondaryColor}
                                        fullWidth
                                    />
                                </View>
                            </View>
                        </View>
                        {this.state.currentCategory != null &&
                        <ScrollView>
                            <View style={{flexWrap: 'wrap',flexDirection: 'row'}}>
                                <>
                                    {this.state.files[this.state.currentCategory.type] && this.state.files[this.state.currentCategory.type].map((file,index) => {
                                        return(
                                            <View
                                                style={projectStyle.roomAddPhotoArea}
                                                key={index}
                                            >
                                                <Image 
                                                    style={{
                                                        width: 100,
                                                        height:100,
                                                    }}
                                                    resizeMode={'contain'}
                                                    source={{uri:file.uri}}
                                                />
                                            </View>
                                        )
                                    })}
                                    <MediaSelect
                                        onMediaSelected={this.handleSelectMedia.bind(this)}
                                        denyEdit
                                    >
                                        <View style={projectStyle.roomAddPhotoArea}>
                                            <AntDesign size={16} name={'pluscircleo'} color={secondaryColor} />
                                            <Text style={{textAlign:'center'}} size={12} weight={'medium'}>{I18n.t('room.files.newImage')}</Text>
                                        </View>
                                    </MediaSelect>
                                </>
                            </View>
                        </ScrollView>
                        }
                        <View style={{
                            flex: 1,
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            marginBottom: 30
                        }}>
                            <Button 
                                title={I18n.t('room.save')}
                                containerStyle={accountStyle.accountTypeButtonContainer}
                                buttonStyle={[accountStyle.accountTypeButton, projectStyle.buttonSecondary]}
                                titleStyle={[accountStyle.accountTypeButtonTitle,projectStyle.submitButtonTitle]}
                                onPress={this.handleFormSubmit.bind(this)}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
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

    renderQty(item,big=false){
        const { cart } = this.state;
        const checked = cart.find(i => i.sku == item.sku) || false;
        const multiplier = ProductUtils.getQtyMultiplier(item);
        const qty = multiplier.unity == '' ? checked.qty : `${checked.qty} ${multiplier.unity}`;
        return(
            <View style={catalogStyle.qtyArea}>
                <Text style={catalogStyle.qtdLabel}>{I18n.t('catalog.qty')}</Text>
                <Text style={catalogStyle.qtyValue}>{qty}</Text>
            </View>
        )
    }

    renderCartItem({item}){
        const { cart } = this.state;
        const image = ProductUtils.getProductImage(item);
        const checked = cart.find(i => i.sku == item.sku) || false;
        return(
            <TouchableOpacity style={{flex:0.5}} onPress={this.handleActiveProduct.bind(this,checked)}>
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
                </View>
            </TouchableOpacity>
        )
    }

    _renderCartItem(item){
        const { cart } = this.state;
        const checked = cart.find(i => i.sku == item.sku) || false;
        if(!checked) return(<></>);
        const image = ProductUtils.getProductImage(item);
        const prices = ProductUtils.getProductPrices(item);
        const multiplier = ProductUtils.getQtyMultiplier(item);
        const divider = Number.isInteger(multiplier.x) ? 
                            Math.ceil(Number(checked.qty) / multiplier.x) : 
                            Number(Number(checked.qty) / multiplier.x).toFixed(2);
        const value = checked ? Number(prices.specialPrice || prices.regularPrice) * divider : (prices.specialPrice || prices.regularPrice);
        return(
            <TouchableOpacity key={`${item.sku}`} onPress={this.handleActiveProduct.bind(this,checked)}>
                <View
                    style={{
                        flexDirection: 'row',
                        backgroundColor: '#fff',
                        paddingHorizontal:20,
                        paddingVertical: 10,
                    }}
                >
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

    render(){
        const { room } = this.state;
        const { customer } = this.props;
        const files = this.getFiles();
        if(this.state.product != null)
            return(
                <Product 
                    item={this.state.product}
                    onBack={this.handleUpdateProduct.bind(this)}
                />
            )
        if(this.state.productsModal)
            return (
                <Catalog 
                    cart={this.state.cart}
                    onBack={this.handleCatalogChange.bind(this)}
                />
            )
        return(
            <View style={{flex:1}}>
                {this.renderFilesModal()}
                <Header 
                    containerStyle={{
                        borderBottomWidth: 0
                    }}
                    title={I18n.t('section.room')}
                    handleBack={this.handleBack.bind(this)}
                    leftIconColor={'rgb(226,0,6)'}
                    titleStyle={accountStyle.registerHeaderText}
                    backgroundColor={'rgb(103,4,28)'}
                />
                <View
                    style={{
                        backgroundColor: secondaryColor,
                        paddingHorizontal:20,
                        paddingVertical: 10
                    }}
                >
                    <Text style={{
                        color: '#fff',
                        fontFamily: 'system-medium',
                        fontSize: 14
                    }}>{room.label.toUpperCase()}</Text>
                </View>
                <View style={{flex:1}}>
                    <ScrollView style={{
                        paddingHorizontal: 10
                    }}>
                        <View>
                            <View style={accountStyle.formRow}>
                                <Input 
                                    label={I18n.t('room.name')}
                                    value={this.state.name}
                                    onChangeText={this.handleNameChange.bind(this)}
                                />
                            </View>
                            <View style={projectStyle.roomInputArea}>
                                <Text style={mainStyle.inputLabel}>{I18n.t('room.width')}</Text>
                                <SizeInput 
                                    value={this.state.width}
                                    onChangeText={this.handleWidthChange.bind(this)}
                                />
                            </View>
                            <View style={projectStyle.roomInputArea}>
                                <Text style={mainStyle.inputLabel}>{I18n.t('room.height')}</Text>
                                <SizeInput 
                                    value={this.state.height}
                                    onChangeText={this.handleHeightChange.bind(this)}
                                />
                            </View>
                            <View style={projectStyle.roomInputArea}>
                                <Text style={mainStyle.inputLabel}>{I18n.t('room.depth')}</Text>
                                <SizeInput 
                                    value={this.state.depth}
                                    onChangeText={this.handleDepthChange.bind(this)}
                                />
                            </View>
                            <View style={[accountStyle.formRow,projectStyle.roomInputBorder]}>
                                <TextArea 
                                    value={this.state.description}
                                    onChangeText={this.handleDescChange.bind(this)}
                                    label={<>{I18n.t('room.description')}<Text style={{width: 20,paddingVertical:10}}>{' '}</Text></>}
                                />
                            </View>
                            <View style={{marginHorizontal: 10}}>
                                <View style={projectStyle.clientLabelArea}>
                                    <Text style={projectStyle.projectFilesText}>{I18n.t('room.projectFiles')}</Text>
                                    {!customer && 
                                    <View style={[projectStyle.addClientArea,{paddingRight:0}]}>
                                        <TouchableOpacity onPress={this.toggleFilesModal.bind(this)} style={projectStyle.addClientClickArea}>
                                            <AntDesign size={16} name={'pluscircleo'} color={'rgb(191,8,17)'} />                                  
                                            <Text style={projectStyle.addClientText}>{' '}{I18n.t('room.add')}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    }
                                </View>
                                <View style={{marginTop:10}}>
                                    <ButtonGroup 
                                        onPress={this.updateFilesIndex.bind(this)}
                                        selectedIndex={this.state.fileIndex}
                                        buttons={this.getFileCategories().map(cat => cat.label)}
                                        containerStyle={{
                                            borderRadius: 10
                                        }}
                                        selectedButtonStyle={{
                                            backgroundColor: secondaryColor
                                        }}
                                        selectedTextStyle={{
                                            color: '#fff',
                                            fontSize: 12,
                                            fontFamily: 'system-medium'
                                        }}
                                        textStyle={{
                                            color: secondaryColor,
                                            fontSize: 12,
                                            fontFamily: 'system-medium'
                                        }}
                                    />
                                </View>
                                {files.length > 0 &&
                                    <ScrollView 
                                        horizontal   
                                        style={{
                                            marginVertical: 10,
                                        }}
                                    >
                                        {files.map((file,idx) => {
                                            let options = this.getFileOptions().map(option => {
                                                option.file = file;
                                                return option;
                                            })
                                            return( <View 
                                                key={idx.toString()}
                                                style={{
                                                    padding: 5,
                                                    paddingBottom: 0,
                                                    margin: 5,
                                                    backgroundColor: '#fff',
                                                    borderRadius: 5
                                                }}
                                            >
                                                <Image 
                                                    source={{
                                                        uri: file.uri
                                                    }}
                                                    style={{
                                                        width: 110,
                                                        height: 70
                                                    }}
                                                    resizeMode={'contain'}
                                                />
                                                {!customer &&
                                                <View
                                                    style={{
                                                        flexDirection: 'row',
                                                        justifyContent:'flex-end'
                                                    }}
                                                >
                                                        <Select
                                                            options={options}
                                                            onOptionSelected={this.handleFileOptionSelected.bind(this)}
                                                        >
                                                            <View
                                                                style={{
                                                                    borderWidth: 1,
                                                                    borderColor: secondaryColor,
                                                                    borderRadius: 10,
                                                                    width: 20,
                                                                    height:20,
                                                                    justifyContent: 'center',
                                                                    alignItems: 'center'
                                                                }}
                                                            >
                                                                <AntDesign 
                                                                    name={'ellipsis1'}
                                                                    color={secondaryColor}
                                                                />
                                                            </View>
                                                        </Select>
                                                </View>
                                                }
                                            </View> )
                                        })}
                                    </ScrollView>
                                }
                            </View>
                            <View style={{marginHorizontal: 10, marginVertical: 20}}>
                                <View style={projectStyle.clientLabelArea}>
                                    <Text style={projectStyle.projectFilesText}>{I18n.t('room.products')}</Text>
                                    {!customer &&
                                    <View style={[projectStyle.addClientArea,{paddingRight:0}]}>
                                        <TouchableOpacity onPress={this.toggleProductsModal.bind(this)} style={projectStyle.addClientClickArea}>
                                            <AntDesign size={16} name={'pluscircleo'} color={'rgb(191,8,17)'} />                                  
                                            <Text style={projectStyle.addClientText}>{' '}{I18n.t('room.add')}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    }
                                </View>
                                {this.state.cart.length > 0 &&
                                    <FlatList 
                                        data={this.state.cartItems}
                                        renderItem={this.renderCartItem.bind(this)}
                                        numColumns={2}
                                        containerStyle={{
                                            marginTop: 20
                                        }}
                                        ListFooterComponent={this.state.cartItems.length > 0  && this.renderCartFooter()}
                                    />
                                }
                            </View>
                            <View style={{marginTop: 20,marginBottom:50}}>
                                {!customer &&
                                <Button 
                                    title={I18n.t('room.save')}
                                    containerStyle={accountStyle.accountTypeButtonContainer}
                                    buttonStyle={[accountStyle.accountTypeButton,accountStyle.submitButton, projectStyle.projectSaveButton]}
                                    titleStyle={[accountStyle.accountTypeButtonTitle,projectStyle.submitButtonTitle]}
                                    onPress={this.handleFormSubmit.bind(this)}
                                />
                                }
                            </View>
                        </View>
                    </ScrollView>
                </View>
                <KeyboardSpacer />
            </View>
        )
    }
}