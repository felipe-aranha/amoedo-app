import React from 'react';
import { AccountBase } from './AccountBase';
import { ImageBackground, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Actions } from 'react-native-router-flux';
import { Input, Button } from 'react-native-elements';
import { AppIcon, Text } from '../../components';
import I18n from '../../i18n';
import { accountStyle } from '../../style';

export default class Login extends AccountBase{
    imageBackground = require('../../../assets/images/account/login-bg-x2.png');

    email = null;
    password = null;

    constructor(props,context){
        super(props,context);
        this.email = React.createRef();
        this.password = React.createRef();
    }

    goToPassword(){
        if(this.password.current)
            this.password.current.focus()
    }

    renderContent(){
        return(
            <View style={{flex:1}}>
                <ImageBackground
                    source={require('../../../assets/images/account/login-navbar-x2.png')}
                    resizeMode={'stretch'}
                    style={accountStyle.loginNavBarBackground}
                >
                    <View style={{flex:1}}>
                        <View style={{
                            marginTop: 35,
                            marginLeft: 20
                        }}>
                            <TouchableOpacity
                                hitSlop={{
                                    top:10,
                                    bottom: 10,
                                    left:10,
                                    right:10
                                }}
                                onPress={this.handleBack}
                            >
                                <Ionicons 
                                    name={'ios-arrow-round-back'}
                                    color={'#fff'}
                                    size={40}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={{
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            top: -30
                        }}>
                            <Image 
                                source={require('../../../assets/images/brand-logo-x2.png')}
                                style={{
                                    width: 150
                                }}
                                resizeMode={'contain'}
                            />
                        </View>
                    </View>
                </ImageBackground>
                <ScrollView style={{
                    paddingHorizontal: 30
                }}>
                    <View style={accountStyle.loginMainView}>
                        <Input 
                            keyboardType={'email-address'}
                            autoCapitalize={'none'}
                            leftIcon={<AppIcon name={'email'} />}
                            placeholder={I18n.t('account.login.email')}
                            inputContainerStyle={accountStyle.inputContainterStyle}
                            inputStyle={accountStyle.inputStyle}
                            placeholderTextColor={'#fff'}
                            onSubmitEditing={this.goToPassword.bind(this)}
                            ref={this.email}
                            containerStyle={accountStyle.inputWrapperStyle}
                        />
                        <Input 
                            keyboardType={'default'}
                            autoCapitalize={'none'}
                            leftIcon={<AppIcon name={'password'} />}
                            placeholder={I18n.t('account.login.password')}
                            inputContainerStyle={accountStyle.inputContainterStyle}
                            inputStyle={accountStyle.inputStyle}
                            placeholderTextColor={'#fff'}
                            returnKeyType={'go'}
                            ref={this.password}
                            containerStyle={accountStyle.inputWrapperStyle}
                            secureTextEntry
                        />
                        <View style={accountStyle.loginButtonContainter}>
                            <Button 
                                title={I18n.t('account.login.enter')}
                                containerStyle={[accountStyle.accountTypeButtonContainer]}
                                buttonStyle={[accountStyle.accountTypeButton,accountStyle.loginButton]}
                                titleStyle={[accountStyle.accountTypeButtonTitle, accountStyle.loginButtonTitle]}
                                onPress={this.handleButtonPress}
                            />
                            <TouchableOpacity>
                                <Text style={accountStyle.forgotPasswordText}>{I18n.t('account.login.forgot')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        )
    }
}