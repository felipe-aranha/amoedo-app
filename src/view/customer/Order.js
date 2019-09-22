import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { accountStyle } from '../../style';
import { Actions } from 'react-native-router-flux';
import I18n from '../../i18n';
import { Feather } from '@expo/vector-icons';
import { Text } from '../../components';
import { AccountBase } from '../account/AccountBase';
import { CheckoutService } from '../../service/CheckoutService';
import { UserService } from '../../service/firebase/UserService';

export class Order extends AccountBase {

    imageBackground = require('../../../assets/images/account/login-bg-x2.png');

    constructor(props,context){
        super(props,context);
        this.state = {
            loading: true,
            orderId: -1
        }
    }

    handleClose(){
        if(!this.state.loading)
            Actions.reset('customer')
    }

    componentDidMount(){
        const { project, order, room } = this.props;
        const checkoutService = new CheckoutService();
        checkoutService.setOrderComment(order, project).then(response => {
            checkoutService.getOrder(order).then(r => {
                this.setState({
                    loading: false,
                    orderId: r.increment_id
                })
            }).catch(e => {
                this.setState({
                    loading: false,
                    orderId: undefined
                })
            })
        }).then(() => {
            UserService.setQuoteStatus(project.id, room, 'pending');
        }).catch(e => {
            console.log(e);
            this.setState({
                loading: false,
                orderId: undefined
            })
        })
    }

    renderContent(){
        return(
            <View style={accountStyle.pendingArea}>
                {this.state.loading ? 
                        <ActivityIndicator color={'#fff'} size={'large'} />
                    : 
                <View
                    style={accountStyle.pendingBg}
                >
                    <View style={accountStyle.pendingTitleArea}>
                        <Feather 
                            name={'x'}
                            color={'#fff'}
                            size={32}
                            style={{
                                position: 'absolute',
                                right: 0,
                                top: 0,
                                padding: 10
                            }}
                            onPress={this.handleClose.bind(this)}
                        />
                        <Text style={accountStyle.pendingTitleText}>{I18n.t('order.title')}</Text>
                    </View> 
                    <View style={accountStyle.pendingDescriptionArea}>
                        <Text style={accountStyle.pendingDescriptionText}>{I18n.t(this.props.paymentMethod == 'credit' ? 'order.messageCredit' : 'order.messageBillet' , { order : this.state.orderId || this.props.order || ''})}</Text>
                    </View>
                </View>
                }
            </View>
        )
    }

}