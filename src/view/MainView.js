import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { mainStyle } from '../style';
import { Actions } from 'react-native-router-flux';
import { AppContext } from '../reducer';
import { AppStorage } from '../storage';
import I18n from '../i18n';

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

    async login(email,password){
        this.customerService.login(email,password).then(result => {
            if(!result){
                this.context.message(I18n.t('account.errorMessage.auth'));
                this.setState({
                    loading: false
                })
                return;
            }
            this.context.user = {
                ...this.context.user,
                token: this.customerService.getToken(),
                magento: result
            }
            Actions.reset('purgatory');
        }).catch(e => {
            this.context.message(I18n.t('account.errorMessage.login'));
            this.setState({
                loading: false
            })
        })
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