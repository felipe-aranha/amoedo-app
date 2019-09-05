import React from 'react';
import Clients from './Clients'
import I18n from '../../i18n';
import Form from '../Form';
import { mainStyle, accountStyle } from '../../style';
import { View, ScrollView, Alert } from 'react-native';
import { Text, Check } from '../../components';
import { Button } from 'react-native-elements';
import * as Utils from '../../utils';
import { Address, Customer } from '../../model/firebase';
import { UserService } from '../../service/firebase/UserService';
import { Actions } from 'react-native-router-flux';

export default class AddClient extends Clients{

    constructor(props,context){
        super(props,context);
        this.state = {
            personType: 1,
            loading: false
        }
    }

    onFloatButtonPress(){
        Actions.reset('_clients');
    }

    componentDidMount(){}

    icon = require('../../../assets/images/icons/user-search-x2.png');
    title = I18n.t('section.addClient');
    floatingButtonTitle = I18n.t('floatButton.clients');

    changePersonType(personType){
        if(this.state.loading) return;
        this.setState({
            personType
        })
    }

    async handleAddClient(client){
        if(this.state.loading) return;
        this.setState({
            loading: true
        },async () => {
            let address = new Address();
            address = {
                address: client.address,
                city: client.city,
                complement: client.complement,
                neighborhood: client.neighborhood,
                number: client.number,
                state: client.state,
                zipCode: client.zipCode
            }
            let customer = new Customer(Object.assign({},address));
            customer = {
                ...customer,
                cellphone: client.cell,
                email: client.email,
                name: client.name,
                telephone: client.phone,
                status: 'pending'
            }
            docID = this.context.user.magento.id;
            myDoc = UserService.getProfessionalDoc(docID);
            response = await UserService.insertAndAttachCustomer(customer,myDoc);
            this.context.message(I18n.t(`addClient.${response != false ? 'success' : 'fail'}`))
            if(response != false){
                if(this.props.popTo){
                    this.getProfessionalDoc().get().then(async doc => {
                        await this.addClientToContext(customer.email);
                        Actions.reset(this.props.popTo);
                    })
                    return;
                }
                Actions.reset('_clients');
            }
            else 
                this.setState({
                    loading: false
                })
        })
        
    }

    renderContent(){
        return(
            <View style={{flex:1}}>
                <ScrollView>
                    <View style={mainStyle.sectionArea}>
                        <Text style={mainStyle.sectionTitle}>{I18n.t('addClient.title')}</Text>
                        <Text style={mainStyle.sectionSubtitle}>{I18n.t('addClient.subtitle')}</Text>
                        <View>
                            <AddClientForm
                                key={this.state.personType.toString()} 
                                initialState={{}}
                                onContinue={this.handleAddClient.bind(this)}
                                personType={this.state.personType}
                                loading={this.state.loading}
                            />
                        </View>
                    </View>
                </ScrollView>
            </View>
        )
    }

}

export class AddClientForm extends Form{

    constructor(props,context){
        super(props,context);
        this.state = this.getInitialState();
    }

    handleFormSubmit(){
        if(this.isFormValid())
            this.props.onContinue(this.state)
        else 
            Alert.alert('',I18n.t('account.errorMessage.verifyFields'))
    }

    async checkEmail(isNew=true){
        this.setState({
            emailValid: Utils.isEmailValid(this.state.email)
        })
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
                    type={'outline'}
                    containerStyle={accountStyle.accountTypeButtonContainer}
                    buttonStyle={[accountStyle.accountTypeButton,accountStyle.submitButton]}
                    titleStyle={[accountStyle.accountTypeButtonTitle,accountStyle.submitButtonTitle]}
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
            <View style={[accountStyle.formRow,{marginBottom: 20}]}>
                {this.renderName()}
            </View>
            <View style={accountStyle.formRow}>
                {this.renderEmail()}
            </View>
            <View style={accountStyle.formRow}>
                {this.renderPhone()}
                {this.renderCellPhone()}
            </View>
            </>
        )
    }
}