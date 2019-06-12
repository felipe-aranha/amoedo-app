import React from 'react';
import { MainView } from '../../MainView';
import { RegisterContext } from './Register';
import { View } from 'react-native';
import { Text } from '../../../components';
import I18n from '../../../i18n';
import { PersonalData } from './PersonalData';
import { accountStyle } from '../../../style';

export class ProfessionalData extends PersonalData {
    static contextType = RegisterContext;

    constructor(props,context){
        super(props,context);
    }

    title = I18n.t('account.register.professionalDataTitle');
    titleHighlight = I18n.t('account.register.professionalDataHighlight');

    isFormValid(){
        return this.notEmpty('cnpj',14) && this.notEmpty('companyName') && this.notEmpty('monthlyProjects');
    }

    renderForm(){
        return (
            <>
                <View style={accountStyle.formRow}>
                    {this.renderCnpj()}
                    <View style={{flex:1}} />
                </View>
                <View style={accountStyle.formRow}>
                    {this.renderCompanyName()}
                </View>
                <View style={accountStyle.formRow}>
                    {this.renderMonthlyProjects()}
                </View>
            </>
        )
    }
}