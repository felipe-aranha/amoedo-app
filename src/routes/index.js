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
    CustomerRegister
} from '../view';
import Toast from 'react-native-easy-toast';
import { MainContext } from '../reducer';
import { ProfessionalDrawer, Clients } from '../view/professional';
import { Projects } from '../view/professional';
import { AddProject } from '../view/professional';
import I18n from '../i18n';

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
                        <Stack hideNavBar key='professional'>
                            <Drawer drawerWidth={drawerWidth} contentComponent={ProfessionalDrawer} hideNavBar key='professionalDrawer'>
                                <Scene hideNavBar key='professionalMain' component={Professional} />
                                <Scene hideNavBar key='clients' component={Clients} /> 
                                <Scene hideNavBar key='addClient' component={AddClient} />
                                <Scene initial hideNavBar key='projects' component={Projects} />
                                <Scene hideNavBar key='addProject' component={AddProject} />
                            </Drawer>   
                        </Stack>
                    </Modal>
                </Router>
                <Toast position={'bottom'} ref={this.toast} />
            </View>         
        );
    }
}