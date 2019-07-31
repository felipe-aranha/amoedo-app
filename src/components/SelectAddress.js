import React from 'react';
import { Image, Modal, ScrollView, View } from 'react-native';
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
            addresses
        }
        this.customerService = new CustomerService();
    }

    toggleModal(){
        this.setState({
            modal: !this.state.modal
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
                console.log(r);
                this.context.user.magento = magento;
                this.setState({
                    addresses: magento.addresses,
                    selected: address,
                    loading: false
                },() => {
                    if(this.props.onSelect)
                        this.props.onSelect(address)
                })

            }).catch(e => {
                console.log(e);
                this.setState({
                    loading: false
                })
            })
        }) 
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
                    title={{
                        color: 'rgb(77,77,77)',
                        fontFamily: 'system-bold',
                        fontSize: 12
                    }}
                    subtitle={`${address.street.filter(s => s != '').join(', ')}`}
                    chevron={{
                        color: tertiaryColor
                    }}
                    onPress={this.toggleModal.bind(this)}
                />
            )
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
                    containerStyle={{
                        borderBottomWidth: 0,
                        paddingTop:0,
                        height: 60
                    }}
                    handleBack={this.toggleModal.bind(this)}
                    titleStyle={[AccountStyle.registerHeaderText,{color: 'rgb(57,57,57)'}]}
                    title={I18n.t(`checkout.${type}Address`)}
                    backgroundColor={primaryColor}
                    leftIconColor={tertiaryColor}
                />
                <View style={{flex:1, padding: 30}}>
                    <ScrollView>
                        {this.state.addresses.length == 0 ?
                            <AddressForm 
                                onContinue={this.handleFormSubmit.bind(this)}
                                initialState={{}}
                                loading={this.state.loading}
                            /> :
                            <View style={{margin: 10}}>
                                {this.listAddresses()}
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
                ''
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
                        name: selected == null ? 'plus' : undefined,
                        type: 'font-awesome'
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