import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MainView } from '../MainView';
import Swiper from 'react-native-swiper';
import { mainStyle } from '../../style';
import { StepOne } from './StepOne';
import { StepTwo } from './StepTwo';

export default class Wizard extends MainView{

    renderDot(){
        return <View style={mainStyle.wizardDot} />
    }

    renderActiveDot(){
        return <View style={mainStyle.wizardActiveDot} />
    }

    render(){
        return(
            <Swiper 
                dot={this.renderDot} 
                activeDot={this.renderActiveDot} 
                loop={false}
            >
                <StepOne />
            </Swiper>
        )
    }
}