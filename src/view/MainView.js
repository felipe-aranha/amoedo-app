import React from 'react';
import { View, Modal, StyleSheet, StatusBar, ActivityIndicator } from 'react-native';
import { mainStyle } from '../style';
import { Actions } from 'react-native-router-flux';
import { AppContext, MainContext } from '../reducer';
import { AppStorage } from '../storage';
import I18n from '../i18n';

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
        await AppStorage.setUser('','');
        this.context.user = AppContext.user;
        this.context.logout();
        Actions.reset('account');
    }

    async login(email,password){
        this.customerService.login(email,password).then(result => {
            console.log(result);
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
            Actions.reset('purgatory');
        }).catch(e => {
            this.context.message(I18n.t('account.errorMessage.login'));
            this.setState({
                loading: false
            })
        })
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