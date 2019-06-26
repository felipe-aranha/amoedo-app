import React from 'react';
import Clients from './Clients'
import I18n from '../../i18n';
import Form from '../Form';
import { mainStyle } from '../../style';
import { View, ScrollView } from 'react-native';
import { Text, Check } from '../../components';
import { CheckBox } from 'react-native-elements'

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
                            <Check 
                                title={'Pessoa Física'}
                                onPress={this.changePersonType.bind(this,1)}
                                checked={this.state.personType == 1}
                            />
                            <Check 
                                title={'Pessoa Jurídica'}
                                onPress={this.changePersonType.bind(this,2)}
                                checked={this.state.personType == 2}
                            />
                        </View>
                    </View>
                </ScrollView>
            </View>
        )
    }

}

export class AddClientForm extends Form{

}