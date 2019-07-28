import React from 'react';
import Register from './Register';
import * as Utils from '../../../utils';
import { AddClientForm } from '../../professional/AddClient';
import { Check, Text } from '../../../components';
import { View } from 'react-native';
import I18n from '../../../i18n';
import { MainContext } from '../../../reducer';
import { accountStyle, tertiaryColor } from '../../../style';
import Form from '../../Form';
import { Button } from 'react-native-elements';

export default class CustomerRegister extends Register {

    static contextType = MainContext;

    constructor(props,context){
        super(props,context);
        this.state = {
            activeSection: 'personal-data',
        }
    }

    handleBack(){
        this.logout();
    }

    updateUser(){
        const { magento } = this.context.user;
        if(this.isRegistered)
            this.firebaseRegister(magento.id);
        else {
            const { personalData, professionalData, documents, loading } = this.state;
            this.customer = {
                ...magento,
                group_id: this.profile.id,
            }
            const dob = Utils.parseDate(personalData.dob);
            if(dob){
                this.customer.dob = dob;
            }            
            if(magento.addresses.length == 0){
                const address = this.fillAddress();
                if(address)
                    this.customer.addresses = [address];
            }
            this.customerService.updateCustomer(magento.id,this.customer).then(response => {
                this.context.user.magento = this.customer;
                this.processApiReturn(response);
            }).catch(e => {
                this.processApiCatch(e);
            })
        }
    }

    handlePersonalDataContinue(state){
        if(this.state.loading) return;
        this.setState({
            personalData: state,
            loading: true
        },() => {
            const { firstname, lastname } = Utils.parseName(state.name);
            data = {
                customer: {
                    email: state.email,
                    firstname,
                    lastname,
                    taxvat: state.cpf
                },
                password: state.password
            } 
            this.customerService.register(data.customer,data.password).then(response => {
                if(response.id){
                    this.setState({
                        userRegistered: true
                    })
                }
            }).catch(e => {
                
            })
        });
    }

    changePersonType(personType){
        this.setState({personType})
    }

    title = I18n.t('account.register.personalDataTitle');
    titleHighlight = I18n.t('account.register.personalDataHighlight');
    
    renderSteps(){
        const { magento } = this.context && this.context.user ? this.context.user : {};
        const loggedIn = magento.id ? true : false;
        const personType = this.state.personType || 1;
        return (
            <View style={{marginHorizontal: 20}}>
                <View style={{marginTop: 30}}>
                    <Text weight='bold' style={accountStyle.sectionTitleText}>
                        {this.title}
                        {this.titleHighlight != null &&
                            <Text weight='bold' color={tertiaryColor}>{this.titleHighlight}</Text>
                        }
                        
                    </Text>
                </View>
                {!loggedIn &&
                    <View 
                        style={{
                            flexDirection: 'row',
                            marginVertical: 20
                        }}
                    >
                        {[1,2].map( key => 
                            <Check 
                                key={key.toString()}
                                title={I18n.t(`addClient.personType.${key}`)}
                                onPress={this.changePersonType.bind(this,key)}
                                checked={personType == key}
                            />
                        )}
                    </View>
                }
                <CustomerRegisterForm
                    key={personType.toString()} 
                    initialState={this.context.user.magento}
                    onContinue={this.handlePersonalDataContinue.bind(this)}
                    personType={personType}
                    loading={this.state.loading}
                />
            </View>
        )
    }
}

export class CustomerRegisterForm extends Form {

    static contextType = MainContext;

    constructor(props,context){
        super(props,context);
        this.state = this.getInitialState();
        this.isNew = this.context.user.token != null;
    }

    handleFormSubmit(){
        if(this.isFormValid())
            this.props.onContinue(this.state)
        else 
            Alert.alert('',I18n.t('account.errorMessage.verifyFields'))
    }

    isFormValid(){
        isNameValid =  this.notEmpty('name');
        return isNameValid && this.state.emailValid;
    }

    render(){
        return(
            <View>
                {this.renderForm()}
                <View style={{marginVertical: 20}}>
                <Button 
                    title={I18n.t('addClient.submit')}
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
        const { magento } = this.context && this.context.user ? this.context.user : {};
        const loggedIn = magento.id ? true : false;
        const address = magento.addresses && magento.addresses.length > 0;
        return(
            <>
            <View style={[accountStyle.formRow,{marginBottom: 20}]}>
                {this.renderAvatar({color:tertiaryColor})}
                {!loggedIn && this.renderName()}
                {loggedIn && this.renderEmail(magento.email)}
            </View>
            {!loggedIn &&
                <View style={accountStyle.formRow}>
                    {this.renderEmail()}
                </View>
            }
            {!loggedIn &&
            <View style={accountStyle.formRow}>
                {this.props.personType == 1 ?
                    this.renderCpf() :
                    this.renderCnpj()
                }
                {this.renderRg()}
            </View>
            }
            <View style={accountStyle.formRow}>
                {this.renderPhone()}
                {this.renderCellPhone()}
            </View>
            {!address && 
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
            }
            {!loggedIn && 
                <View style={accountStyle.formRow}>
                    {this.renderPassword()}
                    {this.renderPasswordConfirmation()}
                </View>
            }
            </>
        )
    }

}