import React from 'react';
import { AccountBase } from './AccountBase';
import { ImageBackground, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Actions } from 'react-native-router-flux';
import { Input, Button } from 'react-native-elements';
import { AppIcon, Text, KeyboardSpacer } from '../../components';
import I18n from '../../i18n';
import { accountStyle } from '../../style';
import { CustomerService } from '../../service';
import * as Utils from '../../utils';
import { MainContext } from '../../reducer';

export default class Login extends AccountBase{

    static contextType = MainContext;

    imageBackground = require('../../../assets/images/account/login-bg-x2.png');

    email = null;
    password = null;

    constructor(props,context){
        super(props,context);
        this.email = React.createRef();
        this.password = React.createRef();
        this.state = {
            showPassword: false,
            email: '',
            emailError: '',
            password: '',
            loading: false
        }
        this.customerService = new CustomerService();
    }

    handleEmailChange(email){
        this.setState({email, emailError: ''})
    }

    handlePasswordChange(password){
        this.setState({password})
    }

    handleSubmit(){
        const { loading, email, password } = this.state;
        if(loading) return;
        if(!Utils.isEmailValid(email)){
            this.setState({
                emailError: I18n.t('account.errorMessage.invalidEmail')
            })
            return;
        }
        this.setState({
            loading:true
        }, () => {
            this.customerService.login(email,password).then(result => {
                if(!result){
                    this.context.message(I18n.t('account.errorMessage.auth'));
                    this.setState({
                        loading: false
                    })
                    return;
                }
                this.context.user = {
                    ...this.context.user,
                    token: this.customerService.getToken(),
                    magento: result
                }
                Actions.reset('purgatory');
            }).catch(e => {
                this.context.message(I18n.t('account.errorMessage.login'));
                this.setState({
                    loading: false
                })
            })
        })
    }

    goToPassword(){
        if(this.password.current)
            this.password.current.focus()
    }

    togglePasswordField(){
        this.setState({
            showPassword: !this.state.showPassword
        })
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
                        <View style={accountStyle.loginHeaderBackArea}>
                            <TouchableOpacity
                                hitSlop={{
                                    top:20,
                                    bottom: 20,
                                    left:20,
                                    right:20
                                }}
                                style={{
                                    width: 30,
                                    height: 30
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
                        <View style={accountStyle.loginLogoArea}>
                            <Image 
                                source={require('../../../assets/images/brand-logo-x2.png')}
                                style={accountStyle.loginLogoImage}
                                resizeMode={'contain'}
                            />
                        </View>
                    </View>
                </ImageBackground>
                <ScrollView style={accountStyle.loginFormArea}>
                    <View style={accountStyle.loginMainView}>
                        <Input 
                            onChangeText={this.handleEmailChange.bind(this)}
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
                            errorMessage={this.state.emailError}
                        />
                        <Input 
                            onChangeText={this.handlePasswordChange.bind(this)}
                            onSubmitEditing={this.handleSubmit.bind(this)}
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
                            secureTextEntry={!this.state.showPassword}
                            rightIcon={{
                                name: this.state.showPassword ? 'eye' : 'eye-slash',
                                type:'font-awesome',
                                color: '#fff',
                                size: 16,
                                onPress: this.togglePasswordField.bind(this),
                                iconStyle: {
                                    marginRight: 15
                                }
                            }}
                        />
                        <View style={accountStyle.loginButtonContainter}>
                            <Button 
                                title={I18n.t('account.login.enter')}
                                containerStyle={[accountStyle.accountTypeButtonContainer]}
                                buttonStyle={[accountStyle.accountTypeButton,accountStyle.loginButton]}
                                titleStyle={[accountStyle.accountTypeButtonTitle, accountStyle.loginButtonTitle]}
                                onPress={this.handleSubmit.bind(this)}
                                loading={this.state.loading}
                                loadingProps={{
                                    color: '#000'
                                }}
                            />
                            <TouchableOpacity>
                                <Text style={accountStyle.forgotPasswordText}>{I18n.t('account.login.forgot')}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <TouchableOpacity onPress={() => { Actions.push('profileSelection') }} style={accountStyle.loginSignInButton}>
                                <Text style={accountStyle.loginSignInButtonText}>
                                    {I18n.t('account.login.register')}
                                    <Text style={accountStyle.loginSignInButtonTextHighlight}>{I18n.t('account.login.here')}</Text>!
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
                <KeyboardSpacer />
            </View>
        )
    }
}