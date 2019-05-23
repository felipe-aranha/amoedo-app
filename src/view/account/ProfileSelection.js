import React from 'react';
import { MainView } from '../MainView';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons, SimpleLineIcons } from '@expo/vector-icons';
import { secondaryColor } from '../../style';
import { Header, Text, Select } from '../../components';
import I18n from '../../i18n';
import { CustomerService } from '../../service';
import { Actions } from 'react-native-router-flux';

export default class ProfileSelection extends MainView {

    customerService = null;

    constructor(props,context){
        super(props,context);
        this.customerService = new CustomerService();
        this.state = {
            profiles: [],
            loading: false,
            error: false,
            mainProfile: null,
            profile: null
        }
    }

    componentDidMount(){
        super.componentDidMount();
        this.getGroups();
    }

    getGroups(){
        if(this.state.loading) return;
        this.setState({
            loading: true
        }, () => {
            this.customerService.getCustomerGroups().then( result => {
                if(result.items){
                    profiles = result.items.filter(item => item.code.startsWith('Perfil'));
                    profiles = profiles.map(profile => {
                        name = profile.code.replace('Perfil ','');
                        subProfiles = result.items.filter(item => item.code.endsWith(name) && item.id != profile.id);
                        subProfiles = subProfiles.map(sub => {
                            return {
                                ...sub,
                                name: sub.code.replace(` ${name}`,'')
                            }
                        })
                        return {
                            ...profile,
                            name,
                            children: subProfiles
                        }
                    });
                    this.setState({
                        loading: false,
                        error: false,
                        profiles
                    })
                }
                this.setState({error: false, loading: false})
            }).catch(() => {
                this.setState({error: true, loading: false})
            })
        })
        
    }

    selectMainProfile(option){
        selected = this.state.profiles.find(profile => profile.id == option.value) || null;
        this.setState({
            mainProfile: selected,
            profile: null
        })
    }

    selectProfile(option){
        selected = this.state.mainProfile.children.find(profile => profile.id == option.value) || null;
        this.setState({
            profile: selected
        })
    }

    goToRegister(){
        Actions.push('register', {profile: this.state.profile})
    }

    getOptions(options){
        if(options && options.length)
            return options.map(option => {
                return {
                    label: option.name,
                    value: option.id
                }
            })
        return [];
    }

    renderCenter(){
        return(
            <View style={{flex:1}}>
                <Header 
                    title={I18n.t('account.profileSelection.title')}
                    handleBack={this.handleBack}
                    leftIconColor={secondaryColor}
                    titleStyle={{
                        fontFamily: 'system-medium',
                        color: 'rgb(74,74,74)',
                        fontSize: 15
                    }}
                />
                <View style={{flex:1, marginHorizontal: 30, marginTop: 20}}>
                    <ScrollView>
                        <View>
                            <Text style={{
                                fontFamily: 'system-bold',
                                fontSize: 22,
                                color: 'rgb(116,116,116)'
                            }}>
                                <Text weight={'bold'} style={{color: 'rgb(77,77,77)'}}>{I18n.t('account.profileSelection.highlightDesc1')}</Text>
                                <Text weight={'bold'}>{I18n.t('account.profileSelection.desc1')}</Text>
                                <Text weight={'bold'} style={{color:'rgb(141,2,40)'}}>{I18n.t('account.profileSelection.highlightDesc2')}</Text>
                                <Text weight={'bold'}>{I18n.t('account.profileSelection.desc2')}</Text>
                            </Text>
                        </View>
                        <View style={{
                            marginTop: 20
                        }}>
                            <Select 
                                options={this.getOptions(this.state.profiles)}
                                onOptionSelected={this.selectMainProfile.bind(this)}
                                loading={this.state.loading}
                            />
                        </View>
                        {this.state.mainProfile != null && this.state.mainProfile.children.length > 0 &&
                            <View style={{
                                marginTop: 20
                            }}>
                                <View>
                                    <Text weight={'medium'}
                                        style={{
                                            fontSize: 14,
                                            textTransform: 'uppercase',
                                            color: 'rgb(121,121,121)'
                                        }}
                                    >{I18n.t('account.profileSelection.typeOf', { type: this.state.mainProfile.name})}</Text>
                                </View>
                                <Select
                                    options={this.getOptions(this.state.mainProfile.children)}
                                    onOptionSelected={this.selectProfile.bind(this)}
                                    loading={this.state.loading}
                                />
                            </View>
                        }
                    </ScrollView>
                    {this.state.profile != null && 
                        <TouchableOpacity
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                paddingBottom: 50
                            }}
                            onPress={this.goToRegister.bind(this)}
                        >
                            <SimpleLineIcons 
                                name={'arrow-down-circle'}
                                color={secondaryColor}
                                size={40}
                            />
                        </TouchableOpacity>
                    }
                </View>
            </View>
        )
    }
}