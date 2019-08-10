import React from 'react';
import { AccountBase } from './AccountBase';
import { ImageBackground, View, Image, TouchableOpacity, ScrollView, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Actions } from 'react-native-router-flux';
import { Input, Button } from 'react-native-elements';
import { AppIcon, Text, KeyboardSpacer } from '../../components';
import I18n from '../../i18n';
import { accountStyle, tertiaryColor, secondaryColor } from '../../style';
import { CustomerService } from '../../service';
import * as Utils from '../../utils';
import { MainContext } from '../../reducer';
import { UserService } from '../../service/firebase/UserService';

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
            loading: false,
            customerStep: 1,
            modalRecovery: false
        }
        this.customerService = new CustomerService();
    }

    handleEmailChange(email){
        this.setState({email, emailError: ''})
    }

    handlePasswordChange(password){
        this.setState({password})
    }

    handleBack(){
        if(this.isCustomer() && this.state.customerStep == 2){
            this.setState({
                customerStep: 1
            })
        } 
        else
            Actions.reset('accountType');
    }

    handleDefaultError(e){
        if(e)
            console.log(e);
        this.setState({
            loading: false
        })
    }

    async handleCustomerSubmit(){
        const { customerStep, email, password } = this.state;
        if(customerStep == 1){
            customer = await UserService.getClient(email);
            if(customer == null){
                Alert.alert(I18n.t('account.errorMessage.error'),I18n.t('account.errorMessage.customerNotFound'));
                this.setState({
                    loading: false
                })
                return;
            } else {
                this.customerService.isEmailAvailable(email).then(response => {
                    if(!response){
                        this.setState({
                            customerStep: 2,
                            loading: false
                        })
                    } else {
                        this.context.login();
                        Actions.reset('account', { customer })
                    }
                }).catch( e => {
                    this.handleDefaultError(e);
                })
            }
        } else {
            this.login(email,password);
        }
    }

    handleSubmit(){
        const { loading, email, password } = this.state;
        if(loading) return;
        this.setState({
            loading: true
        },() => {
            if(this.isCustomer()){
                this.handleCustomerSubmit();
                return;
            }
            if(!Utils.isEmailValid(email)){
                this.setState({
                    emailError: I18n.t('account.errorMessage.invalidEmail'),
                    loading: false
                })
                return;
            }
            this.login(email,password);
        })
        
    }

    goToPassword(){
        if(this.isCustomer())
            this.handleSubmit();
        else if(this.password.current)
            this.password.current.focus()
    }

    togglePasswordField(){
        this.setState({
            showPassword: !this.state.showPassword
        })
    }

    renderEmail(){
        return(
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
        )
    }

    renderPassword(){
        return(
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
        )
    }

    togglePasswordRecovery(){
        this.setState({
            modalRecovery: !this.state.modalRecovery
        })
    }

    isCustomer(){
        return this.context.userType == 'customer';
    }

    renderModalRecovery(){
        return(
            <Modal
                
            >

            </Modal>
        )
    }

    renderContent(){
        return(
            <View style={{flex:1}}>
                {this.renderModalRecovery()}
                <ImageBackground
                    source={this.isCustomer() ? require('../../../assets/images/account/customer-login-navbar-x2.png') : require('../../../assets/images/account/login-navbar-x2.png')}
                    resizeMode={'stretch'}
                    tintColor={this.isCustomer() ? tertiaryColor : secondaryColor}
                    style={[accountStyle.loginNavBarBackground,{tintColor: this.isCustomer() ? tertiaryColor : secondaryColor}]}
                >
                    <View style={{flex:1}}>
                        <View style={accountStyle.loginHeaderBackArea}>
                            <TouchableOpacity
                                style={{
                                    width: 60,
                                    height: 60,
                                    zIndex: 999,
                                    justifyContent: 'center',
                                    alignItems: 'flex-start'
                                }}
                                onPress={this.handleBack.bind(this)}
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
                        {(!this.isCustomer() || this.state.customerStep == 1) && this.renderEmail()}
                        {(!this.isCustomer() || this.state.customerStep == 2) && this.renderPassword()}
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
                            <TouchableOpacity onPress={this.togglePasswordRecovery.bind(this)}>
                                <Text style={accountStyle.forgotPasswordText}>{I18n.t('account.login.forgot')}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            {!this.isCustomer() &&
                                <TouchableOpacity onPress={() => { Actions.push('profileSelection') }} style={accountStyle.loginSignInButton}>
                                    <Text style={accountStyle.loginSignInButtonText}>
                                        {I18n.t('account.login.register')}
                                        <Text style={accountStyle.loginSignInButtonTextHighlight}>{I18n.t('account.login.here')}</Text>!
                                    </Text>
                                </TouchableOpacity>
                            }
                        </View>
                    </View>
                </ScrollView>
                <KeyboardSpacer />
            </View>
        )
    }
}