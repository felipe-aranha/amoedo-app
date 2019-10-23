import React from 'react';
import {
    Router, 
    Scene, 
    Drawer, 
    Modal,
    Tabs,
    Stack
} from 'react-native-router-flux';
import { View, StyleSheet, Dimensions, BackHandler } from 'react-native';
import { 
    Wizard,
    AccountType,
    Login,
    ProfileSelection,
    Register,
    Pending,
    Professional,
    AddClient,
    CustomerRegister,
    EditProfile
} from '../view';
import Toast from 'react-native-easy-toast';
import { MainContext } from '../reducer';
import { ProfessionalDrawer, Clients } from '../view/professional';
import { Projects } from '../view/professional';
import { AddProject } from '../view/professional';
import I18n from '../i18n';
import CustomerDrawer from '../view/customer/CustomerDrawer';
import CustomerProjects from '../view/customer/CustomerProjects';
import CustomerCart from '../view/customer/CustomerCart';
import CustomerCheckout from '../view/customer/CustomerCheckout';
import { Order } from '../view/customer/Order';
import { Points } from '../view/professional';
import CustomerProject from '../view/customer/CustomerProject';
import { ClientProjects } from '../view/professional';
import ChatView from '../view/chat/ChatView';
import RoomView from '../view/chat/RoomView';
import Logs from '../view/projectLogs/Logs';
import ProjectLog from '../view/projectLogs/ProjectLog';

export class Routes extends React.PureComponent{

    static contextType = MainContext;

    constructor(props,context){
        super(props,context);
        this.toast = React.createRef();
        context.message = this.message.bind(this);
        context.logout = this.logout.bind(this);
        context.login = this.login.bind(this);
        this.state = {
            isLoggedIn : context.user.magento != null && Object.keys(context.user.magento).length > 0
        }
    }

    componentDidMount(){
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress.bind(this));
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress.bind(this));
    }

    exitApp = false;

    handleBackPress(){
        if(this.exitApp)
            BackHandler.exitApp();
        else {
            this.exitApp = true;
            this.context.message(I18n.t('common.exitApp'),2000);
            setTimeout(() => {this.exitApp = false},2000)
        }
        return true;
    }

    logout(){
        this.setState({
            isLoggedIn: false
        })
    }

    login(){
        this.setState({
            isLoggedIn: true
        })
    }

    message(message, time = 2000, callback){
		if(this.toast.current != null)
			this.toast.current.show(message,time, () => {
				if(callback) callback
			});
	}

    removeMessage(){
		this.toast.close(1);
	}

    render(){
        const drawerWidth = Dimensions.get('window').width * 85 / 100;
        return(
            <View style={StyleSheet.absoluteFill}>
                <Router>
                    <Modal panHandlers={null} key='main'>
                        <Scene initial={this.context.user.token == null} hideNavBar key='accountType' component={AccountType} />
                        <Stack hideNavBar key='account'>
                            <Scene initial={!this.state.isLoggedIn} hideNavBar key='login' component={Login} />
                            <Scene initial={this.state.isLoggedIn} hideNavBar key='profileSelection' component={ProfileSelection} />
                            <Scene key='customerRegister' hideNavBar component={CustomerRegister} />
                            <Scene key='register' hideNavBar component={Register} />         
                        </Stack>
                        <Stack initial={this.context.user.token != null} hideNavBar key='purgatory'>
                            <Scene hideNavBar key='pendingAccount' component={Pending} />
                        </Stack>
                        <Drawer drawerWidth={drawerWidth} contentComponent={ProfessionalDrawer} hideNavBar key='professional'>
                            <Stack hideNavBar key='professionalStack'>
                                <Scene hideNavBar key='professionalMain' component={Professional} />
                                <Scene hideNavBar key='clients' component={Clients} /> 
                                <Scene hideNavBar key='clientProjects' component={ClientProjects} /> 
                                <Scene hideNavBar key='addClient' component={AddClient} />
                                <Scene initial hideNavBar key='projects' component={Projects} />
                                <Scene hideNavBar key='addProject' component={AddProject} />
                                <Scene hideNavBar key='points' component={Points} />
                                <Scene hideNavBar key='chat' component={ChatView} />
                                <Scene hideNavBar key='chatRoom' component={RoomView} />
                                <Scene hideNavBar key='logs' component={Logs} />
                                <Scene hideNavBar key='projectLog' component={ProjectLog} />
                            </Stack>
                        </Drawer>   
                        <Drawer drawerWidth={drawerWidth} contentComponent={CustomerDrawer} hideNavBar key='customer'>
                            <Stack hideNavBar key='customerStack'>
                                <Scene initial hideNavBar key='projects' component={CustomerProjects} />
                                <Scene hideNavBar key='cart' component={CustomerCart} />
                                <Scene hideNavBar key='checkout' component={CustomerCheckout} />
                                <Scene hideNavBar key='project' component={CustomerProject} />
                                <Scene hideNavBar key='chat' component={ChatView} />
                                <Scene hideNavBar key='chatRoom' component={RoomView} />
                                <Scene hideNavBar key='logs' component={Logs} />
                                <Scene hideNavBar key='projectLog' component={ProjectLog} />
                            </Stack>
                        </Drawer>
                        <Scene  hideNavBar key='order' component={Order} />
                        <Scene hideNavBar key='editProfile' component={EditProfile} />
                    </Modal>
                </Router>
                <Toast position={'bottom'} ref={this.toast} />
            </View>         
        );
    }
}