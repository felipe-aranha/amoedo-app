import React from 'react';
import { View, TouchableOpacity } from 'react-native'
import { MainContext } from '../../reducer';
import { Text, GradientButton, AppIcon, ImageBase64 } from '../../components';
import { drawerStyle } from '../../style';
import { MaterialIcons } from '@expo/vector-icons';
import { MainView } from '../MainView';
import { Actions } from 'react-native-router-flux';
import I18n from '../../i18n';

export default class ProfessionalDrawer extends MainView{

    static contextType = MainContext;

    goTo(scene){
        if(Actions.currentScene != scene){
            Actions.push(scene);
        } else {
            Actions.drawerClose();
        }
    }

    renderItems(){
        return(
            <View style={drawerStyle.menuArea}>
                <TouchableOpacity onPress={() => {this.goTo('clients')}} style={drawerStyle.menuItemArea}>
                    <AppIcon large name={'clients'} style={drawerStyle.menuItemIcon} />
                    <Text style={drawerStyle.menuItemText}>{I18n.t('menu.clients')}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.goTo('projects')}} style={drawerStyle.menuItemArea}>
                    <AppIcon large name={'list'} style={drawerStyle.menuItemIcon} />
                    <Text style={drawerStyle.menuItemText}>{I18n.t('menu.projects')}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.goTo('points')}} style={drawerStyle.menuItemArea}>
                    <AppIcon large name={'points'} style={drawerStyle.menuItemIcon} />
                    <Text style={drawerStyle.menuItemText}>{I18n.t('menu.points')}</Text>
                </TouchableOpacity>
                { /* <TouchableOpacity style={drawerStyle.menuItemArea}>
                    <AppIcon large name={'occurrence'} style={drawerStyle.menuItemIcon} />
                    <Text style={drawerStyle.menuItemText}>{I18n.t('menu.occurrences')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={drawerStyle.menuItemArea}>
                    <AppIcon large name={'chat'} style={drawerStyle.menuItemIcon} />
                    <Text style={drawerStyle.menuItemText}>{I18n.t('menu.chat')}</Text>
                </TouchableOpacity> */ }
            </View>
        )
    }

    renderBottomItems(){
        return(
            <View style={{flex:1, justifyContent: 'flex-end', padding: 20, marginBottom: 20}}>
                    <View style={drawerStyle.divider}  
                    />
                    {/* <TouchableOpacity style={drawerStyle.menuItemArea}>
                        <AppIcon large name={'settings'} style={drawerStyle.menuItemIcon} />
                        <Text style={drawerStyle.menuItemText}>{I18n.t('menu.settings')}</Text>
                        </TouchableOpacity> */}
                    <TouchableOpacity onPress={this.logout.bind(this)} style={drawerStyle.menuItemArea}>
                        <AppIcon large name={'logout'} style={drawerStyle.menuItemIcon} />
                        <Text style={drawerStyle.menuItemText}>{I18n.t('menu.logout')}</Text>
                    </TouchableOpacity>
            </View>
        )
    }

    getUserType(){
        const { user } = this.context;
        return user.group.name.toUpperCase();
    }

    render(){
        const { user } = this.context;
        return(
            <View style={{flex:1}}>
                <View style={drawerStyle.accountArea}>
                    <View
                        style={drawerStyle.avatarArea}
                    >
                        {user.firebase.avatar != "" &&
                            <MainContext.Consumer>
                            {context => (
                                <ImageBase64 
                                    data={context.user.firebase.avatar}
                                    style={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: 15
                                    }}
                                />
                            )}
                            </MainContext.Consumer>
                        }
                        <View style={drawerStyle.checkArea}>
                            <GradientButton 
                                vertical
                                colors={['rgb(170,4,8)','rgb(226,0,6)']}
                                width={32}
                                height={32}
                                title={<MaterialIcons size={18} name={'check'} />}
                                titleStyle={drawerStyle.editText}
                            /> 
                        </View>
                    </View>
                    <Text
                        numberOfLines={1}
                        style={drawerStyle.userName}
                    >
                        {`${user.magento.firstname} ${user.magento.lastname}`}
                    </Text>
                    <Text
                        style={drawerStyle.userType}
                    >
                        {this.getUserType()}
                    </Text>
                    <GradientButton 
                        onPress={() => { Actions.push('editProfile') }}
                        vertical
                        colors={['rgb(170,4,8)','rgb(226,0,6)']}
                        width={80}
                        height={36}
                        title={'Editar'}
                        titleStyle={drawerStyle.editText}
                    />
                </View>
                {this.renderItems()}
                {this.renderBottomItems()}
            </View>
        )
    }
}