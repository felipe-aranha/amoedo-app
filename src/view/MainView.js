import React from 'react';
import { View, Modal, StyleSheet, StatusBar, ActivityIndicator } from 'react-native';
import { mainStyle } from '../style';
import { Actions } from 'react-native-router-flux';
import { AppContext, MainContext } from '../reducer';
import { AppStorage } from '../storage';
import I18n from '../i18n';
import * as Permissions from 'expo-permissions';
import { Notifications } from 'expo';
import { CustomerService } from '../service/CustomerService';

export class MainView extends React.Component{

    static contextType = MainContext;

    subscription = null;

    barStyle = 'dark-content';

    handleBack(){
        Actions.pop();
    }

    componentDidMount(){}

    componentWillUnmount(){
        if(this.subscription && this.subscription != null){
            this.subscription();
        }
    }

    renderCenter(){}

    async logout(){
        try{
            const { magento } = this.context.user || {};
            const { id } = magento || -1;
            await this.setToken(id);
        } catch(e) {
        }
        await AppStorage.setUser('','');
        this.context.user = AppContext.user;
        this.context.logout();
        Actions.reset('account');
    }

    async login(email,password){
        this.customerService.login(email,password).then( async result => {
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
            this.context.login();
            await this.setToken(result.id, true);
            Actions.reset('purgatory');
        }).catch(e => {
            this.context.message(I18n.t('account.errorMessage.login'));
            this.setState({
                loading: false
            })
        })
    }

    async setToken(customerId, login=false){
        if(!login){
            if(this.customerService == null || !this.customerService){
                this.customerService = new CustomerService();
            }
            return this.customerService.removePushToken(customerId);
        }
        const { status: existingStatus } = await Permissions.getAsync(
            Permissions.NOTIFICATIONS
        );
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            return;
        }
        let token = await Notifications.getExpoPushTokenAsync();
        return this.customerService.addPushToken(customerId,token);
    }

    toggleModalLoading(){
        this.setState({
            modalLoading: !this.state.modalLoading
        })
    }

    closeModalLoading(){
        this.setState({
            modalLoading: false
        })
    }

    openModalLoading(){
        this.setState({
            modalLoading: true
        })
    }

    renderLoadingModal(){
        const { modalLoading } = this.state || {};
        if(typeof(modalLoading) !== 'undefined' && modalLoading != null)
            return(
                <Modal
                    visible={modalLoading}
                    onRequestClose={() => {}}
                    transparent
                >
                    <View style={{
                        flex:1,
                        backgroundColor: 'rgba(0,0,0,0.3)',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <ActivityIndicator color={'#fff'} size={'large'} />
                    </View>
                </Modal>
            )
    }

    render(){
        return(
            <View style={[StyleSheet.absoluteFill, mainStyle.mainView]}>
                <StatusBar barStyle={this.barStyle} />
                {this.renderCenter()}
                {this.renderLoadingModal()}
            </View>
        )
    }
}