import React from 'react';
import {
    Router, 
    Scene, 
    Drawer, 
    Modal,
    Tabs,
    Stack
} from 'react-native-router-flux';
import { View, StyleSheet } from 'react-native';
import { 
    Wizard,
    AccountType,
    Login,
    ProfileSelection,
    Register,
    Pending
} from '../view';
import Toast from 'react-native-easy-toast';
import { MainContext } from '../reducer';

export class Routes extends React.Component{

    static contextType = MainContext;

    constructor(props,context){
        super(props,context);
        this.toast = React.createRef();
        context.message = this.message.bind(this);
    }

    shouldComponentUpdate(){
        return false;
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
        return(
            <View style={StyleSheet.absoluteFill}>
                <Router>
                    <Modal key='main'>
                        <Scene initial={this.context.user.token == null} hideNavBar key='accountType' component={AccountType} />
                        <Stack hideNavBar key='account'>
                            <Scene hideNavBar key='login' component={Login} />
                            <Scene hideNavBar key='profileSelection' component={ProfileSelection} />
                            <Scene key='register' component={Register} />
                        </Stack>
                        <Stack initial={this.context.user.token != null} hideNavBar key='purgatory'>
                            <Scene hideNavBar key='pendingAccount' component={Pending} />
                        </Stack>
                    </Modal>
                </Router>   
                <Toast position={'center'} ref={this.toast} />
            </View>         
        );
    }
}