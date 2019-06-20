import React from 'react';
import { AccountBase } from '../AccountBase';
import { View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Text } from '../../../components';
import { accountStyle } from '../../../style';
import { Actions } from 'react-native-router-flux';

export class Pending extends AccountBase{

    imageBackground = require('../../../../assets/images/account/login-bg-x2.png');

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
                            onPress={() => { this.logout() }}
                        />
                       <Text style={accountStyle.pendingTitleText}>{'Cadastro realizado\ncom sucesso'}</Text>
                    </View> 
                    <View style={accountStyle.pendingDescriptionArea}>
                       <Text style={accountStyle.pendingDescriptionText}>{'Seu perfil está sendo analisado,\navisaremos em breve.'}</Text>
                    </View>
                </View>
            </View>
        )
    }
}