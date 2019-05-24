import React from 'react';
import { MainView } from '../../MainView';
import { RegisterContext } from './Register';
import { View } from 'react-native';
import { Text } from '../../../components';
import I18n from '../../../i18n';

export class ProfessionalData extends MainView {
    static contextType = RegisterContext;

    constructor(props,context){
        super(props,context);
    }

    renderCenter(){
        return (
            <View>
                <View>
                    <Text>

                        <Text></Text>
                    </Text>
                </View>
            </View>
        )
    }
}