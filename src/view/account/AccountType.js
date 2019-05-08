import React from 'react';
import { AccountBase } from './AccountBase';
import {
    ImageBackground,
    View
} from 'react-native';
import I18n from '../../i18n';
import { accountStyle } from '../../style';
import { Text } from '../../components';

export default class AccountType extends AccountBase{

    constructor(props,context){
        super(props,context);

    }

    renderContent(){
        return(
            <>
                <View style={{flex:1}}>
                </View>
                <View style={{flex:1}}>
                    <View style={{flex:1}}>
                        <Text>
                            <Text>{I18n.t('account.accountType.mainText')}</Text>
                            <Text>{I18n.t('account.accountType.highlight')}</Text>
                        </Text>
                    </View>
                    <View style={{flex:1}}>
                    </View>
                </View>
            </>
        )
    }
}