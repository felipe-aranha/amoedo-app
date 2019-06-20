import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { mainStyle } from '../style';
import { Actions } from 'react-native-router-flux';
import { AppContext } from '../reducer';
import { AppStorage } from '../storage';

export class MainView extends React.Component{

    barStyle = 'dark-content';

    handleBack(){
        Actions.pop();
    }

    componentDidMount(){}

    renderCenter(){}

    async logout(){
        await AppStorage.setUser('','');
        this.context.user = AppContext.user;
        Actions.reset('account');
    }

    render(){
        return(
            <View style={[StyleSheet.absoluteFill, mainStyle.mainView]}>
                <StatusBar barStyle={this.barStyle} />
                {this.renderCenter()}
            </View>
        )
    }
}