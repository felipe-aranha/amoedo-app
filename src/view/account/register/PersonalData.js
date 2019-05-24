import React from 'react';
import { MainView } from '../../MainView';
import { RegisterContext } from './Register';
import { View, TouchableOpacity } from 'react-native';
import { Text, AppIcon } from '../../../components';
import I18n from '../../../i18n';
import { Input as InputElement } from 'react-native-elements';
import { secondaryColor } from '../../../style';
import { AntDesign } from '@expo/vector-icons';
import { CustomerService } from '../../../service';

export class PersonalData extends MainView {
    static contextType = RegisterContext;

    constructor(props,context){
        super(props,context);
        this.customerService = new CustomerService();
        this.state = this.props.initialState || {
            showPassword: false,
            showPasswordConfirmation: false,
            password: '',
            confirmPassword: '',
            cau: '',
            email: '',
            cpf: '',
            rg: '',
            name: '',
            dob: '',
            linkedin: '',
            phone: '',
            cell: '',
            zipCode: '',
            address: '',
            number: '',
            complement: '',
            city:'',
            state: '',
            emailErrorMessage: ''
        }
    }

    handlePasswordChange(text){
        this.setState({
            password: text
        })
    }
    handlePasswordConfirmationChange(text){
        this.setState({
            confirmPassword: text
        })
    }
    handleCauChange(text){
        this.setState({
            cau: text
        })
    }
    handleEmailChange(text){
        this.setState({
            email: text
        })
    }
    handleCpfChange(text){
        this.setState({
            cpf: text
        })
    }
    handleRgChange(text){
        this.setState({
            rg: text
        })
    }
    handleNameChange(text){
        this.setState({
            name: text
        })
    }
    handleDobChange(text){
        this.setState({
            dob: text
        })
    }
    handleLinkedinChange(text){
        this.setState({
            linkedin: text
        })
    }
    handlePhoneChange(text){
        this.setState({
            phone: text
        })
    }
    handleCellChange(text){
        this.setState({
            cell: text
        })
    }
    handleZipCodeChange(text){
        this.setState({
            zipCode: text
        })
    }
    handleAddressChange(text){
        this.setState({
            address: text
        })
    }
    handleNumberChange(text){
        this.setState({
            number: text
        })
    }
    handleComplementChange(text){
        this.setState({
            complement: text
        })
    }
    handleCityChange(text){
        this.setState({
            city: text
        })
    }
    handleStateChange(text){
        this.setState({
            state: text
        })
    }

    togglePasswordField(){
        this.setState({
            showPassword: !this.state.showPassword
        })
    }

    toggleConfirmPasswordField(){
        this.setState({
            showPasswordConfirmation: !this.state.showPasswordConfirmation
        })
    }

    validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    checkEmail(){
        if(!this.validateEmail(this.state.email)){
            this.setState({
                emailErrorMessage: I18n.t('account.errorMessage.invalidEmail')
            });
            return;
        }
        this.setState({
            emailErrorMessage: ''
        });
        this.customerService.isEmailAvailable(this.state.email).then( result => {
            if(!result)
                this.setState({
                    emailErrorMessage: I18n.t('account.errorMessage.emailRegistered')
                })
        }).catch( e => { console.log(e) })
        
    }

    handleContinue(){
        this.props.onContinue(this.state)
    }

    render(){
        return (
            <View style={{flex:1}}>
                <View >
                    <View style={{
                    marginHorizontal:30,
                    marginVertical: 30
                }}>
                        <Text weight='bold' style={{
                            color: 'rgb(125,125,125)',
                        }}>
                            {I18n.t('account.register.personalDataTitle')}
                            <Text weight='bold' style={{
                            color: 'rgb(88,12,33)',
                        }}>{I18n.t('account.register.personalDataHighlight')}</Text>
                        </Text>
                    </View>
                    <View style={{
                        marginHorizontal: 20,
                        marginBottom: 30
                    }}>
                        <View style={[formRow,{marginBottom: 20}]}>
                            <TouchableOpacity style={{
                                width: 60,
                                height: 60,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: '#fff',
                                borderRadius: 30,
                                marginHorizontal: 10,
                            }}>
                                <AppIcon style={{
                                    width: 24,
                                    height: 24
                                }} name='camera' />
                                <AntDesign 
                                    name={'pluscircle'}
                                    size={25}
                                    style={{
                                        color: secondaryColor,
                                        position: 'absolute',
                                        top: 0,
                                        right: -5
                                    }}
                                />
                            </TouchableOpacity>
                            <Input 
                                onChangeText={this.handlePasswordChange.bind(this)}
                                value={this.state.password}
                                label='senha'
                                secureTextEntry={!this.state.showPassword}
                                rightIcon={{
                                    name: this.state.showPassword ? 'eye' : 'eye-slash',
                                    type:'font-awesome',
                                    color: 'rgb(77,77,77)',
                                    size: 18,
                                    onPress: this.togglePasswordField.bind(this)
                                }}
                                errorMessage={this.state.password.length < 6 ? I18n.t('account.errorMessage.password') : ''}
                            />
                            <Input 
                                onChangeText={this.handlePasswordConfirmationChange.bind(this)}
                                value={this.state.confirmPassword}
                                label='repetir senha'
                                secureTextEntry={!this.state.showPasswordConfirmation}
                                rightIcon={{
                                    name: this.state.showPasswordConfirmation ? 'eye' : 'eye-slash',
                                    type:'font-awesome',
                                    color: 'rgb(77,77,77)',
                                    size: 18,
                                    onPress: this.toggleConfirmPasswordField.bind(this)
                                }}
                                errorMessage={
                                    this.state.password != this.state.confirmPassword && this.state.confirmPassword.length > 0 ? 
                                        I18n.t('account.errorMessage.confirmPassword') : ''
                                }
                            />
                        </View>
                        <View style={formRow}>
                            <Input 
                                label='registro do cau'
                                value={this.state.cau}
                                onChangeText={this.handleCauChange.bind(this)}
                            />
                            <View style={{flex:1}} />
                        </View>
                        <View style={formRow}>
                            <Input 
                                label='e-mail'
                                value={this.state.email}
                                onChangeText={this.handleEmailChange.bind(this)}
                                onBlur={this.checkEmail.bind(this)}
                                errorMessage={this.state.emailErrorMessage}
                                autoCapitalize={'none'}
                                keyboardType={'email-address'}
                            />
                        </View>
                        <View style={formRow}>
                            <Input 
                                label='cpf'
                                value={this.state.cpf}
                                onChangeText={this.handleCpfChange.bind(this)}
                                keyboardType={'number-pad'}
                            />
                            <Input 
                                label='rg'
                                keyboardType={'number-pad'}
                                value={this.state.rg}
                                onChangeText={this.handleRgChange.bind(this)}
                            />
                        </View>
                        <View style={formRow}>
                            <Input 
                                label='nome'
                                autoCapitalize={'words'}
                                value={this.state.name}
                                onChangeText={this.handleNameChange.bind(this)}
                            />
                        </View>
                        <View style={formRow}>
                            <Input 
                                label='nascimento'
                                value={this.state.dob}
                                onChangeText={this.handleDobChange.bind(this)}
                            />
                            <Input 
                                label='linkedin'
                                value={this.state.linkedin}
                                onChangeText={this.handleLinkedinChange.bind(this)}
                            />
                        </View>
                        <View style={formRow}>
                            <Input 
                                label='telefone'
                                value={this.state.phone}
                                onChangeText={this.handlePhoneChange.bind(this)}
                            />
                            <Input 
                                label='celular'
                                value={this.state.cell}
                                onChangeText={this.handleCellChange.bind(this)}
                            />
                        </View>
                        <View style={formRow}>
                            <Input 
                                label='cep'
                                value={this.state.zipCode}
                                onChangeText={this.handleZipCodeChange.bind(this)}
                            />
                            <View style={{flex:1}} />
                        </View>
                        <View style={formRow}>
                            <Input 
                                label='endereço'
                                value={this.state.address}
                                onChangeText={this.handleAddressChange.bind(this)}
                            />
                        </View>
                        <View style={formRow}>
                            <Input 
                                label='número'
                                value={this.state.number}
                                onChangeText={this.handleNumberChange.bind(this)}
                            />
                            <Input 
                                label='complemento'
                                value={this.state.complement}
                                onChangeText={this.handleComplementChange.bind(this)}
                            />
                        </View>
                        <View style={formRow}>
                            <Input 
                                label='cidade'
                                value={this.state.city}
                                onChangeText={this.handleCityChange.bind(this)}
                            />
                            <Input 
                                label='uf'
                                value={this.state.state}
                                onChangeText={this.handleStateChange.bind(this)}
                            />
                        </View>
                    </View>
                </View>
                <TouchableOpacity
                    onPress={this.handleContinue.bind(this)}
                    style={{
                        backgroundColor: 'rgb(50,0,14)',
                        width: '100%',
                        paddingVertical: 20,
                        justifyContent:'center',
                        alignItems: 'center'
                    }}
                >
                    <Text weight={'medium'} style={{
                        color: '#fff',
                        fontSize: 14
                    }}>{I18n.t('common.continue').toUpperCase()}</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

class Input extends React.PureComponent{
    render(){
        return <InputElement 
            {...this.props}
            containerStyle={{flex:1}}
            labelStyle={{
                fontFamily: 'system-medium',
                color: 'rgb(163,163,163)',
                textTransform: 'uppercase',
                fontSize: 12
            }}
            inputContainerStyle={{
                borderBottomColor: 'rgba(77,77,77,0.3)'
            }}
            inputStyle={{
                fontFamily: 'system-medium',
                color: secondaryColor,
                fontSize: 14
            }}
            errorStyle={{
                position: 'absolute',
                bottom: -20,
                color: 'rgb(177,3,3)',
                fontFamily: 'system-medium',
                fontSize: 10
            }}
            errorProps={{
                numberOfLines: 1
            }}
        />
    }
}

const formRow = {
    flexDirection: 'row',
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center'
}
