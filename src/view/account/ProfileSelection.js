import React from 'react';
import { MainView } from '../MainView';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { secondaryColor } from '../../style';
import { Header, Text, Select } from '../../components';
import I18n from '../../i18n';
import { CustomerService } from '../../service';

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

    getOptions(options){
        console.log(options)
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
                        <View>
                            <Select 
                                options={this.getOptions(this.state.profiles)}
                            />
                        </View>
                    </ScrollView>
                </View>
            </View>
        )
    }
}