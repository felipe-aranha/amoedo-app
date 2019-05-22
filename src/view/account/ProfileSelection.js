import React from 'react';
import { MainView } from '../';
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { secondaryColor } from '../../style';
import { Header } from '../../components';
import I18n from '../../i18n';

export default class ProfileSelection extends MainView{
    renderCenter(){
        return(
            <View style={{flex:1}}>
                <Header 
                    title={I18n.t('account.profileSelection.title')}
                    handleBack={this.handleBack}
                    leftIconColor={secondaryColor}
                    titleStyle={{
                        fontFamily: 'system-medium',
                        color: 'rgb(74,74,74)',
                        fontSize: 15
                    }}
                />
            </View>
        )
    }
}