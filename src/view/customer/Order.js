import React from 'react';
import { View } from 'react-native';
import { accountStyle } from '../../style';
import { Actions } from 'react-native-router-flux';
import I18n from '../../i18n';
import { Feather } from '@expo/vector-icons';
import { Text } from '../../components';
import { AccountBase } from '../account/AccountBase';

export class Order extends AccountBase {

    imageBackground = require('../../../assets/images/account/login-bg-x2.png');

    renderContent(){
        return(
            <View style={accountStyle.pendingArea}>
                <View
                    style={accountStyle.pendingBg}
                >
                    <View style={accountStyle.pendingTitleArea}>
                        <Feather 
                            name={'x'}
                            color={'#fff'}
                            size={32}
                            style={{
                                position: 'absolute',
                                right: 0,
                                top: 0,
                                padding: 10
                            }}
                            onPress={() => { Actions.reset('customer') }}
                        />
                        <Text style={accountStyle.pendingTitleText}>{I18n.t('order.title')}</Text>
                    </View> 
                    <View style={accountStyle.pendingDescriptionArea}>
                        <Text style={accountStyle.pendingDescriptionText}>{I18n.t('order.message',{ order : this.props.order || ''})}</Text>
                    </View>
                </View>
            </View>
        )
    }

}