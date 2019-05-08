import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { mainStyle } from '../style'

export class MainView extends React.Component{

    renderCenter(){}

    render(){
        return(
            <View style={[StyleSheet.absoluteFill, mainStyle.mainView]}>
                {this.renderCenter()}
            </View>
        )
    }
}