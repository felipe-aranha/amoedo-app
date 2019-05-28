import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { mainStyle } from '../style';
import { Actions } from 'react-native-router-flux';

export class MainView extends React.Component{

    barStyle = 'dark-content';

    handleBack(){
        Actions.pop();
    }

    componentDidMount(){}

    renderCenter(){}

    render(){
        return(
            <View style={[StyleSheet.absoluteFill, mainStyle.mainView]}>
                <StatusBar barStyle={this.barStyle} />
                {this.renderCenter()}
            </View>
        )
    }
}