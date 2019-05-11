import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { mainStyle } from '../style';
import { Actions } from 'react-native-router-flux';

export class MainView extends React.Component{

    handleBack(){
        Actions.pop();
    }

    renderCenter(){}

    render(){
        return(
            <View style={[StyleSheet.absoluteFill, mainStyle.mainView]}>
                {this.renderCenter()}
            </View>
        )
    }
}