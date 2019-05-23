import React from 'react';
import { MainView } from '../../MainView';
import { Header, Text, Select } from '../../../components';
import { View, StatusBar } from 'react-native';
import { secondaryColor } from '../../../style';

export default class Register extends MainView{

    constructor(props,context){
        super(props,context);
        StatusBar.setBarStyle("light-content",true);
        this.profile = {
            id: 9,
            name: 'Arquiteto'
        }
    }

    renderCenter(){
        return (
            <View style={{
                flex:1
            }}>
                <Header 
                    title={this.profile.name}
                    handleBack={this.handleBack}
                    leftIconColor={'rgb(242,242,242)'}
                    titleStyle={{
                        fontFamily: 'system-medium',
                        color: 'rgb(242,242,242)',
                        fontSize: 15,
                        textTransform: 'uppercase'
                    }}
                    backgroundColor={secondaryColor}
                />
            </View>
        )
    }
}