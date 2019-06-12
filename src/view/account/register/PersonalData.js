import React from 'react';
import { RegisterContext } from './Register';
import { View, Alert } from 'react-native';
import { Text } from '../../../components';
import I18n from '../../../i18n';
import Form from '../../Form';
import { accountStyle, relativeHeight } from '../../../style';
import _ from 'lodash';

export class PersonalData extends Form {
    static contextType = RegisterContext;

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
        isNameValid = this.state.name.trim().split(' ').length > 1;
        isPhonevalid = this.notEmpty('phone') || this.notEmpty('cell');
        return isNameValid && this.state.emailValid && 
                    this.state.cpfValid && this.notEmpty('rg') &&
                    this.notEmpty('cau') && this.state.dobValid && 
                    isPhonevalid && this.notEmpty('zipCode',8) &&
                    this.notEmpty('address') && this.notEmpty('city') &&
                    this.notEmpty('state') && this.notEmpty('password',6) &&
                    this.notEmpty('confirmPassword',6) && this.state.password == this.state.confirmPassword


    }

    componentDidUpdate(prevProps,prevState){
        if(!_.isEqual(prevState, this.state)){
            this.props.onStateChange(this.state);
        }
    }

    renderForm(){
        return(
            <>
            <View style={[accountStyle.formRow,{marginBottom: 20}]}>
                {this.renderAvatar()}
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
                {this.renderCau()}
                {this.renderDOB()}
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
            <View style={accountStyle.formRow}>
                {this.renderPassword()}
                {this.renderPasswordConfirmation()}
            </View>
            <View style={{height: 50}}>
            </View>
            </>
        )
    }

    title = I18n.t('account.register.personalDataTitle');
    titleHighlight = I18n.t('account.register.personalDataHighlight');
    render(){
        return (
            <View style={{flex:1, minHeight: relativeHeight(100) -  130}}>
                <View >
                    <View style={accountStyle.sectionTitleArea}>
                        <Text weight='bold' style={accountStyle.sectionTitleText}>
                            {this.title}
                            {this.titleHighlight != null &&
                                <Text weight='bold' style={accountStyle.sectionTitleTextHighlight}>{this.titleHighlight}</Text>
                            }
                            
                        </Text>
                    </View>
                    <View style={accountStyle.formContent}>
                        {this.renderForm()}
                    </View>
                </View>
                {!this.state.hideSubmit && this.renderFormSubmit()}
            </View>
        )
    }
}


