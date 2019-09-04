import React from 'react';
import Register from './Register';
import * as Utils from '../../../utils';
import { AddClientForm } from '../../professional/AddClient';
import { Check, Text } from '../../../components';
import { View, Alert } from 'react-native';
import I18n from '../../../i18n';
import { MainContext } from '../../../reducer';
import { accountStyle, tertiaryColor } from '../../../style';
import Form from '../../Form';
import { Button } from 'react-native-elements';
import { Customer, Address, CustomerRegister as CR } from '../../../model/magento';
import { Customer as FCustomer} from '../../../model/firebase';
import { UserService } from '../../../service/firebase/UserService';
import { Actions } from 'react-native-router-flux';

export default class CustomerRegister extends Register {

    static contextType = MainContext;

    constructor(props,context){
        super(props,context);
        const customer = props.customer || {};
        const address = typeof(customer.address) == 'object' ? customer.address : {};
        this.state = {
            activeSection: 'personal-data',
            personalData: {
                ...customer,
                ...address
            }
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
            const { personalData } = this.state;
            this.customer = {
                ...magento
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

    createUser(){
        const { personalData } = this.state;
        if(this.context.user.magento.id){
            this.updateUser();
            return;
        }
        const { firstname, lastname } = Utils.parseName(personalData.name);
        let address = this.fillAddress(firstname, lastname);
        let customer = new Customer(address, personalData.cell || personalData.phone);
        const group = this.context.app.groups.find(g => g.customer);
        customer = {
            ...customer,
            dob: Utils.parseDate(personalData.dob) || null,
            taxvat: personalData.cpf,
            firstname,
            lastname,
            email: personalData.email,
            group_id: group.id
        }
        let customerRegister = new CR(customer, personalData.password);
        this.customer = customerRegister;
        if(this.isRegistered && this.user != null){
            this.firebaseRegister();
            return;
        }
        this.customerService.register(customerRegister.customer,customerRegister.password).then(response => {
            this.processApiReturn(response);
        }).catch(e => {
            this.processApiCatch(e);
        })
    }

    handlePersonalDataContinue(state){
        if(this.state.loading) return;
        const { magento } = this.context && this.context.user ? this.context.user : {};
        const loggedIn = magento.id ? true : false;
        const personType = this.state.personType || 1;
        this.setState({
            personalData: state,
            loading: true
        },() => {
            this.openModalLoading();
            if(loggedIn){
                return this.updateUser();
            } else {
                return this.createUser();
            }
        });
    }

    async firebaseRegister(customerId=null){
        const { personalData } = this.state;
        const personType = this.state.personType || 1;
        const { magento } = this.context && this.context.user ? this.context.user : {};
        const loggedIn = magento.id ? true : false;
        let address = new Address();
            address = loggedIn ? magento.addresses[0] : {
                address: personalData.address,
                city: personalData.city,
                complement: personalData.complement,
                neighborhood: personalData.neighborhood,
                number: personalData.number,
                state: personalData.state,
                zipCode: personalData.zipCode
            }
            let customer = new FCustomer(Object.assign({},address));
            customer = {
                ...customer,
                avatar: personalData.avatar,
                cellphone: personalData.cell,
                document: this.state.personType == 1 ? personalData.cpf : personalData.cnpj,
                documentType: personType == 1 ? "cpf" : "cnpj",
                email: loggedIn ? magento.email : personalData.email,
                instagram: personalData.instagram,
                name: loggedIn ? `${magento.firstname} ${magento.lastname}` :personalData.name,
                rg: personalData.rg,
                telephone: personalData.phone,
                createdAt: new Date(),
                magento_id: customerId != null ? customerId : magento.id || null
            }
            const response = await UserService.insertOrUpdateCustomerAsync(customer);
            this.context.message(I18n.t(`${response != false ? 'account.register.success' : 'account.errorMessage.registerError'}`))
            if(response != false){
                this.login(personalData.email,personalData.password);
            }
            else 
                this.setState({
                    loading: false
                })
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
                    initialState={this.state.personalData}
                    onContinue={this.handlePersonalDataContinue.bind(this)}
                    personType={personType}
                    loading={this.state.loading}
                    customer={this.props.customer}
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
        const { magento } = this.context && this.context.user ? this.context.user : {};
        const loggedIn = magento.id ? true : false;
        const isNameValid = this.notEmpty('name') || loggedIn;
        const isCpfValid = this.notEmpty(this.props.personType == 1 ? 'cpf' : 'cnpj') || loggedIn;
        const isEmailValid = this.state.emailValid || loggedIn || this.props.customer.email;
        const isPhonevalid = this.notEmpty('phone') || this.notEmpty('cell');
        const isPasswordValid = loggedIn || (this.notEmpty('password',5) && this.state.password == this.state.confirmPassword)
        return isNameValid && isCpfValid && isEmailValid && isPhonevalid && isPasswordValid;
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
        const customer = this.props.customer || {}
        const email = magento.email || customer.email
        const loggedIn = magento.id ? true : false;
        const address = magento.addresses && magento.addresses.length > 0;
        return(
            <>
            <View style={[accountStyle.formRow,{marginBottom: 20}]}>
                {this.renderAvatar({color:tertiaryColor})}
                {this.renderEmail(email)}
            </View>
            {!loggedIn &&
                <View style={accountStyle.formRow}>
                    {this.renderName()}
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