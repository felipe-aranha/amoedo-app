import React from 'react';
import { View, Alert } from 'react-native';
import { Text } from '../../../components';
import I18n from '../../../i18n';
import Form from '../../Form';
import { accountStyle, relativeHeight } from '../../../style';
import _ from 'lodash';
import { MainContext } from '../../../reducer';

export class PersonalData extends Form {
    static contextType = MainContext;

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

    isStudent(){
        return ~this.props.profile.code.toLowerCase().indexOf('estudante')
    }

    getDocumentType(){
        switch(this.props.profile.name.toLowerCase()){
            case 'arquiteto':
                    return 'cau';
                    break;
                case 'designer':
                    return 'abd';
                    break;
                case 'engenheiro':
                    return 'crea';
                    break;
                default:
                    return 'cnpj';
                    break;
        }
    }

    isFormValid(){
        const isNameValid = this.notEmpty('name');
        const isPhonevalid = this.notEmpty('phone') || this.notEmpty('cell');
        const isCauValid = this.notEmpty('cau') || this.isStudent() || this.getDocumentType() == 'cnpj';
        const isAddressValid = this.notEmpty('zipCode',8) &&
        this.notEmpty('address') && this.notEmpty('city') &&
        this.notEmpty('state');
        if(this.context.user.magento.id){
            return isCauValid && isPhonevalid;
        }
        return isNameValid && this.state.emailValid && 
                    this.state.cpfValid && isCauValid &&
                    isPhonevalid && this.notEmpty('password',6) &&
                    this.notEmpty('confirmPassword',6) && this.state.password == this.state.confirmPassword
    }

    componentDidUpdate(prevProps,prevState){
        if(!_.isEqual(prevState, this.state)){
            this.props.onStateChange(this.state);
        }
    }

    renderForm(){
        const { magento } = this.context && this.context.user ? this.context.user : {};
        const loggedIn = magento.id ? true : false;
        const address = magento.addresses && magento.addresses.length > 0;
        const document = this.isStudent() ? null : this.getDocumentType();
        return(
            <>
            <View style={[accountStyle.formRow,{marginBottom: 20}]}>
                {this.renderAvatar()}
                {!loggedIn && this.renderName()}
                {loggedIn && this.renderEmail(magento.email)}
            </View>
            {!loggedIn &&
                <View style={accountStyle.formRow}>
                    {this.renderEmail()}
                </View>
            }
            <View style={accountStyle.formRow}>
                {!loggedIn && this.renderCpf()}
                {this.renderRg()}
            </View>
            <View style={accountStyle.formRow}>
                {document != null && document != 'cnpj' && this.renderDocument(document)}
                {this.renderDOB()}
                {(document == null || document == 'cnpj') && <View style={{flex:1}} />}
            </View>
            <View style={accountStyle.formRow}>
                {this.renderPhone()}
                {this.renderCellPhone()}
            </View>
            {!address && 
            <>
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
            </>
            }
            <View style={accountStyle.formRow}>
                {!address && this.renderState()}
                {this.renderInstagram()}
            </View>
            {!loggedIn && 
                <View style={accountStyle.formRow}>
                    {this.renderPassword()}
                    {this.renderPasswordConfirmation()}
                </View>
            }
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


