import React from 'react';
import { MainView } from './MainView';
import { MainContext } from '../reducer';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { Header } from '../components';
import { AntDesign } from '@expo/vector-icons';
import I18n from '../i18n';
import { secondaryColor, tertiaryColor } from '../style';

export default class EditProfile extends MainView{

    static contextType = MainContext;

    isProfessional(){
        return this.context.user.isProfessional;
    }

    renderCenter(){
        return(
            <View style={{backgroundColor: 'rgb(238,238,238)', flex: 1}}>
                <Header
                    title={I18n.t('section.myProfile')}
                    titleStyle={{
                        fontFamily: 'system-bold',
                        fontSize: 16,
                        color: 'rgb(74,74,74)'
                    }}
                    leftIcon={
                        <TouchableOpacity
                            hitSlop={{
                                top:20,
                                bottom: 20,
                                left:20,
                                right:20
                            }}
                            onPress={this.handleBack.bind(this)}
                            style={{
                                marginLeft: 10
                            }}
                        >
                            <AntDesign 
                                name={'close'}
                                color={this.props.leftIconColor}
                                size={24}
                                color={this.isProfessional() ? secondaryColor : tertiaryColor}
                            />
                        </TouchableOpacity>
                    }
                />
                <ScrollView>

                </ScrollView>
            </View>
        )
    }

}