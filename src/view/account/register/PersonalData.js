import React from 'react';
import { RegisterContext } from './Register';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '../../../components';
import I18n from '../../../i18n';
import Form from '../../Form';

export class PersonalData extends Form {
    static contextType = RegisterContext;

    constructor(props,context){
        super(props,context);
        this.state = this.getInitialState();
    }

    handleFormSubmit(){
        this.props.onContinue(this.state)
    }

    render(){
        return (
            <View style={{flex:1}}>
                <View >
                    <View style={{
                    marginHorizontal:30,
                    marginVertical: 30
                }}>
                        <Text weight='bold' style={{
                            color: 'rgb(125,125,125)',
                        }}>
                            {I18n.t('account.register.personalDataTitle')}
                            <Text weight='bold' style={{
                            color: 'rgb(88,12,33)',
                        }}>{I18n.t('account.register.personalDataHighlight')}</Text>
                        </Text>
                    </View>
                    <View style={{
                        marginHorizontal: 20,
                        marginBottom: 30
                    }}>
                        <View style={[formRow,{marginBottom: 20}]}>
                            {this.renderAvatar()}
                            {this.renderName()}
                            
                        </View>
                        <View style={formRow}>
                            {this.renderEmail()}
                        </View>
                        <View style={formRow}>
                            {this.renderCpf()}
                            {this.renderRg()}
                        </View>
                        <View style={formRow}>
                            {this.renderCau()}
                            {this.renderDOB()}
                        </View>
                        <View style={formRow}>
                            {this.renderPhone()}
                            {this.renderCellPhone()}
                        </View>
                        <View style={formRow}>
                            {this.renderCep()}
                            <View style={{flex:1}} />
                        </View>
                        <View style={formRow}>
                            {this.renderAddress()}
                        </View>
                        <View style={formRow}>
                            {this.renderAddressNumber()}
                            {this.renderAddressComplement()}
                        </View>
                        <View style={formRow}>
                            {this.renderNeighborhood()}
                            {this.renderCity()}
                        </View>
                        <View style={formRow}>
                            {this.renderState()}
                            {this.renderInstagram()}
                        </View>
                        <View style={formRow}>
                            {this.renderPassword()}
                            {this.renderPasswordConfirmation()}
                        </View>
                    </View>
                </View>
                {this.renderFormSubmit()}
            </View>
        )
    }
}

const formRow = {
    flexDirection: 'row',
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center'
}


