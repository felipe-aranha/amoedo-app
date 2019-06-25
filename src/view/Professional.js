import React from 'react';
import { MainView } from './MainView';
import { Header, GradientButton } from '../components';
import { Keyboard, Image, View, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { secondaryColor, accountStyle, drawerStyle, relativeWidth, deviceWidth, mainStyle } from '../style';
import { Input } from 'react-native-elements';

export default class Professional extends MainView{

    title='';
    barStyle = 'light-content';
    barColor = secondaryColor;
    titleStyle = {};
    floatButtonTextStyle={};
    showFloatingButton = false;
    floatingButtonTitle = '';
    icon;

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

    componentDidMount(){
        this.toggleDrawer();
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

    renderContent(){}

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
                        leftIconColor={'rgb(242,242,242)'}
                        titleStyle={[accountStyle.registerHeaderText,this.titleStyle]}
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
                                titleStyle={this.floatButtonTextStyle}
                                icon={this.icon}
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