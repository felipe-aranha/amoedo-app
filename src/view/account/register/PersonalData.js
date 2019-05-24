import React from 'react';
import { MainView } from '../../MainView';
import { RegisterContext } from './Register';
import { View, TouchableOpacity } from 'react-native';
import { Text, AppIcon } from '../../../components';
import I18n from '../../../i18n';
import { Input as InputElement } from 'react-native-elements';
import { secondaryColor } from '../../../style';
import { AntDesign } from '@expo/vector-icons';

export class PersonalData extends MainView {
    static contextType = RegisterContext;

    constructor(props,context){
        super(props,context);
        this.state = {
            showPassword: false,
            showPasswordConfirmation: false
        }
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
                        <View style={[formRow,{marginBottom: 10}]}>
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
                                label='senha'
                                secureTextEntry={!this.state.showPassword}
                                rightIcon={{
                                    name: this.state.showPassword ? 'eye' : 'eye-slash',
                                    type:'font-awesome',
                                    color: 'rgb(77,77,77)',
                                    size: 18,
                                    onPress: this.togglePasswordField.bind(this)
                                }}
                            />
                            <Input 
                                label='repetir senha'
                                secureTextEntry={!this.state.showPasswordConfirmation}
                                rightIcon={{
                                    name: this.state.showPasswordConfirmation ? 'eye' : 'eye-slash',
                                    type:'font-awesome',
                                    color: 'rgb(77,77,77)',
                                    size: 18,
                                    onPress: this.toggleConfirmPasswordField.bind(this)
                                }}
                            />
                        </View>
                        <View style={formRow}>
                            <Input 
                                label='registro do cau'
                            />
                            <View style={{flex:1}} />
                        </View>
                        <View style={formRow}>
                            <Input 
                                label='e-mail'
                            />
                        </View>
                        <View style={formRow}>
                            <Input 
                                label='cpf'
                            />
                            <Input 
                                label='rg'
                            />
                        </View>
                        <View style={formRow}>
                            <Input 
                                label='nome'
                            />
                        </View>
                        <View style={formRow}>
                            <Input 
                                label='nascimento'
                            />
                            <Input 
                                label='linkedin'
                            />
                        </View>
                        <View style={formRow}>
                            <Input 
                                label='telefone'
                            />
                            <Input 
                                label='celular'
                            />
                        </View>
                        <View style={formRow}>
                            <Input 
                                label='cep'
                            />
                            <View style={{flex:1}} />
                        </View>
                        <View style={formRow}>
                            <Input 
                                label='endereço'
                            />
                        </View>
                        <View style={formRow}>
                            <Input 
                                label='número'
                            />
                            <Input 
                                label='complemento'
                            />
                        </View>
                        <View style={formRow}>
                            <Input 
                                label='cidade'
                            />
                            <Input 
                                label='uf'
                            />
                        </View>
                    </View>
                </View>
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
                color: secondaryColor
            }}
        />
    }
}

const formRow = {
    flexDirection: 'row',
    marginVertical: 5,
    justifyContent: 'center',
    alignItems: 'center'
}
