import React from 'react';
import { AccountBase } from '../AccountBase';
import { View, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Text } from '../../../components';
import { accountStyle } from '../../../style';
import { Actions } from 'react-native-router-flux';
import { MainContext } from '../../../reducer';
import { UserService } from '../../../service/firebase/UserService';

export class Pending extends AccountBase{

    constructor(props,context){
        super(props,context);
        this.state = {
            loading: true
        }
        this.db = UserService.getProfessionalDB();
        this.doc = null;
        this.subscription = () => {}
    }

    static contextType = MainContext;

    async componentDidMount(){
        const isProfessional = this.isProfessional()
        if(!isProfessional){
            this.context.userType = 'customer';
            this.processCustomerLogin();
            return;
        }
        docId = this.context.user.magento.id.toString();
        const userExists = await UserService.userExists(docId,this.db);
        if(userExists){
            this.doc = this.db.doc(docId);
            this.subscription = this.doc.onSnapshot( async doc => {
                const { user, clients } = doc.data();
                this.context.user.clients = await UserService.getMyClients(docId, clients);
                this.context.user.firebase = user;
                if(isProfessional){
                    switch(user.status){
                        case "approved":
                            this.context.openDrawer = true;
                            this.subscription();
                            Actions.reset('professional');
                            break;
                        default:
                            this.setState({
                                loading: false
                            });
                            break;
                    }
                } else {
                    this.subscription();
                    this.logout();
                }
            })
        } else {
            this.subscription();
            Actions.reset('account');
        }
    }

    async processCustomerLogin(){
        this.db = UserService.getCustomerDB();
        const firebaseUser = await UserService.getClient(this.context.user.magento.email).catch(e => {
            this.logout();
        });
        if(firebaseUser != null){
            this.context.user.firebase = firebaseUser;
            Actions.reset('customer');
        } else {
            Actions.reset('account')
        }

    }

    isProfessional(){
        const { app, user } = this.context;
        found = false;
        app.groups.filter(group => !group.customer).forEach(group => {
            if(group.id == user.magento.group_id){
                found = true;
                this.context.user.group = group;
                return;
            }
            group.children.forEach(child => {
                if(child.id == user.magento.group_id){
                    this.context.user.group = child;
                    
                    found = true;
                    return;
                }
            });
            if(found) return;
        })
        this.context.user.isProfessional = found;        
        return found || this.context.userType == 'professional';
    }

    imageBackground = require('../../../../assets/images/account/login-bg-x2.png');

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
                            onPress={() => { this.logout() }}
                        />
                        <Text style={accountStyle.pendingTitleText}>{'Cadastro realizado\ncom sucesso'}</Text>
                    </View> 
                    <View style={accountStyle.pendingDescriptionArea}>
                        <Text style={accountStyle.pendingDescriptionText}>{'Seu perfil está sendo analisado,\navisaremos em breve.'}</Text>
                    </View>
                </View>
                }
            </View>
        )
    }
}