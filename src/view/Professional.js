import React from 'react';
import { MainView } from './MainView';
import { Header, GradientButton, Text } from '../components';
import { Keyboard, Image, View, TouchableOpacity, FlatList } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { secondaryColor, accountStyle, mainStyle } from '../style';
import { Input } from 'react-native-elements';
import { UserService } from '../service/firebase/UserService';
import * as WebBrowser from 'expo-web-browser';

export default class Professional extends MainView{

    constructor(props,context){
        super(props,context);
        this.state = {
            items:  [],
            refreshList: 0,
        }
         
    }

    componentDidMount(){
        const context = this.context;
        if(context.redirect != false){
            const redirect = Object.assign({},context.redirect);
            context.redirect = false;
            switch(redirect.type){
                case 'promotion': 
                    if(redirect.link && redirect.link != ''){
                        WebBrowser.openBrowserAsync(redirect.link);
                    }
                    break;
                case 'budget':
                    Actions.push(context.user.isProfessional ? 'projects': 'cart', { budgetID: redirect.id })
                    break;
                case 'project':
                    UserService.getProject(redirect.id).then( project => {
                        if(project != false)
                            Actions.push(context.user.isProfessional ? 'addProject' : 'project', { project: project })
                    }) 
                    break;
            }
        }  
    }

    title='';
    barStyle = 'light-content';
    barColor = 'rgb(103,4,28)';
    titleStyle = {};
    showFloatingButton = false;
    floatingButtonTitle = '';
    icon = require('../../assets/images/icons/user-add-x2.png');
    listStyle = {}

    renderLeftIcon(){
        return this.renderDrawerIcon();
    }

    renderDrawerIcon(){
        return(
            <TouchableOpacity 
                onPress={this.toggleDrawer.bind(this)}
                hitSlop={{
                    top: 10, left: 10, right: 10, bottom: 10
                }}
            >
                <Image 
                    source={require('../../assets/images/icons/drawer-icon-x2.png')}
                    resizeMode={'contain'}
                    tintColor={'rgb(226,0,6)'}
                    style={{
                        width: 20,
                        height: 20,
                        tintColor: 'rgb(226,0,6)'
                    }}
                />
            </TouchableOpacity>
        )
    }

    renderEmptyList(image,title,subtitle){
        return (
            <View style={mainStyle.listArea}>
            <View
                style={mainStyle.emptyListArea}
            >
                {image != null &&
                    <Image 
                        source={image}
                        style={mainStyle.emptyListImage}
                        resizeMode={'contain'}
                    />
                }
            </View>
            <View style={mainStyle.emptyListTextArea}>
                <Text style={mainStyle.emptyListTitle}>{title}</Text>
                <Text style={mainStyle.emptyListSubtitle}>{subtitle}</Text>
            </View>
            </View>
        )
    }

    toggleDrawer(){
        Keyboard.dismiss();
        this.props.navigation.toggleDrawer();
    }

    renderSearch(){
        return(
            <Input
                leftIcon={{
                    type: 'material-community',
                    name: 'magnify',
                    color: 'rgb(226,0,6)'
                }}
                inputContainerStyle={mainStyle.searchInputContainer}
                containerStyle={{
                    paddingHorizontal: 0
                }}
            />
        )
    }

    keyStractor(item,key){
        return key.toString();
    }

    renderItem({item}){}

    renderContent(){
        return(
            <>
                {this.renderSearch()}
               
                    {this.state.items.length > 0 || this.state.loading ? 
                     <View style={{flex:1}}>
                        <FlatList 
                            data={this.state.items}
                            renderItem={this.renderItem.bind(this)}
                            keyStractor={this.keyStractor}
                            refreshing={this.state.loading}
                            style={this.listStyle}
                            key={this.state.refreshList || 0}
                        />
                    </View> :
                    this.renderEmptyList()
                    }
                
            </>
        )
    }

    onFloatButtonPress(){}

    isProfessional(){
        return this.context.user.isProfessional;
    }

    renderRightComponent(){
        return <></>
    }

    renderCenter(){
        return(
            <View style={{
                flex:1
            }}>
                    <Header 
                        containerStyle={{
                            borderBottomWidth: 0
                        }}
                        title={this.title}
                        handleBack={this.handleBack.bind(this)}
                        leftIconColor={this.leftIconColor || 'rgb(242,242,242)'}
                        titleStyle={[accountStyle.registerHeaderText,this.titleStyle]}
                        rightComponent={this.renderRightComponent()}
                        backgroundColor={this.barColor}
                        leftIcon={
                            this.renderLeftIcon()
                        }
                    />
                    {this.showFloatingButton &&
                        <View style={mainStyle.floatButtonArea}>
                            <GradientButton 
                                vertical
                                colors={['rgb(170,4,8)','rgb(226,0,6)']}
                                width={75}
                                height={75}
                                title={this.floatingButtonTitle}
                                titleStyle={mainStyle.floatButtonTextStyle}
                                icon={<Image 
                                    source={this.icon}
                                    style={{
                                        height:22,
                                        width:22
                                    }}
                                    resizeMode={'contain'}
                                />}
                                onPress={this.onFloatButtonPress.bind(this)}
                            />
                        </View>
                    }
                <View style={{flex:1}}>
                    {this.renderContent()}
                </View>
            </View>
        )
    }
}