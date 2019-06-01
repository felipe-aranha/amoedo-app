import React from 'react';
import { RegisterContext } from './Register';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '../../../components';
import I18n from '../../../i18n';
import Form from '../../Form';
import { accountStyle } from '../../../style';

export class PersonalData extends Form {
    static contextType = RegisterContext;

    constructor(props,context){
        super(props,context);
        this.state = this.getInitialState();
    }

    handleFormSubmit(){
        this.props.onContinue(this.state)
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
            </>
        )
    }

    title = I18n.t('account.register.personalDataTitle');
    titleHighlight = I18n.t('account.register.personalDataHighlight');
    render(){
        return (
            <View style={{flex:1}}>
                <View >
                    <View style={{
                    marginHorizontal:30,
                    marginVertical: 30,
                    flex: 1
                }}>
                        <Text weight='bold' style={{
                            color: 'rgb(125,125,125)',
                        }}>
                            {this.title}
                            {this.titleHighlight != null &&
                                <Text weight='bold' style={{
                                    color: 'rgb(88,12,33)',
                                }}>{this.titleHighlight}</Text>
                            }
                            
                        </Text>
                    </View>
                    <View style={{
                        marginHorizontal: 20,
                        marginBottom: 30
                    }}>
                        {this.renderForm()}
                    </View>
                </View>
                {this.renderFormSubmit()}
            </View>
        )
    }
}


