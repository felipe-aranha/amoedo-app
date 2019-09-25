import React from 'react';
import { Image, Modal, ScrollView, View, Platform } from 'react-native';
import { MainContext } from '../reducer';
import { ListItem, Button } from 'react-native-elements';
import I18n from '../i18n';
import { tertiaryColor, primaryColor, accountStyle } from '../style';
import { Header, Text } from '.';
import AccountStyle from '../style/AccountStyle';
import Form from '../view/Form';
import { Address } from '../model/magento';
import { CustomerService } from '../service';

const SHIPPING = 'shipping';
const BILLING = 'billing';

export class SelectAddress extends React.PureComponent{

    static contextType = MainContext;

    constructor(props,context){
        super(props,context);
        const addresses = context.user.magento.addresses || [];
        this.state = {
            type: props.type == BILLING ? BILLING : SHIPPING,
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

    handleFormSubmit(state){
        if(this.state.loading) return;
        this.setState({
            loading: true
        }, () => {
            const { magento } = this.context.user;
            const telephone = magento.custom_attributes.find(attr => attr.attribute_code == 'custom_telephone');
            let address = new Address(state.address,state.number,state.complement,state.neighborhood);
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
            magento.addresses.push(address);
            this.customerService.updateCustomer(magento.id,magento).then(r => {
                magento.addresses = r.addresses;
                this.context.user.magento = magento;
                this.setState({
                    addresses: magento.addresses,
                    loading: false,
                    editing: false
                },() => {
                    if(this.props.onSelect)
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