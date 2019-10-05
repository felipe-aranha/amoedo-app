import React from 'react';
import { Image, Modal, ScrollView, View, Platform } from 'react-native';
import { MainContext } from '../reducer';
import { ListItem, Button } from 'react-native-elements';
import I18n from '../i18n';
import { tertiaryColor, primaryColor, accountStyle, secondaryColor } from '../style';
import { Header, Text } from '.';
import AccountStyle from '../style/AccountStyle';
import Form from '../view/Form';
import { Address } from '../model/magento';
import { CustomerService } from '../service';
import { Entypo } from '@expo/vector-icons';
import Select from './Select';

const SHIPPING = 'shipping';
const BILLING = 'billing';
const DEFAULT = 'default';
const REMOVE = I18n.t('address.remove');
const EDIT = I18n.t('address.edit');

export class SelectAddress extends React.PureComponent{

    static contextType = MainContext;

    constructor(props,context){
        super(props,context);
        const addresses = context.user.magento.addresses || [];
        this.state = {
            type: props.profile ? DEFAULT : props.type == BILLING ? BILLING : SHIPPING,
            modal: false,
            loading: false,
            selected: props.selected || null,
            addresses,
            editing: false,
            currentAddress: null
        }
        this.customerService = new CustomerService();
    }

    toggleModal(){
        this.setState({
            modal: !this.state.modal,
            editing: false,
            currentAddress: null
        })
    }

    handleFormSubmit(state,del=false){
        const { loading, currentAddress } = this.state;
        if(loading) return;
        this.setState({
            loading: true
        }, () => {
            const { magento } = this.context.user;
            let address = {};
            if(!del){
                const telephone = magento.custom_attributes.find(attr => attr.attribute_code == 'custom_telephone');
                address = new Address(state.address,state.number,state.complement,state.neighborhood);
                address = {
                    ...address,
                    city: state.city,
                    firstname: magento.firstname,
                    lastname: magento.lastname,
                    postcode: state.zipCode,
                    default_billing: magento.addresses.length == 0,
                    default_shipping: magento.addresses.length == 0,
                    telephone: telephone.value || ''
                }
                if(currentAddress == null)
                    magento.addresses.push(address);
                else {
                    address.id = currentAddress.id;
                    magento.addresses = magento.addresses.map(a => {
                        return a.id != address.id ? a : address
                    })
                }
            } else {
                magento.addresses = magento.addresses.filter(a => a.id != currentAddress.id);
            }
            this.customerService.updateCustomer(magento.id,magento).then(r => {
                magento.addresses = r.addresses;
                const selected = this.state.selected != null ? magento.addresses.find(a => a.id == this.state.selected.id) : null;
                this.context.user.magento = magento;
                this.setState({
                    addresses: magento.addresses,
                    loading: false,
                    editing: false,
                    currentAddress: false,
                    selected
                },() => {
                    if(this.props.onSelect && !del)
                        this.props.onSelect(address)
                })

            }).catch(e => {
                this.setState({
                    loading: false
                })
            })
        }) 
    }

    selectAddress(address){
        this.props.onSelect(address);
        this.setState({
            selected: address
        })
        this.toggleModal();
    }

    getOptions(address){
        return [
            { label: REMOVE, value: address },
            { label: EDIT, value: address }
        ]
    }

    handleRemoveAddress(address){
        let selectAddress = this.state.selected || null;
        if(selectAddress != null && selectAddress.id == address.id){
            selectAddress = null;
            this.props.onSelect(null);
        }
        this.setState({
            currentAddress: address,
            editing: false,
            selected: selectAddress
        }, () => {
            this.handleFormSubmit(null, true);
        })
    }

    handleEditAddress(address){
        this.setState({
            currentAddress: address,
            editing: true
        })
    }

    handleAddressOption(item){
        switch(item.label){
            case REMOVE:
                this.handleRemoveAddress(item.value);
            case EDIT:
                this.handleEditAddress(item.value);
        }
    }

    renderRightIcon(address){
        return (
            <Select
                options={this.getOptions(address)}
                onOptionSelected={this.handleAddressOption.bind(this)}
            >
                <Entypo 
                    name={'dots-three-vertical'}
                    color={tertiaryColor}
                    size={18}
                />
            </Select>
        )
    }

    listAddresses(){
        const { magento } = this.context.user;
        const { selected } = this.state;
        return magento.addresses.map( (address, i) => {
            return(
                <ListItem 
                    key={i.toString()}
                    containerStyle={{
                        marginBottom: 5,
                        backgroundColor: '#fff'
                    }}
                    leftIcon={
                        <Image 
                            source={require('../../assets/images/icons/address-pin-x2.png')} 
                            style={{
                                width: 25,
                                height: 25
                            }}
                        />
                    }
                    titleStyle={{
                        color: 'rgb(77,77,77)',
                        fontFamily: 'system-bold',
                        fontSize: 12
                    }}
                    title={`${address.street.filter(s => s != '').join(', ')}`}
                    titleProps={{
                        numberOfLines: 2
                    }}
                    onPress={this.selectAddress.bind(this, address)}
                    rightIcon={this.renderRightIcon(address)}
                />
            )
        })
    }

    handleAddAddress(){
        this.setState({
            editing: true,
            currentAddress: null
        })
    }

    renderModal(){
        const { type } = this.state;
        return(
            <Modal 
               animationType={'slide'}
               visible={this.state.modal} 
            >
                <Header 
                    containerStyle={Platform.OS == 'android' ? {
                        borderBottomWidth: 0,
                        paddingTop:0,
                        height: 60
                    } : undefined}
                    handleBack={this.toggleModal.bind(this)}
                    titleStyle={[AccountStyle.registerHeaderText,{color: 'rgb(57,57,57)'}]}
                    title={I18n.t(`checkout.${type}Address`)}
                    backgroundColor={primaryColor}
                    leftIconColor={tertiaryColor}
                />
                <View style={{flex:1, backgroundColor: '#EFEFEF', padding: this.state.editing ? 30 : 0}}>
                    <ScrollView>
                        {this.state.editing ?
                            <AddressForm 
                                onContinue={this.handleFormSubmit.bind(this)}
                                initialState={{}}
                                loading={this.state.loading}
                                address={this.state.currentAddress}
                            /> :
                            <View style={{margin: 10}}>
                                {this.listAddresses()}
                                <ListItem
                                    containerStyle={{
                                        marginBottom: 5,
                                        backgroundColor: '#fff'
                                    }}
                                    leftIcon={{
                                        name: 'add',
                                        color: 'rgb(226,0,6)',
                                        type: 'material-icons',
                                        size: 20
                                    }}
                                    titleStyle={{
                                        color: 'rgb(77,77,77)',
                                        fontFamily: 'system-bold',
                                        fontSize: 12
                                    }}
                                    title={I18n.t('checkout.addAddress')}
                                    onPress={this.handleAddAddress.bind(this)}
                                />
                            </View>
                        }
                        
                    </ScrollView>
                </View>
            </Modal>
        )
    }

    renderAddressName(){
        const { selected } = this.state;
        return <Text weight={'bold'}>
            {selected == null ? 
                I18n.t('checkout.newAddress') : 
                <Text weight={'medium'} size={10} color={'rgb(57,57,57)'}>{selected.street.filter(s => s != '').join(', ')}</Text>
            }
        </Text>
    }

    render(){
        const { type, selected } = this.state;
        const { profile, professional } = this.props;
        if(profile){
            return (
                <>
                    {this.renderModal()}
                    <ListItem 
                        {...this.props}
                        titleStyle={accountStyle.editProfileTitle}
                        subtitleStyle={accountStyle.editProfileSubtitle}
                        title={I18n.t('editProfile.address')}
                        chevron={{
                            color: professional ? secondaryColor : tertiaryColor,
                            type: 'entypo',
                            name: 'chevron-right',
                            size: 20
                        }}
                        onPress={this.toggleModal.bind(this)}
                    />
                </>
            )
        }
        return(
            <>
                {this.renderModal()}
                <ListItem 
                    containerStyle={{
                        marginBottom: 5
                    }}
                    leftIcon={
                        <Image 
                            source={require('../../assets/images/icons/address-pin-x2.png')} 
                            style={{
                                width: 25,
                                height: 25
                            }}
                        />
                    }
                    title={I18n.t(`checkout.${type}Address`)}
                    titleStyle={{
                        color: tertiaryColor,
                        fontFamily: 'system-bold',
                        fontSize: 10
                    }}
                    subtitle={this.renderAddressName()}
                    chevron={{
                        color: tertiaryColor,
                        name: selected == null ? 'plus' : 'chevron-right',
                        type: 'entypo'
                    }}
                    onPress={this.toggleModal.bind(this)}
                />
            </>
        )
    }

}

class AddressForm extends Form{

    constructor(props,state){
        super(props,state);
        const address = props.address && props.address != null ? props.address : {}
        const street = address.street || [];
        const region = address.region || {};
        this.state = {
            ...state,
            zipCode: address.postcode || '',
            address: street[0] || '',
            number: street[1] || '',
            complement: street[2] || '',
            neighborhood: street[3] || '',
            city: address.city || '',
            state: region.region_code || ''
        }
    }

    handleFormSubmit(){
        this.props.onContinue(this.state)
    }

    render(){
        return(
            <View>
                {this.renderForm()}
                <View style={{marginVertical: 20}}>
                <Button 
                    title={I18n.t('checkout.saveAddress')}
                    containerStyle={accountStyle.accountTypeButtonContainer}
                    buttonStyle={[accountStyle.accountTypeButton,{backgroundColor:tertiaryColor}]}
                    titleStyle={[accountStyle.accountTypeButtonTitle]}
                    onPress={this.handleFormSubmit.bind(this)}
                    loading={this.props.loading}
                />
                </View>
            </View>
        )
    }
    
    renderForm(){
        return(
            <>
            <View style={accountStyle.formRow}>
                {this.renderCep()}
                {this.renderAddress()}
            </View>
            <View style={accountStyle.formRow}>
                {this.renderAddressNumber()}
                {this.renderAddressComplement()}
            </View>
            <View style={accountStyle.formRow}>
                {this.renderNeighborhood()}
            </View>
            <View style={accountStyle.formRow}>
                {this.renderCity()}
                {this.renderState()}
            </View>
            </>
        )
    }

}