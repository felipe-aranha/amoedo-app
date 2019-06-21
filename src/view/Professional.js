import React from 'react';
import { MainView } from './MainView';
import { Header } from '../components';
import { Keyboard, Image, View, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { secondaryColor, accountStyle } from '../style';

export default class Professional extends MainView{

    title='';
    barStyle = 'light-content';

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
                    style={{
                        width: 20,
                        height: 20
                    }}
                />
            </TouchableOpacity>
        )
    }

    toggleDrawer(){
        Keyboard.dismiss();
        this.props.navigation.toggleDrawer();
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
                    leftIconColor={'rgb(242,242,242)'}
                    titleStyle={accountStyle.registerHeaderText}
                    backgroundColor={secondaryColor}
                    leftIcon={
                        this.renderDrawerIcon()
                    }
                />
            </View>
        )
    }
}