import React from 'react';
import { View, TouchableOpacity } from 'react-native'
import { MainContext } from '../../reducer';
import { Text, GradientButton, AppIcon, ImageBase64 } from '../../components';
import { drawerStyle } from '../../style';
import { MaterialIcons } from '@expo/vector-icons';
import { MainView } from '../MainView';

export default class ProfessionalDrawer extends MainView{

    static contextType = MainContext;

    render(){
        const { user } = this.context;
        return(
            <View style={{flex:1}}>
                <View style={drawerStyle.accountArea}>
                    <View
                        style={drawerStyle.avatarArea}
                    >
                        {user.firebase.avatar != "" &&
                            <ImageBase64 
                                data={user.firebase.avatar}
                                style={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: 15
                                }}
                            />
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
                        numOfLines={1}
                        style={drawerStyle.userName}
                    >
                        {`${user.magento.firstname} ${user.magento.lastname}`}
                    </Text>
                    <Text
                        style={drawerStyle.userType}
                    >
                        {user.group.name.toUpperCase()}
                    </Text>
                    <GradientButton 
                        vertical
                        colors={['rgb(170,4,8)','rgb(226,0,6)']}
                        width={80}
                        height={36}
                        title={'Editar'}
                        titleStyle={drawerStyle.editText}
                    />
                </View>
                <View style={drawerStyle.menuArea}>
                    <TouchableOpacity style={drawerStyle.menuItemArea}>
                        <AppIcon large name={'clients'} style={drawerStyle.menuItemIcon} />
                        <Text style={drawerStyle.menuItemText}>Clientes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={drawerStyle.menuItemArea}>
                        <AppIcon large name={'list'} style={drawerStyle.menuItemIcon} />
                        <Text style={drawerStyle.menuItemText}>Projetos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={drawerStyle.menuItemArea}>
                        <AppIcon large name={'occurence'} style={drawerStyle.menuItemIcon} />
                        <Text style={drawerStyle.menuItemText}>Ocorrências</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={drawerStyle.menuItemArea}>
                        <AppIcon large name={'chat'} style={drawerStyle.menuItemIcon} />
                        <Text style={drawerStyle.menuItemText}>Chat</Text>
                    </TouchableOpacity>
                </View>
                <View style={{flex:1, justifyContent: 'flex-end', padding: 20, marginBottom: 20}}>
                        <View style={{
                                backgroundColor: 'rgb(221,221,221)',
                                height: 1,
                                width: 150,
                                marginHorizontal: 20,
                                marginVertical: 20
                            }}  
                        />
                        <TouchableOpacity style={drawerStyle.menuItemArea}>
                            <AppIcon large name={'settings'} style={drawerStyle.menuItemIcon} />
                            <Text style={drawerStyle.menuItemText}>Configurações</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.logout.bind(this)} style={drawerStyle.menuItemArea}>
                            <AppIcon large name={'logout'} style={drawerStyle.menuItemIcon} />
                            <Text style={drawerStyle.menuItemText}>Sair</Text>
                        </TouchableOpacity>
                </View>
            </View>
        )
    }
}