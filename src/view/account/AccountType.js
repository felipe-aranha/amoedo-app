import React from 'react';
import { AccountBase } from './AccountBase';
import {
    ImageBackground,
    View
} from 'react-native';
import I18n from '../../i18n';
import { accountStyle } from '../../style';
import { Text } from '../../components';
import { Button } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import { MainContext } from '../../reducer';

export default class AccountType extends AccountBase{

    static contextType = MainContext;

    constructor(props,context){
        super(props,context);

    }

    handleProfessionalButtonPress(){
        Actions.push('account');
    }

    handleCustomerButtonPress(){
        this.context.message('Não implementado ainda');
    }

    handleAssistanceButtonPress(){
        this.context.message('Não implementado ainda');
    }

    renderContent(){
        return(
            <>
                <View style={{flex:2}}>
                </View>
                <View style={{flex:3}}>
                    <View style={[accountStyle.innerContentView, {flex: 0.75}]}>
                        <Text>
                            <Text style={accountStyle.accountText}>{I18n.t('account.accountType.mainText')}</Text>
                            <Text style={[accountStyle.accountText,accountStyle.accountTypeTextHighlight]}>{I18n.t('account.accountType.highlight')}</Text>
                            <Text style={accountStyle.accountText}>.</Text>
                        </Text>
                    </View>
                    <View style={[accountStyle.innerContentView,accountStyle.accountTypeButtonsArea]}>
                        <Button
                            title={I18n.t('account.accountType.professional')}
                            containerStyle={accountStyle.accountTypeButtonContainer}
                            buttonStyle={[accountStyle.accountTypeButton,accountStyle.accountButtonArchitectButton]}
                            titleStyle={accountStyle.accountTypeButtonTitle}
                            onPress={this.handleProfessionalButtonPress}
                        />
                        <Button 
                            title={I18n.t('account.accountType.technicalAssistance')}
                            containerStyle={accountStyle.accountTypeButtonContainer}
                            buttonStyle={[accountStyle.accountTypeButton,accountStyle.accountTechnicalAssistance]}
                            titleStyle={accountStyle.accountTypeButtonTitle}
                            onPress={this.handleAssistanceButtonPress.bind(this)}
                        />
                        <Button 
                            title={I18n.t('entity.customer')}
                            type={'outline'}
                            containerStyle={accountStyle.accountTypeButtonContainer}
                            buttonStyle={[accountStyle.accountTypeButton,accountStyle.accountCustomerButton]}
                            titleStyle={accountStyle.accountTypeButtonTitle}
                            onPress={this.handleCustomerButtonPress.bind(this)}
                        />
                    </View>
                </View>
            </>
        )
    }
}