import React from 'react';
import Clients from './Clients'
import I18n from '../../i18n';
import Form from '../Form';
import { mainStyle, accountStyle } from '../../style';
import { View, ScrollView, Alert } from 'react-native';
import { Text, Check } from '../../components';
import { Button } from 'react-native-elements'

export default class AddClient extends Clients{

    constructor(props,context){
        super(props,context);
        this.state = {
            personType: 1
        }
    }

    icon = require('../../../assets/images/icons/user-search-x2.png');
    title = I18n.t('section.addClient');
    floatingButtonTitle = I18n.t('floatButton.clients');

    changePersonType(personType){
        this.setState({
            personType
        })
    }

    handleAddClient(client){

    }

    renderContent(){
        return(
            <View style={{flex:1}}>
                <ScrollView>
                    <View style={mainStyle.sectionArea}>
                        <Text style={mainStyle.sectionTitle}>{I18n.t('addClient.title')}</Text>
                        <Text style={mainStyle.sectionSubtitle}>{I18n.t('addClient.subtitle')}</Text>
                        <View style={{
                            flexDirection: 'row',
                            marginVertical: 20
                        }}>
                            {[1,2].map( key => 
                                <Check 
                                    key={key.toString()}
                                    title={I18n.t(`addClient.personType.${key}`)}
                                    onPress={this.changePersonType.bind(this,key)}
                                    checked={this.state.personType == key}
                                />
                            )}
                        </View>
                        <View>
                            <AddClientForm 
                                initialState={{}}
                                onContinue={this.handleAddClient.bind(this)}
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

    isFormValid(){
        isNameValid =  this.notEmpty('name');
        isPhonevalid = this.notEmpty('phone') || this.notEmpty('cell');
        return isNameValid && this.state.emailValid && 
                    this.state.cpfValid && this.notEmpty('rg') &&
                    isPhonevalid && this.notEmpty('zipCode',8) &&
                    this.notEmpty('address') && this.notEmpty('city') &&
                    this.notEmpty('state')
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
                />
                </View>
            </View>
        )
    }

    renderForm(){
        return(
            <>
            <View style={[accountStyle.formRow,{marginBottom: 20}]}>
                {this.renderAvatar({color:'rgb(226,0,6)'})}
                {this.renderName()}
            </View>
            <View style={accountStyle.formRow}>
                {this.renderEmail()}
            </View>
            <View style={accountStyle.formRow}>
                {this.renderCpf()}
                {this.renderRg()}
            </View>
            <View style={accountStyle.formRow}>
                {this.renderPhone()}
                {this.renderCellPhone()}
            </View>
            <View style={accountStyle.formRow}>
                {this.renderCep()}
                <View style={{flex:1}} />
            </View>
            <View style={accountStyle.formRow}>
                {this.renderAddress()}
            </View>
            <View style={accountStyle.formRow}>
                {this.renderAddressNumber()}
                {this.renderAddressComplement()}
            </View>
            <View style={accountStyle.formRow}>
                {this.renderNeighborhood()}
                {this.renderCity()}
            </View>
            <View style={accountStyle.formRow}>
                {this.renderState()}
                {this.renderInstagram()}
            </View>
            </>
        )
    }
}