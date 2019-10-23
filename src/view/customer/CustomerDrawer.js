import React from 'react';
import ProfessionalDrawer from '../professional/ProfessionalDrawer';
import { View, TouchableOpacity } from 'react-native';
import { Text, AppIcon } from '../../components';
import { drawerStyle } from '../../style';
import I18n from '../../i18n';

export default class CustomerDrawer extends ProfessionalDrawer{ 

    getUserType(){
        return I18n.t('section.client');
    }

    renderItems(){
        return(
            <View style={drawerStyle.menuArea}>
                <TouchableOpacity onPress={() => {this.goTo('projects')}} style={drawerStyle.menuItemArea}>
                    <AppIcon large name={'list'} style={drawerStyle.menuItemIcon} />
                    <Text style={drawerStyle.menuItemText}>{I18n.t('menu.projects')}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.goTo('logs')}} style={drawerStyle.menuItemArea}>
                    <AppIcon large name={'occurrence'} style={drawerStyle.menuItemIcon} />
                    <Text style={drawerStyle.menuItemText}>{I18n.t('menu.projectLogs')}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {this.goTo('chat')}} style={drawerStyle.menuItemArea}>
                    <AppIcon large name={'chat'} style={drawerStyle.menuItemIcon} />
                    <Text style={drawerStyle.menuItemText}>{I18n.t('menu.chat')}</Text>
                </TouchableOpacity> 
            </View>
        )
    }

}